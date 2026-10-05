// components/auth/AuthPage.js
"use client"

import styles from './AuthPage.module.scss';
import NavigationBar from '@/components/layout/NavigationBar';
import Image from 'next/image';
import logo from "@/public/logo/white_logo.png";
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import PrimaryButton from '@/components/ui/PrimaryButton';
import FormInput from '@/components/ui/FormInput';

/**
 * 认证页面公共组件
 * @param {string} title - 主标题
 * @param {string} subTitle - 副标题
 * @param {Array} tabs - 标签配置数组，每个对象有 href 和 label 属性
 * @param {string} tabs[].href - 标签跳转链接
 * @param {string} tabs[].label - 标签显示文本
 */
export default function AuthPage({
    title,
    subTitle,
    handleBackClick,
    tabs,
    handleForm,
    metaData,
    values,
    handleChange,
    defaultText,
    hasOptions = false,
    disabled = false,
    setScanner
}) {
    const pathname = usePathname();

    // 检查 tabs 是否为空
    const hasTabs = tabs && tabs.length > 0;

    return (
        <section className={styles.authSection}>
            <NavigationBar backgroundColor="transparent" onLeftClick={handleBackClick} whiteTheme={true} />
            <header className={styles.authHeader}>
                <div className={styles.logoContainer}>
                    <Image
                        src={logo}
                        alt="logo"
                        height={100}
                        width={100}
                        unoptimized
                    />
                </div>
                <div className={styles.title}>{title}</div>
                <div className={styles.subTitle}>{subTitle}</div>
            </header>
            <main className={styles.contentContainer}>
                {/* 标签切换 - 只在有 tabs 时显示 */}
                {hasTabs && (
                    <div className={styles.tabContainer}>
                        {tabs.map((tab) => (
                            <Link
                                key={tab.href}
                                href={tab.href}
                                className={`${styles.tabItem} ${pathname === tab.href ? styles.tabActive : undefined}`}
                            >
                                {tab.label}
                            </Link>
                        ))}
                    </div>
                )}
                <form action={handleForm} noValidate>
                    <div className={styles.formContainer}>
                        {metaData && metaData.map((input) => (
                            <FormInput
                                key={input.id}
                                {...input}
                                value={values[input.name]}
                                handleChange={handleChange}
                                disabled={disabled}
                                setScanner={setScanner}
                            />
                        ))}
                        {hasOptions && (
                            <div className={styles.formOptions}>
                                <div className={styles.checkboxContainer}>
                                    <input type="checkbox" id="remember" name="remember" defaultChecked={true} />
                                    <span className={styles.checkmark}></span>
                                    <label htmlFor="remember" className={styles.checkboxLabel}>Remember Password</label>
                                </div>
                                <Link href="/forgot-password">Forgot Password ?</Link>
                            </div>
                        )}
                        <PrimaryButton defaultText={defaultText} disabled={disabled} />
                    </div>
                </form>
            </main>
        </section>
    )
}