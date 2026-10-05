"use client"
import React, { useState, useEffect, useRef } from 'react'
import styles from './TopVideo.module.scss'

const TopVideo = () => {
    const videos = [
        { 
            src: "/images/dashboard_video1.mp4", 
            title: "Exclusive Offer",
            subTitle: "Cruise French Polynesia and Get a US$1,500 Air Credit Per Person",
            buttonText: "VIEW OFFER",
            logoImage: "/images/section1/1.png"
        },
        { 
            src: "/images/dashboard_video2.mp4", 
            title: "Tailormade Journeys",
            subTitle: "Uncover Ancient Civilisations and Amazonian Wildlife in Peru",
            buttonText: "START YOUR ADVANTURE",
            logoImage: "/images/section1/2.png"
        },
        { 
            src: "/images/dashboard_video3.mp4", 
            title: "New: Small Group Journeys",
            subTitle: "Our 2027 Collection: with Nine Brand New Journeys",
            buttonText: "Start Your Journey",
            logoImage: "/images/section1/3.png"
        }
    ]
    
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isTransitioning, setIsTransitioning] = useState(false)
    const [isClient, setIsClient] = useState(false)
    const videoRef = useRef(null)

    useEffect(() => {
        setIsClient(true)
    }, [])

    useEffect(() => {
        if (!isClient) return
        
        const interval = setInterval(() => {
            setIsTransitioning(true)
            setTimeout(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % videos.length)
                setIsTransitioning(false)
            }, 500)
        }, 10000)
        
        return () => clearInterval(interval)
    }, [videos.length, isClient])

    useEffect(() => {
        if (!isClient || !videoRef.current) return
        
        const video = videoRef.current
        video.load()
        video.play().catch((error) => {
            console.log("视频自动播放失败:", error)
        })
    }, [currentIndex, isClient])

    const handlePrev = () => {
        if (isTransitioning) return
        const prevIndex = (currentIndex - 1 + videos.length) % videos.length
        setIsTransitioning(true)
        setTimeout(() => {
            setCurrentIndex(prevIndex)
            setIsTransitioning(false)
        }, 500)
    }

    const handleNext = () => {
        if (isTransitioning) return
        const nextIndex = (currentIndex + 1) % videos.length
        setIsTransitioning(true)
        setTimeout(() => {
            setCurrentIndex(nextIndex)
            setIsTransitioning(false)
        }, 500)
    }

    const handleButtonClick = () => {
        console.log("按钮被点击", videos[currentIndex].buttonText)
    }

    if (!isClient) {
        return (
            <div className={styles.topVideoWrapper}>
                <div className={styles.placeholder}>
                    <div className={styles.gridContainer}>
                        <h1 className={styles.overlayTitle}>Exclusive Offer</h1>
                        <p className={styles.overlaySubTitle}>Cruise French Polynesia and Get a US$1,500 Air Credit Per Person</p>
                        <div className={styles.logoContainer}>
                            <img src="/images/section1/1.png" alt="logo" className={styles.logoImage} />
                        </div>
                        <div className={styles.navigationButtons}>
                            <button className={styles.navButton}>❮</button>
                            <button className={styles.navButton}>❯</button>
                        </div>
                        <button className={styles.ctaButton}>VIEW OFFER</button>
                        <div className={styles.carouselIndicators}>
                            <button className={styles.indicator}></button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.topVideoWrapper}>
            <div className={`${styles.videoContainer} ${isTransitioning ? styles.fadeOut : styles.fadeIn}`}>
                <video
                    ref={videoRef}
                    className={styles.backgroundVideo}
                    muted
                    autoPlay
                    playsInline
                    key={currentIndex}
                >
                    <source
                        src={videos[currentIndex].src}
                        type="video/mp4"
                    />
                </video>
            </div>
            
            <div className={styles.gridContainer}>
                {/* 第1个元素：主标题 */}
                <h1 className={styles.overlayTitle}>{videos[currentIndex].title}</h1>
                
                {/* 第2个元素：副标题 */}
                <p className={styles.overlaySubTitle}>{videos[currentIndex].subTitle}</p>
                
                {/* 第3个元素：图片 */}
                <div className={styles.logoContainer}>
                    <img 
                        key={`logo-${currentIndex}`}
                        src={videos[currentIndex].logoImage} 
                        alt="logo" 
                        className={styles.logoImage}
                    />
                </div>
                
                {/* 第4个元素：切换按钮 */}
                <div className={styles.navigationButtons}>
                    <button 
                        className={styles.navButton}
                        onClick={handlePrev}
                        aria-label="上一个视频"
                    >
                        ❮
                    </button>
                    <button 
                        className={styles.navButton}
                        onClick={handleNext}
                        aria-label="下一个视频"
                    >
                        ❯
                    </button>
                </div>
                
                {/* 第5个元素：按钮 */}
                <button 
                    className={styles.ctaButton}
                    onClick={handleButtonClick}
                >
                    {videos[currentIndex].buttonText}
                </button>
                
                {/* 第6个元素：指示器 */}
                <div className={styles.carouselIndicators}>
                    {videos.map((_, index) => (
                        <button
                            key={index}
                            className={`${styles.indicator} ${index === currentIndex ? styles.active : ''}`}
                            onClick={() => {
                                if (!isTransitioning && index !== currentIndex) {
                                    setIsTransitioning(true)
                                    setTimeout(() => {
                                        setCurrentIndex(index)
                                        setIsTransitioning(false)
                                    }, 500)
                                }
                            }}
                            aria-label={`切换到视频 ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default TopVideo