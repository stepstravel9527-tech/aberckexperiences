"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authenticate } from '@/app/actions/user/action';
import Link from 'next/link';
import ToastManager from '@/utils/toastManager';
import styles from './Modal.module.scss';

const SuccessModal = ({ title, subTitle, category, setIsModal, formValue }) => {

    const { push } = useRouter();
    const [loading, setLoading] = useState(false);

    const navigateToLogin = () => {
        return push("/signin");
    }

    const saveLoginData = (data) => {
        const { username, password } = Object.fromEntries(data);
        const loginData = {
            username: username,
            password: password
        };
        localStorage.setItem("xjdeiuqx_history", JSON.stringify(loginData));
    };

    const handleForm = async () => {
        setLoading(true);
        const formData = new FormData();
        formData.append("username", formValue?.username);
        formData.append("password", formValue?.password);

        try {
            const response = await authenticate(formData);

            if (response === undefined) {
                ToastManager.success("Successfully logged In");
                push("/");
                saveLoginData(formData);
                setLoading(false);
                return;
            } else {
                if (response.message === "User has been banned") {
                    setIsBand(true);
                } else {
                    setIsMessage(true);
                }
                setLoading(false);
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleAddFundsClick = () => {
        if (window.LC_API && typeof window.LC_API.open_chat_window === 'function') {
            window.LC_API.open_chat_window();
        } else {
            console.error("Live Chat widget not initialized or method not found.");
        }
    };

    return (
        <div className={styles.modalContainer} onClick={() => setIsModal(false)}>
            <div className={styles.modalInnerContainer} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalImageWrapper}>
                    <i className={`fa fa-check-circle ${styles.successIcon} ${styles.successAnimation}`}></i>
                </div>
                <div className={styles.modalInfoWrapper}>
                    <h3 className={styles.modalTitle}>{title}</h3>
                    <p className={styles.modalSubtitle}>{subTitle}</p>

                    <div className={styles.modalActions}>
                        {category === "recharge" && (
                            <>
                                <button className={styles.negativeButton} onClick={() => setIsModal(false)}>CLOSE</button>
                                <button className={styles.positiveButton} onClick={() => handleAddFundsClick()}>LIVE CHAT</button>
                            </>
                        )}
                        {category === "registration" && (
                            <>
                                <button className={styles.negativeButton} onClick={() => navigateToLogin()}>OPEN LOGIN</button>
                                <button className={styles.positiveButton} onClick={() => handleForm()}>
                                    {loading ? <i className={`fa fa-circle-notch rotating-spinner`}></i> : "START TODAY"}
                                </button>
                            </>
                        )}
                        {category === "journeySuccess" && (
                            <Link href="/journey" className={styles.positiveButton}>
                                DONE
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SuccessModal;