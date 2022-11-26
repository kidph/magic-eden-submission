import Link from 'next/link';
import { useEffect, useState } from 'react';
const Home = () => {
    //Set a loading state and delay reveal 3000 milliseconds on initial load
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 3000);
    }, []);

    return (
        <div className="main-container" id="main-container">
            <h1>Royalty Protection and Ancillery Revenue</h1>
            <div className="github">
                <a
                    href="https://github.com/kidph/magic-eden-submission"
                    target="_blank"
                    rel="noreferrer"
                    style={{ display: 'flex' }}
                >
                    <img src="/media/images/nav-icons/github.png" alt="github" className="github-image" />
                    <h4>Find the Repository Here.</h4>
                </a>
            </div>
            <div className="section">
                {isLoading ? (
                    <div className="loading">
                        <div className="loading-text">
                            <span className="loading-text-words">L</span>
                            <span className="loading-text-words">O</span>
                            <span className="loading-text-words">A</span>
                            <span className="loading-text-words">D</span>
                            <span className="loading-text-words">I</span>
                            <span className="loading-text-words">N</span>
                            <span className="loading-text-words">G</span>
                        </div>
                    </div>
                ) : (
                    <div className="info-container">
                        <div className="link-container">
                            <Link href="/dashboard/option-a">
                                <div className="a">
                                    Royalty Dashboard
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </Link>
                            <Link href="/dashboard/option-b">
                                <div className="a">
                                    Subscription Dashboard
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
