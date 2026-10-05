"use client"

import styles from "./BrandSlider.module.scss"
import React from 'react'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Image from 'next/image';
import image1 from "@/public/images/brands/1.png"
import image2 from "@/public/images/brands/2.png"
import image3 from "@/public/images/brands/3.png"
import image4 from "@/public/images/brands/4.png"
import image5 from "@/public/images/brands/5.png"
import image6 from "@/public/images/brands/6.png"
import image7 from "@/public/images/brands/7.png"
import image8 from "@/public/images/brands/8.png"

const BrandSlider = () => {
    const brandsData = [
        {
            id: 1,
            image: image1,
        },
        {
            id: 2,
            image: image2,
        },
        {
            id: 3,
            image: image3,
        },
        {
            id: 4,
            image: image4,
        },
        {
            id: 5,
            image: image5,
        },
        {
            id: 6,
            image: image6,
        },
        {
            id: 7,
            image: image7,
        },
        {
            id: 8,
            image: image8,
        }
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
        <div className={styles.sliderContainer}>
            <Slider {...settings}>
                {brandsData.map((brand) => (
                    <div key={brand.id} className={styles.imageContainer}>
                        <Image
                            src={brand.image}
                            alt={`brand-${brand.id}`}
                            height={100}
                            width={100}
                            unoptimized
                        />
                    </div>
                ))}
            </Slider>
        </div>
    )
}

export default BrandSlider