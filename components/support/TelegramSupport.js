"use client"
import { useEffect, useState } from 'react';

const TelegramSupport = ({
    contact = "",
    children = "Telegram Support"
}) => {

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // 检测是否是移动设备
        const checkMobile = () => {
            return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        };
        setIsMobile(checkMobile());
    }, []);

    const handleOpenTelegram = () => {
        const username = contact.replace('@', '');
        let telegramUrl;
        if (isMobile) {
            // 移动设备：打开 Telegram app
            telegramUrl = username
                ? `tg://resolve?domain=${username}`
                : 'tg://';
        } else {
            // 桌面设备：打开 Web 版
            telegramUrl = username
                ? `https://t.me/${username}`
                : `https://t.me/`;
        }
        window.open(telegramUrl, '_blank');
    };

    return (
        <button
            onClick={handleOpenTelegram}
            className="primaryButton"
        >
            {children}
        </button>
    );
};

export default TelegramSupport;