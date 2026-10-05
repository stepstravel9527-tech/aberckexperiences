"use client";

import styles from './Sidebar.module.scss';
import Image from 'next/image';
import React, { useState } from 'react';
import Link from 'next/link';
import logo from "@/public/logo/white_logo.png";
import profile from "@/public/logo/default_profile.svg";
import Modal from '@/components/ui/modals/Modal';
import Popup from '@/components/ui/Popup';
import VipLevelsList from './VipLevelsList';
import { sidebarLeftConfig, sidebarLeftDividerIndices } from './SidebarLeft.config';
import { sidebarRightConfig, sidebarRightDividerIndices } from './SidebarRight.config';
import { useRouter } from 'next/navigation';
import { logout } from '@/app/actions/user/action';

const Sidebar = ({
    isOpen,
    onClose,
    isLeft = true, // boolean: true=左侧, false=右侧
    authenticatedUser,
    allCommission,
    pop
}) => {
    const { push } = useRouter();

    const [isLogoutModal, showLogoutModal] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const handleAction = (action) => {
        switch (action) {
            case 'popup':
                setIsPopupOpen(true);
                break;
            case 'logout':
                showLogoutModal(true);
                break;
            default:
                onClose();
                break;
        }
    };

    // 根据 isLeft 选择配置和样式
    const config = isLeft ? sidebarLeftConfig : sidebarRightConfig;
    const dividerIndices = isLeft ? sidebarLeftDividerIndices : sidebarRightDividerIndices;
    const positionClass = isLeft ? styles.sidebarLeft : styles.sidebarRight;

    const renderMenuItem = (item, index) => {
        if (item.type === 'link') {
            return (
                <Link
                    key={index}
                    href={item.href}
                    className={styles.sidebarMenuItem}
                    onClick={onClose}
                >
                    <div
                        className={styles.menuItemIcon}
                        dangerouslySetInnerHTML={{ __html: item.icon }}
                    />
                    <span className={styles.menuItemLabel}>{item.label}</span>
                </Link>
            );
        } else if (item.type === 'action') {
            return (
                <div
                    key={index}
                    className={styles.sidebarMenuItem}
                    onClick={() => handleAction(item.action)}
                >
                    <div
                        className={`${styles.menuItemIcon} ${item.action === 'logout' ? styles.iconLarge : undefined}`}
                        dangerouslySetInnerHTML={{ __html: item.icon }}
                    />
                    <span className={`${styles.menuItemLabel} ${item.action === 'logout' ? styles.labelAlert : undefined}`}>
                        {item.label}
                    </span>
                </div>
            );
        }
        return null;
    };

    if (!isOpen) return null;

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
            {/* 模态框 */}
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

            {isPopupOpen && (
                <Popup
                    pop={pop}
                    setIsShow={setIsPopupOpen}
                />
            )}

            {/* 侧边栏主体 */}
            <div className={styles.sidebarOverlay} onClick={onClose}>
                <div
                    className={`${styles.sidebarContent} ${positionClass} ${isOpen ? styles.sidebarOpen : undefined}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Logo 区域 */}
                    <div className={styles.sidebarLogo}>
                        <Image
                            src={logo}
                            alt="Website Logo"
                            width={100}
                            height={100}
                            unoptimized
                        />
                    </div>

                    {/* 用户信息部分 - 只在右侧显示 */}
                    {/* {!isLeft && authenticatedUser && (
                        <div className={styles.sidebarUserProfile}>
                            <Image
                                src={authenticatedUser.url || profile}
                                alt="User Profile"
                                width={45}
                                height={45}
                                className={styles.userAvatar}
                            />
                            <div className={styles.userInfo}>
                                <p className={styles.userSignedInText}>Signed in as</p>
                                <h2 className={styles.userName}>{authenticatedUser.username}</h2>
                            </div>
                        </div>
                    )} */}

                    {/* VIP 等级列表 - 只在右侧显示 */}
                    {/* {!isLeft && authenticatedUser && (
                        <VipLevelsList
                            allCommission={allCommission}
                            userCommission={authenticatedUser.membership_level}
                        />
                    )} */}

                    {/* 菜单列表 */}
                    <div className={styles.sidebarMenuList}>
                        {config.map((item, index) => (
                            <div key={index}>
                                {renderMenuItem(item, index)}
                                {dividerIndices.includes(index) && (
                                    <div className={styles.sidebarDivider} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;