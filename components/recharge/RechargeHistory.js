"use client";

import styles from '@/components/withdrawal/WithdrawalHistory.module.scss'
import React from 'react'
import data_not_found from "@/public/not_found.png";
import Image from 'next/image';
import moment from 'moment-timezone';
import NavigationBar from '@/components/layout/NavigationBar'
import RechargeHistoryCard from './RechargeHistoryCard';

const RechargeHistory = ({ history }) => {

    return (
        <section className={styles.withdrawalHistorySection}>
            <NavigationBar title="Deposit History" />
            <main className={styles.withdrawalHistoryCardSection}>
                {history?.length > 0 ? (
                    history?.map((data, index) => (
                        <RechargeHistoryCard
                            key={data.id || data._id || index}
                            data={data}
                        />
                    )).reverse()
                ) : (
                    <div className="dataNotFound">
                        <Image
                            src={data_not_found}
                            height={100}
                            width={100}
                            alt="No withdrawals found"
                            unoptimized
                        />
                    </div>
                )}
            </main>
        </section>
    )
}

export default RechargeHistory