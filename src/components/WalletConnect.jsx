import React, { useEffect, useState } from 'react';
import Web3 from 'web3';

const WalletConnect = () => {
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const checkConnection = async () => {
            if (window.ethereum) {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
                    .catch((error) => {
                        console.error('Error requesting accounts:', error);
                        // Optionally handle error gracefully (e.g., display user-friendly message)
                    });

                if (accounts && accounts.length > 0) {
                    setIsConnected(true);
                } else {
                    // If accounts array is empty, retry connection request after a short delay
                    // This helps ensure users who haven't granted access yet see the request
                    setTimeout(async () => {
                        const retryAccounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
                            .catch((error) => {
                                console.error('Error requesting accounts (retry):', error);
                            });
                        if (retryAccounts && retryAccounts.length > 0) {
                            setIsConnected(true);
                        }
                    }, 1000); // Adjust delay as needed
                }
            }
        };

        // Immediately check connection and request if not connected
        checkConnection();

        // Optional event listener to handle account changes (e.g., switching accounts)
        window.ethereum.on('accountsChanged', (accounts) => {
            if (accounts && accounts.length > 0) {
                setIsConnected(true);
            } else {
                setIsConnected(false);
            }
        });

        // Cleanup function to remove event listener on component unmount
        return () => {
            window.ethereum.removeListener('accountsChanged', (accounts) => {});
        };
    }, []);

    // No longer needed as connection is handled automatically
    // const connectWallet = async () => {
    //     // ... (connection logic moved to useEffect)
    // };

    return (
        <div>
           
        </div>
    );
};

export default WalletConnect;

