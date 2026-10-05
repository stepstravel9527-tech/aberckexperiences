import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import icon_commission from "@/public/images/journey/icon_commission.png";
import icon_commission1 from "@/public/images/journey/icon_commission1.png";
import moment from 'moment-timezone';
import styles from './JourneyHistoryCard.module.scss';
import { formatPrice } from '@/utils/validateForm';

const JourneyHistoryCard = ({ product, membership }) => {
    const calculateCommission = () => {
        if (product?.isJourneyProduct) {
            return (product?.productPrice * membership?.ticket_commission)?.toFixed(2);
        } else {
            return (product?.productPrice * membership?.commission_rate)?.toFixed(2);
        }
    };

    return (
        <div className={styles.gridContainer}>
            {/* 第1行 - 产品名称 */}
            <div className={styles.productName}>
                {product.productName}
            </div>

            {/* 第2行 - 状态和日期 */}
            <div className={styles.productStatus}>
                {product.status}
            </div>
            <div className={styles.dateContainer}>
                {moment.tz(product.createdAt, process.env.NEXT_PUBLIC_TIME_ZONE).format("DD MMM YYYY, hh:mm:ss")}
            </div>

            {/* 第3行 - 图片和价格 */}
            <div className={styles.imageContent}>
                <div className={styles.imageContainer}>
                    {product.url && (
                        <Image
                            src={product.url}
                            height={100}
                            width={100}
                            alt="product"
                            unoptimized
                        />
                    )}
                    <div className={styles.priceOverlay}>
                        <p>Price: <span>{formatPrice(product.productPrice)}</span> USD</p>
                    </div>
                </div>
            </div>

            {/* 第4行 - 佣金和操作按钮 */}
            <div className={styles.commissionsContainer}>
                <Image
                    src={icon_commission1}
                    alt="Rebate"
                    height={100}
                    width={100}
                    className={styles.commissionIcon}
                />
                <div className={styles.commissionLabel}>Rebate</div>
                <div className={styles.commissionValue}>USD {calculateCommission()}</div>
            </div>
            {product.status === "pending" ? (
                <Link href="/journey/submit">
                    <button className="smallButton">Submit</button>
                </Link>
            ) : (
                <div className={styles.commissionsContainer}>
                    <Image
                        src={icon_commission}
                        alt="Rebate"
                        height={100}
                        width={100}
                        className={styles.commissionIcon}
                    />
                    <div className={styles.commissionLabel}>Percentage</div>
                    <div className={styles.commissionValue}>45%</div>
                </div>
            )}
        </div>
    );
};

export default JourneyHistoryCard;