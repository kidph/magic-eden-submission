import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../../components/Loader';
import PayAll from '../../components/payAll';
import PayRoyalty from '../../components/payRoyalty';

const styles = require('../../styles/dashboard.module.css');

export default function DashboardA() {
    const wallet = useAnchorWallet();
    const walletAddress = wallet?.publicKey.toString();
    const [isLoading, setIsLoading] = useState(true);
    const [activeNfts, setActiveNfts] = useState([]);
    const [inactiveNfts, setInactiveNfts] = useState([]);
    const [royalties, setRoyalties] = useState([]);
    const [hasNft, setHasNft] = useState(false);

    async function getNfts() {
        const url = '/api/utils/getNfts';

        axios.request(url, { params: { walletAddress: walletAddress } }).then((response) => {
            if (response.data.length) {
                setHasNft(true);
                response.data.forEach((nft, i) => {
                    nft.attributes[1].value === 'Active'
                        ? setActiveNfts((prev) => [...prev, nft])
                        : setInactiveNfts((prev) => [...prev, nft]);

                    i === response.data.length - 1 && setIsLoading(false);
                });
            } else {
                setHasNft(false);
                setIsLoading(false);
            }
        });
    }
    useEffect(() => {
        if (wallet?.publicKey) getNfts();
    }, [wallet]);

    async function fetchRoyaltyDue() {
        for (let nft of inactiveNfts) {
            const url = '/api/utils/fetchRoyalty';

            axios.request(url, { params: { mint: nft.tokenAddress } }).then((response) => {
                const data = response.data;
                setRoyalties((prev) => [...prev, data.activation_fee === '0' ? 0.01 : parseFloat(data.activation_fee)]);
            });
        }
    }
    useEffect(() => {
        if (inactiveNfts.length) fetchRoyaltyDue();
    }, [inactiveNfts]);

    return (
        <div className={styles.container}>
            <div className={styles.titleContainer}>
                <h2 className={styles.title}>Royalty Dashboard</h2>
            </div>
            {!wallet ? (
                <div className={styles.walletButtonContainer}>
                    <h2>Please Connect Wallet in Navigation Bar</h2>
                </div>
            ) : (
                <div className={styles.module}>
                    <h2 className={styles.nftTitle}>Active Nfts</h2>
                    <div className={styles.dashboardContainer}>
                        <div className={styles.nfts}>
                            {isLoading ? (
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        height: '100%',
                                    }}
                                >
                                    <Loader />
                                </div>
                            ) : (
                                <>
                                    {activeNfts.length ? (
                                        <>
                                            {activeNfts.map((nft) => {
                                                return (
                                                    <div key={nft.name} className={styles.nftContainer}>
                                                        <div className={styles.nameplate}>{nft.name}</div>
                                                        <img
                                                            src={nft.image}
                                                            className={styles.nftImage}
                                                            alt={nft.name}
                                                        />
                                                    </div>
                                                );
                                            })}
                                        </>
                                    ) : (
                                        <h2>No NFTs found</h2>
                                    )}
                                </>
                            )}
                        </div>

                        <h2 className={styles.nftTitle}>Inactive Nfts</h2>
                        <div className={styles.nfts}>
                            {inactiveNfts.length > 1 && (
                                <PayAll
                                    mints={inactiveNfts}
                                    fees={royalties.reduce((prev, current) => prev + current, 0)}
                                />
                            )}
                            {isLoading ? (
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        height: '100%',
                                    }}
                                >
                                    <Loader />
                                </div>
                            ) : (
                                <>
                                    {inactiveNfts.length ? (
                                        <>
                                            {inactiveNfts.map((nft, i) => {
                                                return (
                                                    <div className={styles.inactiveContainer} key={i}>
                                                        <div className={styles.nftContainer}>
                                                            <div className={styles.nameplate}>{nft.name}</div>
                                                            <img
                                                                src={nft.image}
                                                                className={styles.nftImage}
                                                                alt={nft.name}
                                                            />
                                                        </div>

                                                        <div className={styles.buttonGroup}>
                                                            <h3>Royalty Owed:</h3>
                                                            {royalties[i] ? (
                                                                <>
                                                                    <h3 style={{ marginTop: '0' }}>
                                                                        <img
                                                                            src="/media/images/icons/sol-logo.png"
                                                                            alt="sol"
                                                                            style={{ height: '20px', width: '20px' }}
                                                                        />
                                                                        {royalties[i].toFixed(3)} SOL
                                                                    </h3>
                                                                </>
                                                            ) : (
                                                                <img
                                                                    src="/media/images/icons/spinner.gif"
                                                                    alt="spinner"
                                                                    style={{ height: '80px', width: '80px' }}
                                                                />
                                                            )}
                                                            <PayRoyalty
                                                                mint={nft.tokenAddress}
                                                                fee={royalties?.[i]?.toFixed(3)}
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </>
                                    ) : (
                                        <h2>No NFTs found</h2>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
            <ToastContainer transition={Bounce} position="bottom-right" theme="colored" />
        </div>
    );
}
