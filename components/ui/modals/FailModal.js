"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './Modal.module.scss';

const FailModal = ({ title, subTitle, category, setIsModal, resData }) => {
    const { push } = useRouter();

    const handleAddFundsClick = () => {
        if (window.LC_API && typeof window.LC_API.open_chat_window === 'function') {
            window.LC_API.open_chat_window();
        } else {
            console.error("Live Chat widget not initialized or method not found.");
        }
    };

    const redirectFunc = (link) => {
        return push(link);
    }

    const closeAndRefresh = () => {
        setIsModal(false);
        setTimeout(() => {
            window.location.reload();
        }, 300); // 给模态框关闭动画留出时间
        return;
    }

    return (
        <div className={styles.modalContainer} onClick={() => setIsModal(false)}>
            <div className={styles.modalInnerContainer} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalImageWrapper}>
                    <i className={`fa fa-times-circle ${styles.failIcon} ${styles.failAnimation}`}></i>
                </div>
                <div className={styles.modalInfoWrapper}>
                    <h3 className={styles.modalTitle}>{title}</h3>
                    {resData ? (
                        <p className={styles.modalSubtitle}>{resData?.message}</p>
                    ) : (
                        <p className={styles.modalSubtitle}>{subTitle}</p>
                    )}

                    <div className={styles.modalActions}>
                        {category === "login" && (
                            <button className={styles.positiveButton} onClick={() => setIsModal(false)}>TRY AGAIN</button>
                        )}
                        {category === "register" && (
                            <button className={styles.positiveButton} onClick={() => setIsModal(false)}>TRY AGAIN</button>
                        )}
                        {category === "block" && (
                            <>
                                <button className={styles.negativeButton} onClick={() => setIsModal(false)}>TRY AGAIN</button>
                                <button className={styles.positiveButton} onClick={() => handleAddFundsClick()}>LIVE CHAT</button>
                            </>
                        )}
                        {category === "nobalance" && (
                            <>
                                <button className={styles.negativeButton} onClick={() => setIsModal(false)}>TRY AGAIN</button>
                                <button className={styles.positiveButton} onClick={() => handleAddFundsClick()}>LIVE CHAT</button>
                            </>
                        )}
                        {category === "pendingOrder" && (
                            <>
                                <button className={styles.negativeButton} onClick={() => setIsModal(false)}>CLOSE</button>
                                <button className={styles.positiveButton} onClick={() => redirectFunc("/journey/history")}>Show Pending</button>
                            </>
                        )}
                        {category === "journeyCompleted" && (
                            <button className={styles.positiveButton} onClick={() => setIsModal(false)}>CLOSE</button>
                        )}
                        {category === "isDisabledRob" && (
                            <>
                                <button className={styles.negativeButton} onClick={() => setIsModal(false)}>CLOSE</button>
                                <button className={styles.positiveButton} onClick={() => handleAddFundsClick()}>LIVE CHAT</button>
                            </>
                        )}
                        {category === "withdrawal" && (
                            <button className={styles.positiveButton} onClick={() => setIsModal(false)}>TRY AGAIN</button>
                        )}
                        {category === "passwordFail" && (
                            <button className={styles.positiveButton} onClick={() => setIsModal(false)}>TRY AGAIN</button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FailModal;