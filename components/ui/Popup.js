"use client";

import Image from 'next/image'
import React from 'react'
import styles from './Popup.module.scss';

const Popup = ({ pop, setIsShow }) => {
    const getAnimationClass = () => {
        const animationMap = {
            'back_fade': styles.backFade,
            'back_fade_up': styles.backFadeUp,
            'back_fade_down': styles.backFadeDown,
            'back_fade_right': styles.backFadeRight,
            'back_fade_left': styles.backFadeLeft,
            'back_fade_scale': styles.backFadeScale,
            'back_scale': styles.backScale
        };
        
        return animationMap[pop?.animationType] || styles.backScale;
    };

    return (
        <div
            className={styles.popupOverlay}
            onClick={() => setIsShow(false)}
        >
            <Image
                src={pop?.image}
                alt="pop"
                height={100}
                width={100}
                unoptimized
                style={{
                    animationDuration: `${pop?.animationDuration ?? "0.2"}s`,
                    animationTimingFunction: pop?.animationTimingFunction
                }}
                className={getAnimationClass()}
            />
        </div>
    )
}

export default Popup;