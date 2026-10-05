"use client"

import { useEffect, useState, useRef } from 'react'
import styles from './Section1.module.scss'
import image1 from "@/public/images/section1/1.png"
import image2 from "@/public/images/section1/2.png"
import image3 from "@/public/images/section1/3.png"
import image4 from "@/public/images/section1/4.png"
import image5 from "@/public/images/bg_auth.png"
import image6 from "@/public/images/section1/6.png"
import image7 from "@/public/images/section1/7.png"
import image8 from "@/public/images/section1/8.png"
import image9 from "@/public/images/section1/9.png"

const Section1 = () => {
    const [isVisible, setIsVisible] = useState(true)
    const sectionRef = useRef(null)
    const images = [
        image1, image2, image3,
        image4, image5, image6,
        image7, image8, image9
    ];

    useEffect(() => {
        const section = sectionRef.current
        if (!section) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                // 当section在视口中时显示放大效果
                setIsVisible(entry.isIntersecting)
            },
            {
                threshold: 1, // 当90%可见时触发
            }
        )

        observer.observe(section)
        
        return () => observer.disconnect()
    }, [])

    return (
        <section ref={sectionRef} className={styles.section1}>
            <div 
                className={`${styles.imageGrid} ${isVisible ? styles.scaleLarge : styles.scaleNormal}`}
            >
                {images.map((image, index) => (
                    <div
                        key={index}
                        className={styles.imageItem}
                        style={{
                            backgroundImage: `url(${image.src})`
                        }}
                    />
                ))}
            </div>

            <div className={`${styles.textContainer} ${isVisible ? styles.textVisible : styles.textHidden}`}>
                <div className={styles.title}>
                    Welcome to Flight Centre Travel Group
                </div>
                <div className={styles.desc}>
                    Our Purpose: To open up the world for those who want to see
                </div>
            </div>
        </section>
    )
}

export default Section1