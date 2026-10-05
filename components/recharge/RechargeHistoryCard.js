import React from 'react';
import moment from 'moment-timezone';
// import styles from './RechargeHistoryCard.module.scss';
import styles from '@/components/withdrawal/WithdrawalHistoryCard.module.scss';


const RechargeHistoryCard = ({ data }) => {
    return (
        <div className={styles.rechargeHistoryCardContainer}>
            <div className={styles.cardTitle}>
                Transfer to wallet
            </div>
            <div className={styles.userInfo}>
                Dear {data?.username ?? ""} , ${`${data?.amount} has been credited to your account.`}
            </div>
            <div className={styles.transactionDate}>
                {moment.tz(data?.createdAt, process.env.NEXT_PUBLIC_TIME_ZONE).format("DD MMM YYYY, hh:mm:ss")}
            </div>
            <div className={styles.statusBadge}>
                {data?.recharge_type}
            </div>
            <div className={styles.amountValue}>
                <span>USD </span>
                {data?.amount}
            </div>
        </div>
    );
};

export default RechargeHistoryCard;