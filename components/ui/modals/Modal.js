"use client";

import React from 'react';
import styles from './Modal.module.scss';

const Modal = ({
    type = "success",
    title = "Confirm Logout",
    message = "Are you sure you want to logout?",
    onPositiveClick,
    onNegativeClick,
    positiveButtonText = "OK",
    negativeButtonText = "CLOSE",
    hasNegativeButton = true
}) => {
    // 图标配置
    const config = {
        success: { icon: "fa-check-circle", color: styles.successIcon, animation: styles.successAnimation },
        logout: { icon: "fa-sign-out", color: styles.logoutIcon, animation: styles.successAnimation },
        fail: { icon: "fa-times-circle", color: styles.failIcon, animation: styles.failAnimation }
    };

    const iconConfig = config[type] || config.success;

    return (
        <div className={styles.modalContainer}>
            <div className={styles.modalInnerContainer} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalImageWrapper}>
                    <i className={`fa ${iconConfig.icon} ${iconConfig.color} ${iconConfig.animation}`}></i>
                </div>
                <div className={styles.modalInfoWrapper}>
                    <div className={styles.modalTitle}>{title}</div>
                    <div className={styles.modalSubtitle}>{message}</div>
                    <div className={styles.modalActions}>
                        {hasNegativeButton && (
                            <button className={styles.negativeButton} onClick={onNegativeClick}>
                                {negativeButtonText}
                            </button>
                        )}
                        <button className={styles.positiveButton} onClick={onPositiveClick}>
                            {positiveButtonText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;