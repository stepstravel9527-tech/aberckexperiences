import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import styles from './QRScanner.module.scss';

const QRScanner = ({ setScanner, setWalletUserAddress }) => {
    const [walletAddress, setWalletAddress] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const qrCodeScanner = new Html5QrcodeScanner("qr-reader", {
            fps: 10,
            qrbox: 250,
        });

        const onScanSuccess = (decodedText) => {
            setWalletAddress(decodedText);
            setWalletUserAddress(decodedText);
            setScanner(false);
        };

        const onScanError = (errorMessage) => {
            console.error("QR Scan Error:", errorMessage);
            setError(errorMessage);
        };

        qrCodeScanner.render(onScanSuccess, onScanError);

        return () => {
            qrCodeScanner.clear();
        };
    }, [setScanner, setWalletUserAddress]);

    return (
        <div className={styles.scannerOverlay} onClick={() => setScanner(false)}>
            <div className={styles.scannerContainer} onClick={(e) => e.stopPropagation()}>
                <div className={styles.closeButton} onClick={() => setScanner(false)}>
                    <i className="fa fa-times"></i>
                </div>
                <h2 className={styles.scannerTitle}>Scan the QR Code</h2>
                <div id="qr-reader" className={styles.qrReader}></div>
                
                {walletAddress && (
                    <div className={styles.result}>
                        <p>Wallet Address: <strong>{walletAddress}</strong></p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QRScanner;