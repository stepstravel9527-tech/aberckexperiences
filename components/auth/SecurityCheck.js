"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Modal from '@/components/ui/modals/Modal';
import { quickLogout } from '@/utils/quickLogout';
import { logout } from '@/app/actions/user/action';

const SecurityCheck = ({ sessionUser, authenticatedUser }) => {
    const { push } = useRouter();
    const [isLogoutModal, showLogoutModal] = useState(false);
    const timeoutRef = useRef(null);

    const checkSecurity = async () => {
        const isBlocked = authenticatedUser?.status;

        if (!isBlocked || sessionUser?.security_code !== authenticatedUser?.security_code) {
            handleLogout();
        }
    };

    const resetTimeout = () => {
        const valMin = 10 * 60000;

        // Clear the existing timeout if it exists
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Set a new timeout and store it in the ref
        timeoutRef.current = setTimeout(() => {
            // throwOutAfter();
            showLogoutModal(true);
        }, valMin);
    };

    useEffect(() => {
        checkSecurity();
        resetTimeout();

        // Clear timeout on component unmount
        return () => clearTimeout(timeoutRef.current);
    }, [sessionUser, authenticatedUser]);

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
            {isLogoutModal && (
                <Modal
                    type="logout"
                    title="Session Expired"
                    message="For security reasons, we've logged you out due to inactivity. Please sign in again to continue."
                    onPositiveClick={handleLogout}
                    positiveButtonText="CONFIRM"
                    hasNegativeButton={false}
                />
            )}
        </>
    );
};

export default SecurityCheck;
