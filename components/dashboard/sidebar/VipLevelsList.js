"use client";

import { useState } from 'react';
import VipLevelItem from './VipLevelItem';
import styles from './VipLevelsList.module.scss';

const VipLevelsList = ({ allCommission, userCommission }) => {
    const [isOpen, setIsOpen] = useState(false);

    // 当前用户等级
    const currentLevel = allCommission?.find(item => item.membership_level === userCommission);

    // 其他等级
    const otherLevels = allCommission?.filter(item => item.membership_level !== userCommission);

    const toggleList = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={styles.vipLevelsWrapper}>
            {/* 当前等级 */}
            {currentLevel && (
                <VipLevelItem
                    data={currentLevel}
                    userCommission={userCommission}
                    isCurrentLevel={true}
                    onToggle={toggleList}
                    showToggle={true}
                    isOpen={isOpen}
                />
            )}

            {/* 其他等级 */}
            {isOpen && otherLevels?.map((data) => (
                <div key={data.membership_level}>
                    <VipLevelItem
                        data={data}
                        userCommission={userCommission}
                        isCurrentLevel={false}
                    />
                </div>
            ))}
        </div>
    );
};

export default VipLevelsList;