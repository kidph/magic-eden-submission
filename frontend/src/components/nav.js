import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Nav({ children /* children is passed in to load pages because nav wraps the components */ }) {
    //declare and initialize state variables to handle navbar expansion
    //and to determine which page is currently selected
    const [isExpanded, setIsExpanded] = useState(false);
    const [pageSelected, setPageSelected] = useState('');

    //initialize the wallet object to check for isConnected
    const wallet = useAnchorWallet();
    const router = useRouter();

    //function to handle navbar expansion and closing
    const toggleNav = () => {
        setIsExpanded(!isExpanded);
    };

    //on page change, set the page selection to the appropriate page
    useEffect(() => {
        if (router.pathname === '/') {
            setPageSelected('home');
        } else if (router.pathname === '/dashboard/option-a') {
            setPageSelected('dash-a');
        } else if (router.pathname === '/dashboard/option-b') {
            setPageSelected('dash-b');
        }
    }, [router.pathname]);

    return (
        <>
            {!isExpanded ? (
                <div className="menu-btn" onClick={toggleNav}>
                    <div className="btn-line" id="close"></div>
                    <div className="btn-line" id="close"></div>
                    <div className="btn-line" id="close"></div>
                </div>
            ) : (
                <>
                    <div className="backdrop-filter" onClick={toggleNav}></div>
                    <div className="nav-container">
                        <div className="menu-btn close" onClick={toggleNav}>
                            <div className="btn-line"></div>
                            <div className="btn-line"></div>
                            <div className="btn-line"></div>
                        </div>
                        <Link href="/">
                            <h1
                                className="broken-logo"
                                onClick={() => {
                                    toggleNav();
                                    setPageSelected('home');
                                }}
                            >
                                b̸r̶o̷k̷e̶n̵.̶
                            </h1>
                        </Link>
                        <div className="menu">
                            <Link href="/dashboard/option-a">
                                <div
                                    className={pageSelected === 'dash-a' ? 'menu-item-selected' : 'menu-item-top'}
                                    onClick={() => setPageSelected('dash-a')}
                                >
                                    Royalty Dashboard
                                </div>
                            </Link>
                            <Link href="/dashboard/option-b">
                                <div
                                    className={pageSelected === 'dash-b' ? 'menu-item-selected' : 'menu-item'}
                                    onClick={() => setPageSelected('dash-b')}
                                >
                                    Subscription Dashboard
                                </div>
                            </Link>
                        </div>
                        <div className="icon-group">
                            <a href="https://github.com/kidph" target="_blank" rel="noreferrer">
                                <img
                                    src="/media/images/nav-icons/github.png"
                                    className="icon-group-icon"
                                    alt="github"
                                />
                            </a>
                            <a href="https://twitter.com/DopeTweetsBrah" target="_blank" rel="noreferrer">
                                <img
                                    src="/media/images/nav-icons/twitter.png"
                                    className="icon-group-icon"
                                    alt="twitter"
                                />
                            </a>
                        </div>
                        <div className="wallet-container">
                            <h4>Wallet</h4>
                            <WalletMultiButton className="wallet">
                                {!wallet ? (
                                    <>
                                        <img
                                            src="/media/images/nav-icons/digital-wallet.png"
                                            alt="wallet"
                                            className="wallet-icon"
                                        />
                                        Connect
                                    </>
                                ) : (
                                    <p className="wallet-text">{wallet.publicKey.toString()}</p>
                                )}
                            </WalletMultiButton>
                        </div>
                    </div>
                </>
            )}

            {children}
        </>
    );
}
