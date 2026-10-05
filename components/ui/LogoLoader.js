import Image from 'next/image'
import React from 'react';
import logo from "@/public/logo/white_logo.png";
import styles from './LogoLoader.module.scss';

const LogoLoader = () => {
    return (
        <div className={styles.logoLoader}>
            <Image
                src={logo}
                alt="logo"
                height={100}
                width={100}
                unoptimized
                className={styles.logoImage}
            />
        </div>
    )
}

export default LogoLoader