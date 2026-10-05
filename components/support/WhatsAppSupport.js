"use client"
import { useEffect, useState } from 'react';

const WhatsAppSupport = ({
    phoneNumber = "",
    children = "WhatsApp Support"
}) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // 检测是否是移动设备
        const checkMobile = () => {
            return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        };
        setIsMobile(checkMobile());
    }, []);

    const handleOpenWhatsApp = () => {
        let whatsappUrl;

        if (isMobile) {
            // 移动设备：打开 WhatsApp app
            whatsappUrl = phoneNumber
                ? `https://wa.me/${phoneNumber.replace(/\D/g, '')}`
                : 'whatsapp://';
        } else {
            // 桌面设备：打开 Web 版
            whatsappUrl = phoneNumber
                ? `https://web.whatsapp.com/send?phone=${phoneNumber.replace(/\D/g, '')}`
                : 'https://web.whatsapp.com';
        }

        window.open(whatsappUrl, '_blank');
    };

    return (
        <button
            onClick={handleOpenWhatsApp}
            className="primaryButton"
        >
            {children}
        </button>
    );
};

export default WhatsAppSupport;