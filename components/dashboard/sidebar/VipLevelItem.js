import Image from 'next/image';
import vip1 from "@/public/images/membership/1.png";
import vip2 from "@/public/images/membership/2.png";
import vip3 from "@/public/images/membership/3.png";
import vip4 from "@/public/images/membership/4.png";
import styles from './VipLevelItem.module.scss';

const VipLevelItem = ({ data, userCommission, isCurrentLevel, onToggle, showToggle = false, isOpen = false }) => {
    const getVipImage = (level) => {
        const vipImages = {
            'Level 1': vip1,
            'Level 2': vip2,
            'Level 3': vip3,
            'Level 4': vip4,
        };
        return vipImages[level] || vip4;
    };

    const isUnlocked = userCommission === data?.membership_level;

    return (
        <div className={`${styles.levelSection} ${isCurrentLevel ? styles.currentLevel : undefined}`} onClick={onToggle}>
            <Image
                src={getVipImage(data?.membership_level)}
                alt={data?.membership_name}
                height={100}
                width={100}
                unoptimized
                className={styles.vipImage}
            />
            <div className={styles.levelDesc}>
                <p className={styles.levelName}>{data?.membership_name}</p>
                <p className={isUnlocked ? styles.unlockStatus : styles.lockStatus}>
                    {isUnlocked ? "unlock" : "lock"}
                    &nbsp;&#183;&nbsp;
                    {(data?.commission_rate * 100)?.toFixed(2)}%
                </p>
            </div>
            {/* 只在当前等级显示切换箭头 */}
            {showToggle && (
                <div className={styles.toggleArrow} onClick={onToggle}>
                    <i className={`fa-solid fa-angle-${isOpen ? 'up' : 'down'}`}></i>
                </div>
            )}
        </div>
    );
};

export default VipLevelItem;