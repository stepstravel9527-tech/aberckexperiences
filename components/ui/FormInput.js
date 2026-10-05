"use client";

import React, { useEffect, useState } from 'react';
import styles from './FormInput.module.scss';

const FormInput = (props) => {
    const {
        id,
        label,
        type,
        required,
        iconImage,
        errorMessage,
        handleChange,
        shouldValidateStrength = false,
        options = [], // 单选框选项数组
        disabled = false, // 禁用状态（共用）
        hasQrcode = false,
        setScanner,
        hasAll = false,
        handleAllClick,
        ...inputProps
    } = props;

    const hidden = type == "hidden";
    if (hidden) {
        return (
            <input
                {...inputProps}
                type="hidden"
                value="user"
            />
        );
    }

    const isPassword = type == "password";
    const isRadio = type == "radio";

    // const [focused, setFocused] = useState(false);
    const [isShaking, setIsShaking] = useState(false);
    const [localError, setLocalError] = useState('');
    const [isPrivacy, setIsPrivacy] = useState(true);
    const [passwordStrength, setPasswordStrength] = useState("");

    const handleBlur = (label) => (e) => {
        // setFocused(true);
        if (required && !e.target.value) {
            setLocalError(`Required field "${label}" cannot be empty`);
            triggerShake();
        } else {
            setLocalError('');
        }
    };

    const triggerShake = () => {
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 400);
    };

    const getPasswordStrength = (password) => {
        let strength = 0;

        if (password?.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[@$!%*?&#^()_\-+=]/.test(password)) strength++;

        if (strength <= 2) return 'weak';
        if (strength === 3 || strength === 4) return 'medium';
        return 'strong';
    };

    useEffect(() => {
        if (shouldValidateStrength && inputProps.value) {
            const strengthLevel = getPasswordStrength(inputProps.value);
            setPasswordStrength(strengthLevel);
        } else {
            setPasswordStrength("");
        }
    }, [inputProps.value, shouldValidateStrength]);

    // 单选框渲染
    if (isRadio) {
        return (
            <div className={styles.formInputSection}>
                <label className={label !== "Or Quick Action" ? styles.inputLabel : styles.quickActionLabel}>{label}</label>
                <div className={styles.inputContainer}>
                    <div className={label !== "Or Quick Action" ? styles.radioGroup : styles.quickActionRadioGroup}>
                        {options.map((option) => (
                            <label key={option.value} className={styles.radioLabel}>
                                <input
                                    type="radio"
                                    {...inputProps}
                                    value={option.value}
                                    checked={inputProps.value === option.value}
                                    onChange={handleChange}
                                    disabled={disabled}
                                />
                                <span className={styles.radioCustom}></span>
                                {option.label}
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // 普通输入框渲染
    return (
        <div className={styles.formInputSection} >
            <label className={styles.inputLabel}>{label}</label>
            <div className={`${styles.inputContainer} ${isShaking && styles.shakeAnimation}`}>
                <div className={styles.inputIcon}>
                    {iconImage && <div dangerouslySetInnerHTML={{ __html: iconImage }} />}
                </div>
                <input
                    {...inputProps}
                    onChange={handleChange}
                    onBlur={handleBlur(label)}
                    // onFocus={() => { inputProps.name === "cpassword" && setFocused(true); }}
                    // focused={focused.toString()}
                    type={isPassword ? (isPrivacy ? "password" : "text") : type}
                    className={!iconImage ? styles.noInputIcon : undefined}
                    value={inputProps.value}
                    disabled={disabled}
                />
                {/* 密码字段显示小眼睛 */}
                {isPassword && (
                    <div className={styles.rightInputtIcon} onClick={() => setIsPrivacy(!isPrivacy)}>
                        <i className={`fa ${isPrivacy ? "fa-eye-slash" : "fa-eye"}`} />
                    </div>
                )}
                {/* 只有钱包地址才显示二维码 */}
                {hasQrcode && !disabled && (
                    <div className={styles.rightInputtIcon} onClick={() => setScanner(true)}>
                        <i className="fa fa-qrcode"></i>
                    </div>
                )}
                {/* 只有体现金额时才显示ALL按钮 */}
                {hasAll && (
                    <div className={styles.rightInputtIcon} onClick={handleAllClick}>
                        ALL
                    </div>
                )}
            </div>
            {/* 只有在应该验证强度时才显示密码强度区域 */}
            {shouldValidateStrength && inputProps.value && (
                <div className={styles.passwordStrength}>
                    <p className={`${styles.strengthLabel} ${styles[passwordStrength]}`}>
                        {passwordStrength} CREDENTIAL
                    </p>
                    {passwordStrength !== "strong" && (
                        <span>
                            Password should be 4-20 characters and include at least one lowercase letter, one uppercase letter, one number, and one special character (e.g. !@#$%^&*).
                        </span>
                    )}
                </div>
            )}
            <div className={styles.errorMessage}>
                <div dangerouslySetInnerHTML={{ __html: localError || errorMessage || "" }} />
            </div>
        </div>
    );
};

export default FormInput;