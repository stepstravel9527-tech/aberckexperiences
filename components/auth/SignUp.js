"use client";

// import styles from './SignIn.module.scss';
import { useState } from 'react';
import { createUser } from '@/app/actions/user/action';
import { getMetaData } from '@/components/auth/SignUp.config';
import Modal from '@/components/ui/modals/Modal';
import FailModal from '@/components/ui/modals/FailModal';
import { validateForm } from '@/utils/validateForm';
import AuthPage from '@/components/auth/AuthPage';
import { useRouter } from 'next/navigation';
import ToastManager from '@/utils/toastManager';
import { authenticate } from '@/app/actions/user/action';

const SignUp = () => {
    const { push } = useRouter();
    const registerMetaData = getMetaData();

    const [isSuccessModal, showSuccessModal] = useState(false);
    // const [isFailModal, showFailModal] = useState(false);

    const [values, setValues] = useState({
        username: "",
        phone_number: "",
        email: "",
        withdrawal_pin: "",
        password: "",
        ref_code: ""
    });

    const handleForm = async (formData) => {
        //字段非空验证
        if (!validateForm(registerMetaData, values, ["hidden"])) return;

        try {
            const response = await createUser(formData);

            if (response.status === 201) {
                showSuccessModal(true)
            } else {
                ToastManager.error(response.message);
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

    const handleBackClick = () => {
        push("/signin");
    }

    const tabs = [
        { href: "/signin", label: "Log In" },
        { href: "/signup", label: "Register" }
    ];

    const singin = async () => {
        const formData = new FormData();
        formData.append("username", values.username);
        formData.append("password", values.password);

        try {
            const response = await authenticate(formData);

            if (response === undefined) {
                ToastManager.success("Successfully logged In");
                push("/");
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            {isSuccessModal && (
                <Modal
                    type="success"
                    title="Welcome"
                    message="Congratulations! Your account is ready. Let's start your journey."
                    onPositiveClick={singin}
                    onNegativeClick={handleBackClick}
                    positiveButtonText="BEGIN JOURNEY"
                    negativeButtonText="OPEN LOGIN"
                />
            )}

            <AuthPage
                title="Get Started now"
                subTitle="Create an account or log in to start your artistic adventure."
                handleBackClick={handleBackClick}
                tabs={tabs}
                handleForm={handleForm}
                metaData={registerMetaData}
                values={values}
                handleChange={handleChange}
                defaultText="Create Account"
            />
        </>
    )
}


export default SignUp