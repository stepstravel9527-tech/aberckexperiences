"use client";

import NavigationBar from '@/components/layout/NavigationBar'
import Image from "next/image";
import invite from "@/public/images/invite.png"
import ToastManager from '@/utils/toastManager';
import styles from './Invite.module.scss';

const Invite = ({ invitationCode }) => {

    const copyToClipboard = (val) => {
        navigator.clipboard.writeText(val);
        return ToastManager.success(`Copied - (${val})`);
    }

    return (
        <section className={styles.inviteSection}>
            <NavigationBar title="Invitation" />
            <div className={styles.inviteContent}>
                <div className={styles.inviteImage}>
                    <Image
                        src={invite}
                        height={100}
                        width={100}
                        alt="Invite friends illustration"
                        unoptimized
                    />
                </div>
                <div className={styles.inviteDetails}>
                    <h2 className={styles.inviteTitle}>Invite a friends</h2>
                    <p className={styles.inviteSubtitle}>Copy your code, share it with your friends</p>
                    <div className={styles.inviteCodeWrapper}>
                        <div className={styles.inviteCode}>
                            <span className={styles.codeText}>{invitationCode ?? ""}</span>
                            <div
                                className={styles.copyButton}
                                onClick={() => copyToClipboard(invitationCode ?? "")}
                            >
                                Copy
                            </div>
                        </div>
                    </div>
                </div>
                {/* <div className={styles.inviteAction}>
                    <button
                        className="primaryButton"
                        onClick={() => copyToClipboard(invitationCode ?? "")}
                    >
                        Send Invitation
                    </button>
                </div> */}
            </div>
        </section>
    )
}

export default Invite;