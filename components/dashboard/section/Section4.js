"use client"

import styles from "./Section4.module.scss";
import React from 'react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Image from 'next/image';
import image1 from "@/public/images/section4/1.png";
import image2 from "@/public/images/section4/2.png";
import image3 from "@/public/images/section4/3.png";
import image4 from "@/public/images/section4/4.png";
import image5 from "@/public/images/section4/5.png";

const Section4 = () => {
    const data = [
        {
            id: 1,
            image: image1,
            title: "Family Adventures",
            subtitle: "Horizon-broadening, mind-expanding experiences for all ages"
        },
        {
            id: 2,
            image: image2,
            title: "Solo Travel",
            subtitle: "Group journeys to join and inspiration for independent travellers"
        },
        {
            id: 3,
            image: image3,
            title: "Wildlife and Safari",
            subtitle: "Front-row seats at nature's greatest wildlife spectacles"
        },
        {
            id: 4,
            image: image4,
            title: "Active Adventures",
            subtitle: "Intrepid experiences at the earth’s wildest frontiers"
        },
        {
            id: 5,
            image: image5,
            title: "Wilderness Escapes",
            subtitle: "Remote escapes in extraordinary landscapes "
        }
    ];

    const settings = {
        dots: false,
        infinite: true,
        speed: 1000,
        slidesToShow: 2.05,
        slidesToScroll: 1,
        arrows: false,
        autoplay: true,
        autoplaySpeed: 2000,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 2.05
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1.05
                }
            }
        ]
    };

    return (
        <div className={styles.sliderContainer}>
            <h1>What kind of trip are you looking for?</h1>
            <Slider {...settings}>
                {data.map((item) => (
                    <div key={item.id} className={styles.imageContainer}>
                        <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className={styles.backgroundImage}
                            unoptimized
                        />
                        <div className={styles.title}>
                            {item.title}
                        </div>
                        <div className={styles.subtitle}>
                            {item.subtitle}
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    )
}

export default Section4