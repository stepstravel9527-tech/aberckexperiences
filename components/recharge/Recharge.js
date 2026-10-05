"use client";

import styles from '@/components/withdrawal/Withdrawal.module.scss'
import NavigationBar from '@/components/layout/NavigationBar'
import { useState } from 'react';
import SuccessModal from '@/components/ui/modals/SuccessModal';
import { getMetaData } from '@/components/recharge/Recharge.config';
import FormInput from '@/components/ui/FormInput';
import { validateForm } from '@/utils/validateForm';
import icon_withdrawal_history from "@/public/icons/icon_withdrawal_history.svg";
import { useRouter } from "next/navigation";
import WithdrawalCard from "@/components/withdrawal/WithdrawalCard";
import PrimaryButton from '@/components/ui/PrimaryButton';

const Recharge = ({ authenticatedUser }) => {
    const { push } = useRouter();

    const [isSuccess, setIsSuccess] = useState(false);

    const metaData = getMetaData();
    const [values, setValues] = useState({
        amount: ""
    });

    const handleForm = async () => {
        if (!validateForm(metaData, values)) return;

        //setIsSuccess(true);
        push("/support");
    }

    const handleBackClick = () => {
        push("/");
    }
    const handleHistoryClick = () => {
        push("/recharge/history");
    }

    const handleChange = (e) => {
        setValues(prevValues => ({
            ...prevValues,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <>
            {
                isSuccess
                    ?
                    <SuccessModal
                        title="Successful"
                        subTitle="Recharge requested successfully. Please confirm with Live Agent"
                        category="recharge"
                        setIsModal={setIsSuccess}
                    />
                    :
                    <></>
            }
            <section className={styles.withdrawalSection}>
                <NavigationBar title="Deposit"
                    backgroundColor="transparent"
                    onLeftClick={handleBackClick}
                    rightIcon={icon_withdrawal_history}
                    onRightClick={handleHistoryClick}
                />
                <WithdrawalCard authenticatedUser={authenticatedUser} hasWithdrawalInfo={false} />
                <main className={styles.contentContainer}>
                    <form action={handleForm} noValidate>
                        <div className={styles.formContainer}>
                            {metaData && metaData.map((input) => (
                                <FormInput
                                    key={input.id}
                                    {...input}
                                    value={values[input.name]}
                                    handleChange={handleChange}
                                />
                            ))}
                            <PrimaryButton defaultText="Deposit Now" />
                        </div>
                    </form>
                </main>
            </section>
        </>
    );
}

export default Recharge;
