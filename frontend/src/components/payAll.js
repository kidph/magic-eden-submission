import { useAnchorWallet, useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import axios from 'axios';
import { useState } from 'react';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function PayAll({ mints, fees }) {
    const connection = new Connection(
        'https://frosty-shy-violet.solana-mainnet.quiknode.pro/45c1c31d6e058e521eb0c8d9be91c2bc640fbfae/',
        'confirmed'
    );
    let toastPromise;
    const fromWallet = useAnchorWallet();
    const { sendTransaction } = useWallet();
    const [txSending, setTxSending] = useState(false);
    const [isTx, setIsTx] = useState(false);
    const [tx, setTx] = useState('');
    const [allNfts, setAllNfts] = useState(mints);
    const [updating, setUpdating] = useState(false);
    const [errors, setErrors] = useState([]);

    async function pay() {
        try {
            setTxSending(true);
            toastPromise = toast.loading('Sending Transaction');
            const royaltyAddress = new PublicKey('63CgiXpqYeziY9swqNw3oTuQy1TuNhcykGUy99q8X816');
            const solToPay = parseInt(fees * 1000000000);

            const tx = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: fromWallet.publicKey,
                    lamports: solToPay,
                    toPubkey: royaltyAddress,
                })
            );

            const signature = await sendTransaction(tx, connection);
            const latestBlockHash = await connection.getLatestBlockhash();

            await connection.confirmTransaction({
                blockhash: latestBlockHash.blockhash,
                lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
                signature: signature,
                Commitment: 'confirmed',
            });

            const confirmation = await connection.getSignatureStatus(signature);

            if (confirmation.value.confirmationStatus === 'confirmed' || 'finalized') {
                toast.update(toastPromise, {
                    render: 'Completed! ' + signature,
                    type: 'success',
                    isLoading: false,
                    autoClose: 3000,
                });
                setTxSending(false);
                setTx(signature);
                setIsTx(true);
                setUpdating(true);
                toast.update(toastPromise, {
                    render: 'Putting your NFT back together!',
                    type: 'loading',
                    isLoading: true,
                });
                let promises = [];

                for (let i = 0; i < allNfts.length; i++) {
                    toast.update(toastPromise, {
                        render: ` Restoring ${allNfts[i].name}`,
                        type: 'loading',
                    });
                    promises.push(
                        new Promise((resolve) => {
                            axios
                                .request('/api/utils/restoreNft', { params: { mint: allNfts[i].tokenAddress } })
                                .then((response) => {
                                    if (response.data) {
                                        toast.update(toastPromise, {
                                            render: ` NFT ${allNfts[i].name} has been restored`,
                                            type: 'success',
                                        });

                                        setTimeout(() => {
                                            resolve();
                                        }, 2000);
                                    } else {
                                        toast.update(toastPromise, {
                                            render: `Cannot confirm NFT ${allNfts[i].name} was restored.`,
                                            type: 'warning',
                                        });
                                        setErrors((prev) => [...prev, allNfts[i].name]);
                                        setTimeout(() => {
                                            resolve();
                                        }, 2000);
                                    }
                                })
                                .catch((err) => {
                                    console.log(err.message);
                                });
                        })
                    );
                }
                await Promise.all(promises);
                if (errors.length) {
                    toast.update(toastPromise, {
                        render: `Could Not Confirm NFTS: ${errors.map((each) => {
                            return each;
                        })}`,
                        type: 'warning',
                    });
                    setUpdating(false);
                } else {
                    toast.update(toastPromise, {
                        render: ` All NFTs successfully restored`,
                        type: 'success',
                        isLoading: false,
                        autoClose: 3000,
                    });
                    setUpdating(false);
                }
            } else {
                toast.update(toastPromise, {
                    render: 'Tx Unconfirmed',
                    type: 'error',
                    isLoading: false,
                    autoClose: 3000,
                });
                setTxSending(false);
            }
        } catch (err) {
            console.log(err.message);
            setTxSending(false);
            toast.update(toastPromise, { render: err.message, type: 'error', isLoading: false, autoClose: 3000 });
        }
    }

    return (
        <>
            <button className="pay-all-btn" onClick={pay}>
                Pay All <p>({fees} SOL)</p>
            </button>
            {isTx && (
                <div
                    className="modalContainer"
                    onClick={() => {
                        setIsTx(false);
                    }}
                >
                    <div className="txContainer">
                        <h2>Transaction Successful</h2>
                        <h3>
                            {!updating && errors?.length < 1
                                ? 'Your NFTs have been repaired and access restored! Thank you for paying the royalties!'
                                : updating
                                ? 'Payment Complete, updating your NFTs'
                                : 'Some NFTs may not have updated.  Please check!'}
                        </h3>
                        <h3>View Your Transaction</h3>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <h4 className="txText">{tx}</h4>
                            <a href={`https://solscan.io/tx/${tx}`} target="_blank" rel="noreferrer">
                                <img className="explorerIcons" src="/media/images/icons/solscan.png" alt="solscan" />
                            </a>
                            <a href={`https://solana.fm/tx/${tx}?cluster=mainnet-qn1`} target="_blank" rel="noreferrer">
                                <img className="explorerIcons" src="/media/images/icons/fm.png" alt="fm" />
                            </a>
                        </div>
                    </div>
                </div>
            )}
            <ToastContainer transition={Bounce} position="bottom-right" theme="colored" />
        </>
    );
}
