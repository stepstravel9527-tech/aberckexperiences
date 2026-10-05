"use client";

import styles from './WithdrawalHistory.module.scss'
import { useEffect, useState } from "react";
import data_not_found from "@/public/not_found.png";
import Image from 'next/image';
import NavigationBar from '@/components/layout/NavigationBar'
import HistoryFilter from '@/components/ui/HistoryFilter';
import WithdrawalHistoryCard from './WithdrawalHistoryCard';

const WithdrawalHistory = ({ withdrawals }) => {
    const [allWithdrawals, setAllWithdrawals] = useState(withdrawals || []);
    const [statusType, setStatusType] = useState("all");

    // 过滤配置
    const filterConfig = {
        all: (data) => data,
        pending: (data) => data?.filter(item => item.status === "pending"),
        completed: (data) => data?.filter(item => item.status === "approved"),
        //rejected: (data) => data?.filter(item => item.status === "rejected")
    };

    const handleFilter = (filterType) => {
        const filteredData = filterConfig[filterType]?.(withdrawals) || withdrawals;
        setAllWithdrawals(filteredData);
        setStatusType(filterType);
    };

    useEffect(() => {
        setAllWithdrawals(withdrawals || []);
    }, [withdrawals]);

    return (
        <section className={styles.withdrawalHistorySection}>
            <NavigationBar title="Withdrawal History" />
            <main className={styles.withdrawalHistoryCardSection}>

                <HistoryFilter
                    statusType={statusType}
                    onFilterChange={handleFilter}
                    filters={[
                        { key: 'all', label: 'All' },
                        { key: 'pending', label: 'Pending' },
                        { key: 'completed', label: 'Completed' },
                        // { key: 'rejected', label: 'On Hold' }
                    ]}
                />

                {allWithdrawals?.length > 0 ? (
                    allWithdrawals?.map((data, index) => (
                            <WithdrawalHistoryCard
                                key={data.id || data._id || index}
                                data={data}
                            />
                        ))
                        .reverse()
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

export default WithdrawalHistory