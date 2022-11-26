import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../../components/Loader';
import PayAll from '../../components/payAll';
import PayRoyalty from '../../components/payRoyalty';
import PaySubscription from '../../components/paySubscription';

const styles = require('../../styles/dashboardB.module.css');

export default function DashboardB() {
    const wallet = useAnchorWallet();
    const walletAddress = wallet?.publicKey.toString();
    const [isLoading, setIsLoading] = useState(true);
    const [activeNfts, setActiveNfts] = useState([]);
    const [inactiveNfts, setInactiveNfts] = useState([]);
    const [payment, setPayment] = useState([]);
    const [hasNft, setHasNft] = useState(false);
    const [inactiveSubscriptonDates, setInactiveSubscriptionDates] = useState([]);
    const [activeSubscriptonDates, setactiveSubscriptionDates] = useState([]);

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

    async function fetchPaymentDue() {
        for (let nft of inactiveNfts) {
            const url = '/api/utils/fetchPayment';

            axios.request(url, { params: { mint: nft.tokenAddress } }).then((response) => {
                const data = response.data;
                setPayment((prev) => [...prev, parseFloat(data.subscription_fee)]);
                setInactiveSubscriptionDates((prev) => [...prev, parseInt(data.subscription_renew)]);
            });
        }
        for (let nft of activeNfts) {
            const url = '/api/utils/fetchPayment';

            axios.request(url, { params: { mint: nft.tokenAddress } }).then((response) => {
                const data = response.data;
                setPayment((prev) => [...prev, parseFloat(data.subscription_fee)]);
                setactiveSubscriptionDates((prev) => [...prev, parseInt(data.subscription_renew)]);
            });
        }
    }
    useEffect(() => {
        fetchPaymentDue();
    }, [inactiveNfts, activeNfts]);

    return (
        <div className={styles.container}>
            <div className={styles.titleContainer}>
                <h2 className={styles.title}>Dashboard: Option B</h2>
            </div>
            {!wallet ? (
                <div className={styles.walletButtonContainer}>
                    <h2>Please Connect Wallet in Navigation Bar</h2>
                </div>
            ) : (
                <div className={styles.module}>
                    <h2 className={styles.nftTitle} style={{ color: 'black' }}>
                        Active Nfts
                    </h2>
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
                                            {activeNfts.map((nft, i) => {
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
                                                            <h4> Active Until:</h4>
                                                            <h4 style={{ marginTop: '0', letterSpacing: '1px' }}>
                                                                {activeSubscriptonDates.length === activeNfts.length ? (
                                                                    <>
                                                                        {new Date(
                                                                            activeSubscriptonDates[i]
                                                                        ).toLocaleDateString()}
                                                                    </>
                                                                ) : (
                                                                    <img
                                                                        src="/media/images/icons/spinner.gif"
                                                                        alt="spinner"
                                                                        style={{ height: '80px', width: '80px' }}
                                                                    />
                                                                )}
                                                            </h4>
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

                        <h2 className={styles.nftTitle} style={{ color: 'black' }}>
                            Inactive Nfts
                        </h2>
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
                                                            <h3>Payment Due:</h3>
                                                            {payment[i] ? (
                                                                <>
                                                                    <h3 style={{ marginTop: '0' }}>
                                                                        <img
                                                                            src="/media/images/icons/sol-logo.png"
                                                                            alt="sol"
                                                                            style={{ height: '20px', width: '20px' }}
                                                                        />
                                                                        {payment[i].toFixed(3)} SOL
                                                                    </h3>
                                                                </>
                                                            ) : (
                                                                <img
                                                                    src="/media/images/icons/spinner.gif"
                                                                    alt="spinner"
                                                                    style={{ height: '80px', width: '80px' }}
                                                                />
                                                            )}
                                                            <PaySubscription
                                                                mint={nft.tokenAddress}
                                                                fee={payment?.[i]?.toFixed(3)}
                                                            />
                                                            <h4> Expired On:</h4>
                                                            <h4 style={{ marginTop: '-5px', letterSpacing: '1px' }}>
                                                                {inactiveSubscriptonDates.length ===
                                                                inactiveNfts.length ? (
                                                                    <>
                                                                        {new Date(
                                                                            inactiveSubscriptonDates[i]
                                                                        ).toLocaleDateString()}
                                                                    </>
                                                                ) : (
                                                                    <img
                                                                        src="/media/images/icons/spinner.gif"
                                                                        alt="spinner"
                                                                        style={{ height: '40px', width: '40px' }}
                                                                    />
                                                                )}
                                                            </h4>
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
