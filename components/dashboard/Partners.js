"use client"

import styles from './Partners.module.scss'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import React from 'react'
import Image from 'next/image';
import partnerImg1 from "@/public/images/partners/1.png"
import partnerImg2 from "@/public/images/partners/2.png"
import partnerImg3 from "@/public/images/partners/3.png"
import partnerImg4 from "@/public/images/partners/4.png"
import partnerImg5 from "@/public/images/partners/5.png"
import partnerImg6 from "@/public/images/partners/6.png"
import partnerImg7 from "@/public/images/partners/7.png"
import partnerImg8 from "@/public/images/partners/8.png"
import partnerImg9 from "@/public/images/partners/9.png"

const Partners = () => {
    const partnersData = [
        { id: 1, image: partnerImg1 },
        { id: 2, image: partnerImg2 },
        { id: 3, image: partnerImg3 },
        { id: 4, image: partnerImg4 },
        { id: 5, image: partnerImg5 },
        { id: 6, image: partnerImg6 },
        { id: 7, image: partnerImg7 },
        { id: 8, image: partnerImg8 },
        { id: 9, image: partnerImg9 }
    ];

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4.05,
        slidesToScroll: 1,
        arrows: false,
        autoplay: true,
        autoplaySpeed: 2000,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 3.05
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2.05
                }
            }
        ]
    };

    return (
        <section className={styles.partnershipWrapper}>
            <h1>Partnership</h1>
            <Slider {...settings}>
                {partnersData.map((partner) => (
                    <div key={partner.id} className={styles.partnersImage}>
                        <Image
                            src={partner.image}
                            alt={`partner-${partner.id}`}
                            height={100}
                            width={100}
                            unoptimized
                        />
                    </div>
                ))}
            </Slider>
        </section>
    )
}

export default Partners