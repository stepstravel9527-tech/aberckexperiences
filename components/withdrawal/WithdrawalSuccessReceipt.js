"use client";

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import watermark from "@/public/logo/white_logo.png";
import moment from 'moment-timezone';
import { useRouter } from 'next/navigation';
import styles from './WithdrawalSuccessReceipt.module.scss';

const WithdrawalSuccessReceipt = ({ setIsModal, amount, authenticatedUser }) => {
    const { push } = useRouter();
    const [transactionDate, setTransactionDate] = useState("");
    const [refCode, setRefCode] = useState("");
    const [serviceCode, setServiceCode] = useState("");

    const redirectToPage = (link) => {
        push(link);
    };

    const handleLiveChatClick = () => {
        if (window.LC_API && typeof window.LC_API.open_chat_window === 'function') {
            window.LC_API.open_chat_window();
        } else {
            console.error("Live Chat widget not initialized or method not found.");
        }
    };

    const closeModalAndRefresh = () => {
        setIsModal(false);
        window.location.reload();
    };

    useEffect(() => {
        const now = new Date().toISOString();
        setTransactionDate(now);
        setRefCode(`REF-${Math.floor(Math.random() * 1000000000)}`);
        setServiceCode(`SC-${Math.floor(Math.random() * 1000000000)}`);
    }, []);

    return (
        <div className={styles.receiptOverlay} onClick={closeModalAndRefresh}>
            <div className={styles.receiptContainer} onClick={(e) => e.stopPropagation()}>
                <div className={styles.watermark}>
                    <Image
                        src={watermark}
                        alt="Company watermark"
                        height={100}
                        width={100}
                        unoptimized
                    />
                </div>

                <div className={styles.successIcon}>
                    <i className={`fa fa-check-circle`}></i>
                </div>

                <div className={styles.header}>
                    <h1>Withdrawal Success</h1>
                    <p>Dear {authenticatedUser?.username ?? "-"}, you have successfully withdrawn ${amount} to wallet {authenticatedUser?.wallet_address ?? "-"}</p>
                </div>

                <div className={styles.divider}></div>

                <div className={styles.details}>
                    <ul className={styles.detailsList}>
                        <li className={styles.detailItem}>
                            <span className={styles.label}>Reference Code</span>
                            <span className={styles.value}>{refCode}</span>
                        </li>
                        <li className={styles.detailItem}>
                            <span className={styles.label}>Username</span>
                            <span className={styles.value}>{authenticatedUser?.username}</span>
                        </li>
                        <li className={styles.detailItem}>
                            <span className={styles.label}>Date Time</span>
                            <span className={styles.value}>
                                {moment.tz(transactionDate, process.env.NEXT_PUBLIC_TIME_ZONE).format('DD MMM YYYY, hh:mm:ss')}
                            </span>
                        </li>
                        <li className={styles.detailItem}>
                            <span className={styles.label}>Service Code</span>
                            <span className={styles.value}>{serviceCode}</span>
                        </li>
                        <li className={styles.detailItem}>
                            <span className={styles.label}>Amount ($)</span>
                            <span className={styles.value}>${amount?.toFixed(2) ?? 0.00}</span>
                        </li>
                        <li className={`${styles.detailItem} ${styles.channel}`}>
                            <span className={styles.label}>Channel</span>
                            <span className={styles.value}>ONLINE</span>
                        </li>
                        <li className={`${styles.detailItem} ${styles.status}`}>
                            <span className={styles.label}>Status</span>
                            <span className={styles.value}>SUCCESS</span>
                        </li>
                    </ul>

                    <div className={styles.divider}></div>

                    <div className={styles.actionButtons}>
                        <button
                            className={styles.negativeButton}
                            onClick={closeModalAndRefresh}
                        >
                            CLOSE
                        </button>
                        <button
                            className={styles.positiveButton}
                            onClick={() => redirectToPage("/withdrawal/history")}
                        >
                            CHECK HISTORY
                        </button>
                    </div>

                    <div className={styles.liveChatPrompt}>
                        <span onClick={handleLiveChatClick}>
                            Confirm With Live Agent
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WithdrawalSuccessReceipt;