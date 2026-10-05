"use client";

// import styles from './SignIn.module.scss';
import { useRouter } from 'next/navigation';
import { authenticate } from '@/app/actions/user/action';
import { useEffect, useState } from 'react';
import { getMetaData } from '@/components/auth/Signin.config';
import FailModal from '@/components/ui/modals/FailModal';
import { validateFormAll } from '@/utils/validateForm';
import AuthPage from '@/components/auth/AuthPage';
import ToastManager from '@/utils/toastManager';

const SignIn = () => {
    const { push } = useRouter();
    const loginMetaData = getMetaData();

    const [isMessage, setIsMessage] = useState(false);
    const [isBand, setIsBand] = useState(false);
    const [resData, setResData] = useState({});


    const [values, setValues] = useState({
        username: "",
        password: ""
    });

    const handleForm = async (formData) => {
        if (!validateFormAll(loginMetaData, values)) return;

        try {
            const response = await authenticate(formData);

            if (response === undefined) {
                ToastManager.success("Successfully logged In");
                push("/");
                saveLoginData(formData);
                return;
            } else {
                if (response.message === "User has been banned") {
                    setIsBand(true);
                } else {
                    setIsMessage(true);
                }
                setResData(response);
            }
        } catch (error) {
            console.log(error)
        }
    }

    const saveLoginData = (data) => {
        const { username, password, remember } = Object.fromEntries(data);
        console.log(remember);
        if (remember) {
            const loginData = { username, password };
            localStorage.setItem("xjdeiuqx_history", JSON.stringify(loginData));
        }
    };

    const handleChange = (e) => {
        setValues(prevValues => ({
            ...prevValues,
            [e.target.name]: e.target.value
        }));
    };

    useEffect(() => {
        const fromHistory = localStorage.getItem("xjdeiuqx_history");
        if (fromHistory) {
            const parsedData = JSON.parse(fromHistory);
            setValues({
                username: parsedData?.username || "",
                password: parsedData?.password || ""
            });
        }
    }, []);

    const handleBackClick = () => {
        push("/welcome");
    }

    const tabs = [
        { href: "/signin", label: "Log In" },
        { href: "/signup", label: "Register" }
    ];

    return (
        <>
            {isMessage && (
                <FailModal
                    title="Invalid username or password"
                    subTitle=""
                    setIsModal={setIsMessage}
                    category="login"
                />
            )}

            {isBand && (
                <FailModal
                    title="User has been banned"
                    subTitle="Please contact customer support"
                    setIsModal={setIsBand}
                    category="block"
                />
            )}
            <AuthPage
                title="Get Started now"
                subTitle="Create an account or log in to start your artistic adventure."
                handleBackClick={handleBackClick}
                tabs={tabs}
                handleForm={handleForm}
                metaData={loginMetaData}
                values={values}
                handleChange={handleChange}
                defaultText="Log In"
                hasOptions={true}
            />
        </>
    )
}

export default SignIn