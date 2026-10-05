"use client"

import styles from './NavigationBar.module.scss'
import { useRouter } from "next/navigation";
import Image from "next/image";

/**
 * 通用导航栏组件
 * @param {string} title - 中间标题文本
 * @param {string} leftIcon - 左侧自定义图标
 * @param {string} centerIcon - 中间自定义图标
 * @param {string} rightIcon - 右侧自定义图标
 * @param {function} onLeftClick - 左侧点击事件
 * @param {function} onCenterClick - 中间点击事件
 * @param {function} onRightClick - 右侧点击事件
 * @param {boolean} showBackButton - 是否显示默认返回按钮
 * @param {string} backgroundColor - 导航栏背景颜色，默认为白色
 * @param {boolean} isDashboard - Dashboard特殊处理
 * @param {boolean} whiteTheme - 是否显示为白色主题，默认false
 */
export default function NavigationBar({
    title,
    leftIcon,
    centerIcon,
    rightIcon,
    onLeftClick,
    onCenterClick,
    onRightClick,
    showBackButton = true,
    backgroundColor = "#FFFFFF",
    isDashboard = false,
    whiteTheme = false // 新增：白色主题控制
}) {
    const { back } = useRouter();

    /**
     * 处理左侧点击事件
     */
    const handleLeftClick = () => {
        if (onLeftClick) {
            onLeftClick();
        } else if (showBackButton) {
            //处理返回操作
            back();
        }
    }

    /**
     * 处理中间点击事件
     */
    const handleCenterClick = () => {
        if (onCenterClick) {
            onCenterClick();
        }
    }

    /**
     * 处理右侧点击事件
     */
    const handleRightClick = () => {
        if (onRightClick) {
            onRightClick();
        }
    }

    const BackIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M5 12H19M5 12L9 16M5 12L9 8" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );

    /**
     * 渲染左侧内容
     * @returns {ReactNode} 左侧内容组件
     */
    const renderLeftSection = () => {
        return (
            <div onClick={handleLeftClick} className={`${styles.leftContent} ${onLeftClick || showBackButton ? styles.isClickable : undefined}`}>
                {leftIcon ? (
                    <Image
                        src={leftIcon}
                        alt="leftIcon"
                        height={100}
                        width={100}
                        unoptimized
                        className={styles.icon}
                    />
                ) : (
                    showBackButton && (
                        <BackIcon />
                    )
                )}
            </div>
        );
    }

    /**
     * 渲染中间内容
     * @returns {ReactNode} 中间内容组件
     */
    const renderCenterSection = () => {
        return (
            <div onClick={handleCenterClick} className={`${styles.centerContent} ${onCenterClick ? styles.isClickable : undefined}`}>
                {centerIcon && (
                    <Image
                        src={centerIcon}
                        alt="centerIcon"
                        height={100}
                        width={100}
                        unoptimized
                        className={styles.icon}
                    />
                )}
                {title && (
                    <h1 className={styles.pageTitle}>
                        {title}
                    </h1>
                )}
            </div>
        );
    }

    /**
     * 渲染右侧内容
     * @returns {ReactNode} 右侧内容组件
     */
    const renderRightSection = () => {
        return (
            <div onClick={handleRightClick} className={`${styles.rightContent} ${onRightClick ? styles.isClickable : undefined}`}>
                {rightIcon && (
                    <Image
                        src={rightIcon}
                        alt="rightIcon"
                        height={100}
                        width={100}
                        unoptimized
                        className={styles.icon}
                    />
                )}
            </div>
        );
        // 无内容时显示占位符保持布局
        //return <div className={styles.layoutPlaceholder} />;
    }

    return (
        <nav className={styles.navigationBar} style={{ backgroundColor }}>
            <div className={`${styles.navigationContainer} ${isDashboard ? styles.dashboard : undefined} ${whiteTheme ? styles.whiteTheme : undefined}`}>
                {/* 左侧区域：返回按钮或自定义图标 */}
                <div className={styles.leftSection}>
                    {renderLeftSection()}
                </div>

                {/* 中间区域：标题或自定义内容 */}
                <div className={styles.centerSection}>
                    {renderCenterSection()}
                </div>

                {/* 右侧区域：功能图标 */}
                <div className={styles.rightSection}>
                    {renderRightSection()}
                </div>
            </div>
        </nav>
    )
}