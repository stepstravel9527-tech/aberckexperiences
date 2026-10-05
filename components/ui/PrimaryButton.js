"use client"
import { useFormStatus } from 'react-dom'
// import styles from './PrimaryButton.module.scss'

function PrimaryButton({
    pendingText = "Please wait",
    defaultText = "Submit",
    className = "primaryButton",
    disabled = false  // 新增 disabled 属性
}) {
    const { pending } = useFormStatus();
    const isDisabled = pending || disabled;

    const buttonText = pending
        ? <>{pendingText} <i className="fa fa-circle-notch rotating-spinner"></i></>
        : defaultText;

    return (
        <button
            type="submit"
            disabled={isDisabled}
            className={className}
        >
            {buttonText}
        </button>
    );
}

export default PrimaryButton