"use client";

// import styles from './LinkWallet.module.scss'
import { createWallet } from "@/app/actions/user/action";
import { useRouter } from "next/navigation";
import { useState } from "react";
import QRScanner from "@/components/ui/QRScanner";
import { validateFormAll } from '@/utils/validateForm';
import AuthPage from '@/components/auth/AuthPage';
import { getMetaData } from './LinkWallet.config';
import ToastManager from '@/utils/toastManager';

const LinkWallet = ({ authenticatedUser }) => {

    const { push, refresh } = useRouter();
    const walletMetaData = getMetaData();

    const [values, setValues] = useState({
        wallet_name: authenticatedUser.wallet_name,
        wallet_phone: authenticatedUser.wallet_phone,
        wallet_address: authenticatedUser.wallet_address,
        currency: authenticatedUser.currency || "USDT",
        network_type: authenticatedUser.network_type || "TRC 20"
    });

    const [scanner, setScanner] = useState(false);

    const handleForm = async (formData) => {
        if (!validateFormAll(walletMetaData, values)) return;

        try {
            formData.append("id", authenticatedUser?._id);

            const response = await createWallet(formData);

            if (response.status === 201) {
                ToastManager.success(response.message);
                push("/withdrawal");
                refresh();
                return;
            } else {
                return ToastManager.error(response.message);
            }

        } catch (error) {
            console.log(error)
        }
    }

    const disableInput = authenticatedUser?.network_type !== null;

    const handleChange = (e) => {
        setValues(prevValues => ({
            ...prevValues,
            [e.target.name]: e.target.value
        }));
    };

    const setWalletAddress = (newAddress) => {
        setValues(prevValues => ({
            ...prevValues,
            wallet_address: newAddress
        }));
    };

    return (
        <>
            {
                scanner
                    ?
                    <QRScanner
                        setScanner={setScanner}
                        setWalletUserAddress={setWalletAddress}
                    />
                    :
                    <></>
            }
            <AuthPage
                title="Link Wallet"
                subTitle="Link your cryptocurrency wallet now to enjoy faster and seamless withdrawals."
                handleForm={handleForm}
                metaData={walletMetaData}
                values={values}
                handleChange={handleChange}
                defaultText="Link Wallet"
                disabled={disableInput}
                setScanner={setScanner}
            />
            {/* <section className={styles.linkWalletSection}>
                <NavigationBar backgroundColor="transparent" whiteTheme={true} />
                <AuthHeader
                    title="Link Wallet"
                    subTitle="Link your cryptocurrency wallet now to enjoy faster and seamless withdrawals."
                // icon={icon_wallet}
                // isWallet={true}
                />
                <form action={handleForm} noValidate>
                    <div className={styles.formContainer}>
                        <div className={styles.inputLabel}>Full Name</div>
                        <div className={styles.inputContainer}>
                            <input
                                type="text"
                                placeholder="Please enter your full name"
                                name="wallet_name"
                                defaultValue={authenticatedUser?.wallet_name ?? ""}
                                required
                                disabled={disableInput}
                                onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                            />
                        </div>
                        <div className={styles.inputLabel}>Phone Number</div>
                        <div className={styles.inputContainer}>
                            <input
                                type="text"
                                placeholder="Please enter your phone number"
                                name="wallet_phone"
                                defaultValue={authenticatedUser?.wallet_phone}
                                required
                                disabled={disableInput}
                                onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                            />
                        </div>
                        <div className={styles.inputLabel}>Wallet Address</div>
                        <div className={styles.inputContainer} style={{ position: "relative" }}>
                            <input
                                type="text"
                                placeholder="Please enter your wallet address"
                                name="wallet_address"
                                value={walletAddress}
                                onChange={(e) => setWalletAddress(e.target.value)}
                                required
                                disabled={disableInput}
                                onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                            />
                            {
                                !disableInput && (
                                    <div className={styles.walletScanner} onClick={() => setScanner(true)}>
                                        <Image
                                            src={icon_scan_qrcode}
                                            alt="qrcode"
                                            height={100}
                                            width={100}
                                            unoptimized
                                        />
                                    </div>
                                )
                            }
                        </div>

                        <div className={styles.inputLabel}>Cryptocurrency</div>
                        <div className={styles.inputContainer}>
                            <div className={styles.radioGroup}>
                                {currencyOptions.map((option) => (
                                    <label key={option.value}  >
                                        <input
                                            type="radio"
                                            name="currency"
                                            value={option.value}
                                            checked={selectedCurrencyOption === option.value}
                                            onChange={(e) => handleOptionChange(e)}
                                            disabled={disableInput}
                                        />
                                        <span className={styles.radioCustom}></span>
                                        {option.label}
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className={styles.inputLabel}>Network</div>
                        <div className={styles.inputContainer}>
                            <div className={styles.radioGroup}>
                                {networkOptions.map((option) => (
                                    <label key={option.value} >
                                        <input
                                            type="radio"
                                            name="network_type"
                                            value={option.value}
                                            checked={selectedNetworkOption === option.value}
                                            onChange={handleNetworkOptionChange}
                                            disabled={disableInput}
                                        />
                                        <span className={styles.radioCustom}></span>
                                        {option.label}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className={styles.buttonWraper}>
                        <PrimaryButton defaultText='Link Wallet' disabled={disableInput} className="authButton" />
                    </div>
                </form>
            </section> */}
        </>
    )
}

export default LinkWallet