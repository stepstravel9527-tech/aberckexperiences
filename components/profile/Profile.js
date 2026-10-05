"use client";

import styles from './Profile.module.scss';
import NavigationBar from '@/components/layout/NavigationBar'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { uploadProfile } from '@/app/actions/profile/action';
import LogoLoader from '../ui/LogoLoader';
import Link from 'next/link';
import Modal from '@/components/ui/modals/Modal';
import ToastManager from '@/utils/toastManager';
// import WithdrawalCard from "@/components/withdrawal/WithdrawalCard";
import AvatarUpload from './AvatarUpload';
import { logout } from '@/app/actions/user/action';

const Profile = ({ authenticatedUser }) => {
    const { push, refresh } = useRouter();
    const [isLogoutModal, showLogoutModal] = useState(false);
    const [pending, setPending] = useState(false);

    const copyToClipboard = (val) => {
        navigator.clipboard.writeText(val);
        return ToastManager.success(`Copied - (${val})`);
    };

    const handleForm = async (selectedFile) => {
        if (!selectedFile) {
            return ToastManager.error("Please choose an image!");
        }

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('upload_preset', process.env.NEXT_PUBLIC_IMAGE_UPLOAD_PRESET);

        try {
            setPending(true);
            const cloud_res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/image/upload`, {
                method: "POST",
                body: formData
            });

            const cloud_data = await cloud_res.json();

            if (cloud_res.ok) {
                try {
                    const dbFormData = new FormData();
                    dbFormData.append("public_id", cloud_data.public_id);
                    dbFormData.append("url", cloud_data.secure_url);

                    const response = await uploadProfile(dbFormData);

                    if (response.status === 201) {
                        refresh();
                        setPending(false);
                        return ToastManager.success(response.message);
                    } else {
                        setPending(false);
                        throw new Error("Failed to upload profile image!");
                    }
                } catch (error) {
                    setPending(false);
                    console.error(error);
                }
            } else {
                setPending(false);
                throw new Error("Failed to upload profile image!");
            }
        } catch (error) {
            setPending(false);
            console.error(error);
        }
    };

    const handleBackClick = () => {
        push("/");
    };

    const CopyIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path opacity="0.993" fillRule="evenodd" clipRule="evenodd" d="M1.1875 0.00568768C4.10553 -0.00963107 7.02222 0.00599393 9.9375 0.0525627C10.493 0.243425 10.8419 0.623635 10.9844 1.19319C11 1.79727 11.0052 2.40144 11 3.00569C11.6043 3.00047 12.2084 3.00569 12.8125 3.02131C13.3821 3.16378 13.7623 3.51272 13.9531 4.06819C14.0049 6.9835 14.0153 9.90016 13.9844 12.8182C13.8229 13.438 13.4323 13.8286 12.8125 13.9901C9.9375 14.0109 7.0625 14.0109 4.1875 13.9901C3.56772 13.8286 3.17709 13.438 3.01563 12.8182C3 12.2141 2.99478 11.6099 3 11.0057C2.39575 11.0109 1.79158 11.0057 1.1875 10.9901C0.56771 10.8286 0.177085 10.438 0.0156258 9.81819C-0.00520859 6.94319 -0.00520859 4.06819 0.0156258 1.19319C0.182776 0.572931 0.573401 0.1771 1.1875 0.00568768ZM1.5 1.00569C4.21988 0.990472 6.93863 1.0061 9.65625 1.05256C9.86103 1.13384 9.97041 1.28488 9.98438 1.50569C10 2.00558 10.0052 2.50559 10 3.00569C8.06247 3.00047 6.12497 3.00569 4.1875 3.02131C3.56772 3.18278 3.17709 3.57341 3.01563 4.19319C3 6.13066 2.99478 8.06816 3 10.0057C2.44644 10.0191 1.89435 10.0035 1.34375 9.95881C1.13897 9.87753 1.02959 9.7265 1.01563 9.50569C0.994791 6.83903 0.994791 4.17234 1.01563 1.50569C1.05769 1.21889 1.21914 1.05222 1.5 1.00569ZM4.5 4.00569C7.16669 4.00047 9.83334 4.00569 12.5 4.02131C12.7865 4.05778 12.9479 4.21922 12.9844 4.50569C13.0052 7.17234 13.0052 9.83903 12.9844 12.5057C12.9479 12.7922 12.7865 12.9536 12.5 12.9901C9.83334 13.0109 7.16666 13.0109 4.5 12.9901C4.21353 12.9536 4.05209 12.7922 4.01563 12.5057C3.99478 9.83903 3.99478 7.17234 4.01563 4.50569C4.05769 4.21888 4.21916 4.05222 4.5 4.00569Z" fill="#333333" />
        </svg>
    );
    const LockIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="20" viewBox="0 0 18 20" fill="none">
            <path d="M12.75 6C15.3734 6 17.5 8.12665 17.5 10.75V14.75C17.5 17.3734 15.3734 19.5 12.75 19.5H4.75C2.12665 19.5 0 17.3734 0 14.75V10.75C0 8.12665 2.12665 6 4.75 6H12.75ZM8.75 11C8.33579 11 8 11.3358 8 11.75V13.75C8 14.1642 8.33579 14.5 8.75 14.5C9.16421 14.5 9.5 14.1642 9.5 13.75V11.75C9.5 11.3358 9.16421 11 8.75 11Z" fill="white" />
            <path d="M12.75 6.75V4.75C12.75 2.54086 10.9591 0.75 8.75 0.75C6.54086 0.75 4.75 2.54086 4.75 4.75L4.75 6.75" stroke="white" strokeWidth="1.5" />
        </svg>
    );
    const AboutIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M10.75 0C16.6871 0 21.5 4.81294 21.5 10.75C21.5 16.6871 16.6871 21.5 10.75 21.5C4.81294 21.5 0 16.6871 0 10.75C0 4.81294 4.81294 0 10.75 0ZM9.25 9C8.83579 9 8.5 9.33579 8.5 9.75C8.5 10.1642 8.83579 10.5 9.25 10.5H10.5V15.75C10.5 16.1642 10.8358 16.5 11.25 16.5C11.6642 16.5 12 16.1642 12 15.75V9.75C12 9.36183 11.7051 9.04253 11.3271 9.00391C11.3018 9.00131 11.276 9 11.25 9H9.25ZM11.25 5C10.8358 5 10.5 5.33579 10.5 5.75V6.75C10.5 7.16421 10.8358 7.5 11.25 7.5C11.6642 7.5 12 7.16421 12 6.75V5.75C12 5.33579 11.6642 5 11.25 5Z" fill="white" />
        </svg>
    );
    const TcIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <g clipPath="url(#clip0_1_1357)">
                <path d="M19 21.9999H5C4.20435 21.9999 3.44129 21.6839 2.87868 21.1213C2.31607 20.5587 2 19.7956 2 18.9999V2.99994C2 2.73472 2.10536 2.48037 2.29289 2.29283C2.48043 2.1053 2.73478 1.99994 3 1.99994H17C17.2652 1.99994 17.5196 2.1053 17.7071 2.29283C17.8946 2.48037 18 2.73472 18 2.99994V9.99994H22V18.9999C22 19.7956 21.6839 20.5587 21.1213 21.1213C20.5587 21.6839 19.7956 21.9999 19 21.9999ZM18 11.9999V18.9999C18 19.2652 18.1054 19.5195 18.2929 19.707C18.4804 19.8946 18.7348 19.9999 19 19.9999C19.2652 19.9999 19.5196 19.8946 19.7071 19.707C19.8946 19.5195 20 19.2652 20 18.9999V11.9999H18ZM5 5.99994V11.9999H11V5.99994H5ZM5 12.9999V14.9999H15V12.9999H5ZM5 15.9999V17.9999H15V15.9999H5ZM7 7.99994H9V9.99994H7V7.99994Z" fill="white" />
            </g>
            <defs>
                <clipPath id="clip0_1_1357">
                    <rect width="24" height="24" fill="white" />
                </clipPath>
            </defs>
        </svg>
    );
    const FaqsIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 21.9999C6.477 21.9999 2 17.5229 2 11.9999C2 6.47691 6.477 1.99991 12 1.99991C17.523 1.99991 22 6.47691 22 11.9999C22 17.5229 17.523 21.9999 12 21.9999ZM11 14.9999V16.9999H13V14.9999H11ZM13 13.3549C13.8037 13.1127 14.4936 12.5899 14.9442 11.8817C15.3947 11.1734 15.5759 10.327 15.4547 9.49638C15.3336 8.66579 14.9181 7.90635 14.284 7.35637C13.6499 6.80638 12.8394 6.50245 12 6.49991C11.1909 6.49985 10.4067 6.78006 9.78079 7.2929C9.15492 7.80574 8.72601 8.51954 8.567 9.31291L10.529 9.70591C10.5847 9.42734 10.7183 9.17031 10.9144 8.96472C11.1104 8.75914 11.3608 8.61345 11.6364 8.54461C11.912 8.47578 12.2015 8.48662 12.4712 8.57588C12.7409 8.66514 12.9797 8.82915 13.1598 9.04882C13.34 9.26849 13.454 9.5348 13.4887 9.81675C13.5234 10.0987 13.4773 10.3847 13.3558 10.6415C13.2343 10.8983 13.0423 11.1153 12.8023 11.2672C12.5623 11.4192 12.2841 11.4999 12 11.4999C11.7348 11.4999 11.4804 11.6053 11.2929 11.7928C11.1054 11.9803 11 12.2347 11 12.4999V13.9999H13V13.3549Z" fill="white" />
        </svg>
    );

    const handleLogout = async () => {
        try {
            await logout();
            push("/welcome");
        } catch (error) {
            console.error('Logout failed:', error);
            push("/welcome");
        }
    };

    return (
        <>
            {isLogoutModal && (
                <Modal
                    type="logout"
                    title="Leaving Soon?"
                    message="Are you sure you want to logout?"
                    onPositiveClick={handleLogout}
                    onNegativeClick={() => showLogoutModal(false)}
                    positiveButtonText="LOGOUT"
                    negativeButtonText="CLOSE"
                />
            )}
            {pending && <LogoLoader />}

            <section className={`${styles.profileSection} pageAnimation`}>
                <NavigationBar backgroundColor="transparent" title="Profile" onLeftClick={handleBackClick} whiteTheme={true} />
                <main className={styles.profileContent}>
                    <div className={styles.profileCard}>
                        <div className={styles.profileCardLeft}>
                            <AvatarUpload
                                userAvatar={authenticatedUser.url}
                                uploadHandler={handleForm}
                            />
                            <div className={styles.invitationCode}>
                                <div className={styles.codeText}>{authenticatedUser.invitation_code}</div>
                                <div className={styles.copyIcon} onClick={() => copyToClipboard(authenticatedUser.invitation_code ?? "")}>
                                    <CopyIcon />
                                </div>
                            </div>
                        </div>
                        <div className={styles.profileCardRight}>
                            {/* <p className={styles.userLevel}>{authenticatedUser.membership_level}</p> */}
                            <p className={styles.userLevel}>Pro Traveler</p>
                            <p className={styles.userName}><span>Username: </span>{authenticatedUser.username}</p>
                            <div className={styles.progressBar}>
                                <div className={styles.progressContainer}>
                                    <div className={styles.progressTrack}>
                                        <div
                                            className={styles.progressThumb}
                                            style={{ width: `${authenticatedUser.credibility}%` }}
                                        >
                                            <div className={styles.progressPresent} >
                                                <span className={styles.progressArrow} />
                                                {authenticatedUser.credibility}%
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <WithdrawalCard authenticatedUser={authenticatedUser} hasWithdrawalInfo={false} /> */}
                    <div className={styles.profileLinks}>
                        <div className={styles.sectionTitle}>Security</div>
                        <Link href="/security/change-password" className={styles.menuItem}>
                            <LockIcon />
                            <div className={styles.linkRow}>
                                <span>Security Center</span>
                            </div>
                        </Link>
                        <div className={styles.sectionTitle}>Security</div>
                        <Link href="/content/about" className={styles.menuItem}>
                            <AboutIcon />
                            <div className={styles.linkRow}>
                                <span>About Us</span>
                            </div>
                        </Link>
                        <Link href="/content/tc" className={styles.menuItem}>
                            <TcIcon />
                            <div className={styles.linkRow}>
                                <span>Term and Conditions</span>
                            </div>
                        </Link>
                        <Link href="/content/faqs" className={styles.menuItem}>
                            <FaqsIcon />
                            <div className={styles.linkRow}>
                                <span>FAQs</span>
                            </div>
                        </Link>
                    </div>
                    <div className={styles.buttonWraper}>
                        <button
                            className="primaryButton"
                            onClick={() => showLogoutModal(true)}
                        >
                            Log Out
                        </button>
                    </div>
                </main>
            </section>
        </>
    );
};

export default Profile;