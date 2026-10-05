"use client"

import Image from 'next/image';
import supportImage from "@/public/images/support.png"
import LiveChatSupport from './LiveChatSupport';
import WhatsAppSupport from './WhatsAppSupport';
import TelegramSupport from './TelegramSupport';
import NavigationBar from '@/components/layout/NavigationBar'
import styles from './Support.module.scss';

const Support = ({ support }) => {
    return (
        <>
            <NavigationBar title="Support Center" />
            <section className={styles.supportSection}>
                <div className={styles.illustration}>
                    <Image
                        src={supportImage}
                        height={100}
                        width={100}
                        alt="Customer support illustration"
                        unoptimized
                    />
                </div>
                <div className={styles.supportInfo}>
                    <h2 className={styles.title}>Need help ?</h2>
                    <p className={styles.subtitle}>For any account-related inquiries orassistance, please reach out to ourlive chat for assistance.</p>
                    <p className={styles.operationHours}>
                        Support Team Operation Time:<br />
                        <span className={styles.hours}>
                            {support.work_time}
                        </span>
                    </p>
                    <div className={styles.contactButtons}>
                        <LiveChatSupport children="Contact us via LiveChat" />
                        {/* <WhatsAppSupport children="Contact us via WhatsApp" phoneNumber={support.mobile_number} /> */}
                        {/* <TelegramSupport children="Contact us via Telegram" contact={support.telegram} /> */}
                    </div>
                </div>
            </section>
        </>
    )
}

export default Support;