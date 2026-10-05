// components/withdrawal/Withdrawal.js
"use client";

import styles from './Withdrawal.module.scss'
import Link from 'next/link';
import { useState } from 'react';
import { withdrawal } from '@/app/actions/user/action';
import WithdrawalSuccessReceipt from './WithdrawalSuccessReceipt';
import FailModal from '@/components/ui/modals/FailModal';
import { getMetaData } from './Withdrawal.config';
import FormInput from '@/components/ui/FormInput';
import { validateForm } from '@/utils/validateForm';
import NavigationBar from '@/components/layout/NavigationBar'
import icon_withdrawal_history from "@/public/icons/icon_withdrawal_history.svg";
import { useRouter } from "next/navigation";
import WithdrawalCard from "./WithdrawalCard";
import PrimaryButton from '@/components/ui/PrimaryButton';

const Withdrawal = ({ authenticatedUser }) => {
    const [isSuccess, setIsSuccess] = useState(false);
    const [isFail, setIsFail] = useState(false);

    const [resData, setResData] = useState({});
    const hasWallet = authenticatedUser.network_type !== null;

    const metaData = getMetaData();

    const [values, setValues] = useState({
        amount: "",
        withdrawal_pin: ""
    });

    const handleForm = async (formData) => {
        if (!validateForm(metaData, values, ["radio"])) return;
        try {
            const response = await withdrawal(formData);
            if (response.status === 201) {
                setIsSuccess(true);
                return;
            } else {
                setIsFail(true);
                setResData(response);
            }

        } catch (error) {
            console.log(error)
        }
    }

    const { push } = useRouter();
    const handleBackClick = () => {
        push("/");
    }
    const handleHistoryClick = () => {
        push("/withdrawal/history");
    }

    const handleChange = (e) => {
        setValues(prevValues => ({
            ...prevValues,
            [e.target.name]: e.target.value
        }));
    };

    const handleAllClick = () => {
        setValues(prevValues => ({
            ...prevValues,
            amount: authenticatedUser.balance.toFixed(2)
        }));
    };

    return (
        <>
            {
                isSuccess
                    ?
                    <WithdrawalSuccessReceipt
                        setIsModal={setIsSuccess}
                        amount={Number(values.amount)}
                        authenticatedUser={authenticatedUser}
                    />
                    :
                    <></>
            }
            {
                isFail
                    ?
                    <FailModal
                        title="Withdrawal Failed!"
                        category="withdrawal"
                        setIsModal={setIsFail}
                        resData={resData}
                    />
                    :
                    <></>
            }
            <section className={styles.withdrawalSection}>
                <NavigationBar
                    title="Withdrawal"
                    backgroundColor="transparent"
                    onLeftClick={handleBackClick}
                    rightIcon={icon_withdrawal_history}
                    onRightClick={handleHistoryClick}
                />

                <WithdrawalCard authenticatedUser={authenticatedUser} hasWithdrawalInfo={hasWallet} />
                <main className={styles.contentContainer}>
                    {hasWallet ? (
                        <form action={handleForm} noValidate>
                            <div className={styles.formContainer}>
                                {metaData && metaData.map((input) => (
                                    <FormInput
                                        key={input.id}
                                        {...input}
                                        value={values[input.name]}
                                        handleChange={handleChange}
                                        handleAllClick={handleAllClick}
                                    />
                                ))}
                                <PrimaryButton defaultText="Withdrawal Now" disabled={!authenticatedUser.allow_withdrawal} />
                            </div>
                        </form>
                    ) : (
                        <div className={styles.emptyWallet}>
                            <div className={styles.emptyWalletText}>
                                <h1>
                                    No wallet available
                                </h1>
                                <p>Please link crypto wallet to your account before any withdrawal.</p>
                            </div>
                            <div className={styles.emptyWalletAction}>
                                <Link href="/withdrawal/linkwallet">
                                    <button className="primaryButton">
                                        Link Wallet
                                    </button>
                                </Link>
                            </div>
                        </div>
                    )}
                </main>
            </section >
        </>
    )
}

export default Withdrawal