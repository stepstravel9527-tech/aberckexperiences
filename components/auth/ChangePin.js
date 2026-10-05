"use client";

// import styles from './SignIn.module.scss';
import { useEffect, useState } from 'react';
import { resetPin } from "@/app/actions/user/action";
import { useRouter } from "next/navigation";
import { getMetaData } from '@/components/auth/ChangePin.config';
import FailModal from '@/components/ui/modals/FailModal';
import { validateFormAll } from '@/utils/validateForm';
import AuthPage from '@/components/auth/AuthPage';
import ToastManager from '@/utils/toastManager';

const ChangePin = () => {
    const { push } = useRouter();
    const [pinMetaData, setPinMetaData] = useState([]);

    const [isError, setIsError] = useState(false);
    const [resData, setResData] = useState({});

    const [values, setValues] = useState({
        old_pin: "",
        new_pin: "",
        confirm_pin: "",
    });

    const handleForm = async (formData) => {
        if (!validateFormAll(pinMetaData, values)) return;
        try {
            const response = await resetPin(formData);

            if (response.status === 201) {
                ToastManager.success(response.message);
                push("/");
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
        setPinMetaData(metaData);

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
                metaData={pinMetaData}
                values={values}
                handleChange={handleChange}
                defaultText="Change Now"
            />
        </>
    )
}

export default ChangePin