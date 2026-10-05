import React from 'react';
import moment from 'moment-timezone';
import styles from './WithdrawalHistoryCard.module.scss';

const WithdrawalHistoryCard = ({ data }) => {
    return (
        <div className={styles.withdrawalHistoryCardContainer}>
            <div className={styles.cardTitle}>
                Transfer to wallet
            </div>

            <div className={styles.statusBadge}>
                {data?.status}
            </div>
            <div className={styles.transactionDate}>
                {moment.tz(data?.createdAt, process.env.NEXT_PUBLIC_TIME_ZONE).format("DD MMM YYYY, hh:mm:ss")}
            </div>

            <div className={styles.userInfo}>
                {data?.username}, {data?.phone_number}
            </div>

            <div className={styles.walletAddress}>
                {data?.wallet_address}
            </div>

            <div className={styles.amountLabel}>
                Withdrawal Amount
            </div>
            <div className={styles.amountValue}>
                <span>USD </span>
                {data?.withdrawal_amount.toFixed(2)}
            </div>
        </div>
    );
};

export default WithdrawalHistoryCard;