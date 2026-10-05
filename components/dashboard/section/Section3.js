"use client"

import styles from "./Section3.module.scss";
import React from 'react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Image from 'next/image';
import image1 from "@/public/images/Section3/1.png";
import image2 from "@/public/images/Section3/2.png";
import image3 from "@/public/images/Section3/3.png";

const Section3 = () => {
    const data = [
        {
            id: 1,
            image: image1,
            title: "South Africa and Victoria Falls",
            duration: "9 days • limited to 18 guests",
            itineraryLabel: "Itinerary",
            locations: "Cape Town • Greater Kruger National Park • Victoria Falls • Johannesburg",
            price: 13245,
            buttonText: "View Journey"
        },
        {
            id: 2,
            image: image2,
            title: "A&K x Crystal Cruises: The Insider's Mediterranean",
            duration: "10 days • limited to 60 guests",
            itineraryLabel: "Itinerary",
            locations: "Valletta • Tunis • Cagliari • Day at sea • Alicante • Valencia • Palma de Mallorca • Barcelona",
            price: 19495,
            buttonText: "View Journey"
        },
        {
            id: 3,
            image: image3,
            title: "Peru Machu Picchu and Amazon Cruise: A Private Journey",
            duration: "13 days",
            itineraryLabel: "Itinerary",
            locations: "Lima • Cusco • Sacred Valley • Machu Picchu • Iquitos • Nauta • Lago Clavero • Yucuruchi • Yanayacu Yacapana",
            price: 18995,
            buttonText: "View Journey"
        }
    ];

    const settings = {
        dots: false,
        infinite: true,
        speed: 600,
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

    // 格式化价格
    const formatPrice = (price) => {
        return price.toLocaleString('en-US');
    };

    return (
        <div className={styles.sliderContainer}>
            <h1>Where do you want to go?</h1>
            <Slider {...settings}>
                {data.map((item) => (
                    <div key={item.id} className={styles.imageContainer}>
                        <Image
                            src={item.image}
                            alt={`brand-${item.id}`}
                            height={100}
                            width={100}
                            unoptimized
                        />
                        <div className={styles.title}>
                            {item.title}
                        </div>
                        <div className={styles.duration}>
                            {item.duration}
                        </div>
                        <div className={styles.itineraryLabel}>
                            {item.itineraryLabel}
                        </div>
                        <div className={styles.locations}>
                            {item.locations}
                        </div>
                        <div className={styles.priceSection}>
                            <div className={styles.priceInfo}>
                                From <span>${formatPrice(item.price)}</span> per person.
                            </div>
                            <div>
                                <button className={styles.viewButton}>
                                    {item.buttonText}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    )
}

export default Section3