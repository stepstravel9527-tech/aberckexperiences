"use client";

import Image from "next/image";
import vip1 from "@/public/images/membership/1.png"
import vip2 from "@/public/images/membership/2.png"
import vip3 from "@/public/images/membership/3.png"
import vip4 from "@/public/images/membership/4.png"
import { useState } from "react";
import NavigationBar from '@/components/layout/NavigationBar'
import styles from './Membership.module.scss';
import { formatPrice } from '@/utils/validateForm';

const Membership = ({ allCommission, userCommission }) => {

    const [activeIndex, setActiveIndex] = useState(null);

    const arrayVip = [vip1, vip2, vip3, vip4];

    const arrayText = [
        "Perfect for those just starting out",
        "Easy integration to your website for FAST payments",
        "Take your business to new heights",
        "Scale your business with everything on PLUS",
    ];

    const toggleDropdown = (index) => {
        setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
    };

    return (
        <section className={styles.membershipSection}>
            <NavigationBar title="Membership" />
            <div className={styles.membershipWrapper}>
                <div className={styles.membershipIntro}>
                    <h3>START WITH THE<br /> RIGHT PLAN</h3>
                    <p>Choose the plan that works for your travel<br /> business no matter where you are in your journey.</p>
                </div>
                {
                    allCommission?.map((data, index) => (
                        <div
                            className={`${styles.membershipCard} ${styles[`delay${index + 1}`]}`}
                            key={data.id || index}
                            onClick={() => toggleDropdown(index)}
                        >
                            <div className={styles.cardHeader}>
                                <div className={styles.cardInfo}>
                                    <h1>{data.membership_name}</h1>
                                    <p>{formatPrice(data.account_balance_limit)} USD/activate</p>
                                    {
                                        data.membership_level === userCommission && (
                                            <span className={styles.status}>
                                                Current
                                            </span>
                                        )
                                    }
                                </div>
                                <div className={styles.cardToggle}>
                                    <i
                                        className={`fa ${activeIndex === index ? "fa-angle-up" : "fa-angle-down"
                                            }`}
                                    ></i>
                                </div>
                            </div>
                            {activeIndex === index && (
                                <>
                                    <div className={styles.cardDropdown}>
                                        <Image
                                            src={arrayVip[index]}
                                            alt="vip"
                                            height={100}
                                            width={100}
                                            unoptimized
                                        />
                                        <p>{arrayText[index]}</p>
                                    </div>
                                    <div className={styles.cardDetails}>
                                        <div className={styles.detailItem}>
                                            <div className={styles.key}><span>Daily Deals</span></div>
                                            <div className={styles.value}><span>{data.order_quantity}</span></div>
                                        </div>
                                        <div className={styles.detailItem}>
                                            <div className={styles.key}>Normal Rebate</div>
                                            <div className={styles.value}><span>{(data.commission_rate * 100)?.toFixed(2)}%</span></div>
                                        </div>
                                        <div className={styles.detailItem}>
                                            <div className={styles.key}>Rewards Rebate</div>
                                            <div className={styles.value}><span>{(data.ticket_commission * 100)?.toFixed(2)}%</span></div>
                                        </div>
                                        {/* <div className={styles.detailItem}>
                                            <div className={styles.key}>Normal</div>
                                            <div className={styles.key}>Tourism</div>
                                        </div>
                                        <div className={styles.detailItem}>
                                            <div className={styles.dataCard}>
                                                <div className={styles.key}>Tourism</div>
                                                <div className={styles.value}>{(data.commission_rate * 100)?.toFixed(2)}</div>
                                                <div className={styles.key}>Commission</div>
                                                <div className={styles.value}>0%</div>
                                            </div>
                                            <div className={styles.dataCard}>
                                                <div className={styles.key}>Awards</div>
                                                <div className={styles.value}>{(data.ticket_commission * 100)?.toFixed(2)}</div>
                                                <div className={styles.key}>Commission</div>
                                                <div className={styles.value}>0%</div>
                                            </div>
                                        </div> */}
                                    </div>
                                </>
                            )}
                        </div>
                    ))
                }
            </div>
        </section>
    )
}

export default Membership