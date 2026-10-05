"use client"

import styles from './Section6.module.scss';
import React from 'react';
import Image from 'next/image';
import image1 from "@/public/images/Section6/1.png";

const Section6 = () => {
    return (
        <section className={styles.section6}>
            <div className={styles.content}>
                <div className={styles.iconContainer}>
                    <Image
                        src={image1}
                        alt="Adventure icon"
                        width={80}
                        height={80}
                        className={styles.icon}
                    />
                </div>
                <div className={styles.title}>
                    Find your next adventure
                </div>
                <div className={styles.desc}>
                    A&K's newsletter is packed with inspiration for your next trip.
                </div>
            </div>
        </section>
    )
}

export default Section6