"use client";

// import styles from './SignIn.module.scss';
import { useEffect, useState } from 'react';
import { resetPassword } from "@/app/actions/user/action";
import { useRouter } from "next/navigation";
import { getMetaData } from '@/components/auth/ChangePassword.config';
import FailModal from '@/components/ui/modals/FailModal';
import { validateFormAll} from '@/utils/validateForm';
import AuthPage from '@/components/auth/AuthPage';
import { logout } from '@/app/actions/user/action';
import ToastManager from '@/utils/toastManager';

const ChangePassword = () => {
    const { push } = useRouter();
    const [passwordMetaData, setPasswordMetaData] = useState([]);

    const [isError, setIsError] = useState(false);
    const [resData, setResData] = useState({});

    const [values, setValues] = useState({
        old_password: "",
        new_password: "",
        confirm_password: "",
    });

    const handleForm = async (formData) => {
        if (!validateFormAll(passwordMetaData, values)) return;
        try {
            const response = await resetPassword(formData);

            if (response.status === 201) {
                ToastManager.success(response.message);
                await logout();
                push("/welcome");
                return;
            } else {
                setResData(response);
                setIsError(true);
            }

        } catch (error) {
            console.log(error)
        }
    }

    const handleChange = (e) => {
        setValues(prevValues => ({
            ...prevValues,
            [e.target.name]: e.target.value
        }));
    };

    useEffect(() => {
        const metaData = getMetaData(values);
        setPasswordMetaData(metaData);

    }, [values])

    const handleBackClick = () => {
        push("/profile");
    }

    const tabs = [
        { href: "/security/change-password", label: "Login password" },
        { href: "/security/change-pin", label: "Withdrawal password" }
    ];

    return (
        <>
            {isError && (
                <FailModal
                    title="Something Went Wrong"
                    category="passwordFail"
                    setIsModal={setIsError}
                    resData={resData}
                />
            )}
            <AuthPage
                title="Change password"
                subTitle="Please change your password according to the content below"
                handleBackClick={handleBackClick}
                tabs={tabs}
                handleForm={handleForm}
                metaData={passwordMetaData}
                values={values}
                handleChange={handleChange}
                defaultText="Change Now"
            />
        </>
    )
}

export default ChangePassword