"use client";

import styles from './JourneyHistory.module.scss'
import NavigationBar from '@/components/layout/NavigationBar'
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import data_not_found from "@/public/not_found.png";
import HistoryFilter from '@/components/ui/HistoryFilter';
import JourneyHistoryCard from "./JourneyHistoryCard";

const JourneyHistory = ({ journeyHistory, membership }) => {
    const [allProducts, setAllProducts] = useState(journeyHistory || []);
    const [statusType, setStatusType] = useState("all");
    const { push } = useRouter();

    // 过滤配置
    const filterConfig = {
        all: (products) => products,
        pending: (products) => products?.filter(product => product.status === "pending"),
        completed: (products) => products?.filter(product => product.status === "completed"),
        //freezed: (products) => products?.filter(product => product.status === "freezed")
    };

    const handleFilter = (filterType) => {
        const filteredProducts = filterConfig[filterType]?.(journeyHistory) || journeyHistory;
        setAllProducts(filteredProducts);
        setStatusType(filterType);
    };

    const handleBackClick = () => {
        push("/journey");
    };

    useEffect(() => {
        setAllProducts(journeyHistory || []);
    }, [journeyHistory]);

    return (
        <section className={styles.journeyHistorySection}>
            <NavigationBar title="History" onLeftClick={handleBackClick} />
            <main className={styles.journeyHistoryCardSection}>

                <HistoryFilter statusType={statusType} onFilterChange={handleFilter} />

                {allProducts?.length > 0 ? (

                    allProducts.map((product, index) => (
                        <JourneyHistoryCard
                            key={`${product.id || product._id || index}`}
                            product={product}
                            membership={membership}
                        />
                    ))
                ) : (
                    <div className="dataNotFound">
                        <Image
                            src={data_not_found}
                            height={100}
                            width={100}
                            alt="No data found"
                            unoptimized
                        />
                    </div>
                )}
            </main>
        </section>
    );
};

export default JourneyHistory;