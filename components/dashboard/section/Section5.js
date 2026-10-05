"use client"

import styles from './Section5.module.scss';
import React from 'react';
import Image from 'next/image';
import image1 from "@/public/images/Section5/1.png";
import image2 from "@/public/images/Section5/2.png";
import image3 from "@/public/images/Section5/3.png";

const Section5 = () => {
    const imagesData = [
        {
            id: 1,
            image: image1,
            title: "A&K Sanctuary",
            desc: "Thrilling safaris and epic voyages in our own five-star wilderness lodges and state-of-the-art riverboats"
        },
        {
            id: 2,
            image: image2,
            title: "Beach Holidays",
            desc: "The world's dreamiest beach hotels and private-island resorts, from Antigua to the Seychelles"
        },
        {
            id: 3,
            image: image3,
            title: "A&K Villas",
            desc: "Our carefully curated collection of sensational villas in Europe's most sensational locations"
        }
    ];

    return (
        <section className={styles.section5}>
            <div className={styles.title}>
                STAY WITH A&K
            </div>
            <div className={styles.desc}>
                Iconic safari lodges and luxury riverboats, private-island hideaways and next-level villas – every property in our collection is extraordinary
            </div>
            <div className={styles.imagesContainer}>
                {imagesData.map((item) => (
                    <div key={item.id} className={styles.imageCard}>
                        <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className={styles.image}
                            unoptimized
                        />
                        <div className={styles.overlay}>
                            <h3 className={styles.imageTitle}>{item.title}</h3>
                            <p className={styles.imageDesc}>{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Section5