// components/withdrawal/WithdrawalCard.js
import styles from './WithdrawalCard.module.scss';
import { formatPrice } from '@/utils/validateForm';

export default function WithdrawalCard({ authenticatedUser, hasWithdrawalInfo = false }) {
    return (
        <div className={styles.withdrawalSection}>
            <div className={styles.withdrawalCard}>
                <div className={styles.balanceLabel}>
                    Current Balance
                </div>
                <div className={styles.balanceAmount}>
                    <span className={styles.currencySymbol}>USD </span>
                    {formatPrice(authenticatedUser.balance)}
                </div>
            </div>
            {hasWithdrawalInfo && (
                <div className={styles.withdrawalInfo}>
                    <div className={styles.withdrawalInfoRow}>
                        <div className={styles.withdrawalTitle}>
                            Withdraw TO
                        </div>
                        <div className={styles.networkType}>
                            {authenticatedUser.currency},
                            {authenticatedUser.network_type}
                        </div>
                    </div>
                    <div className={styles.userInfo}>
                        {authenticatedUser.username}, {authenticatedUser.wallet_phone}
                    </div>
                    <div className={styles.walletAddress}>
                        {authenticatedUser.wallet_address}
                    </div>
                </div>
            )}
        </div>
    )
}