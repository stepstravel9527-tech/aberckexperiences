"use client"
import styles from './Welcome.module.scss'
import Image from "next/image"
import Link from "next/link";
import logo from "@/public/logo/white_logo.png"

const Welcome = () => {
    return (
        <section className={`${styles.welcomeSection} pageAnimation`}>
            <div className={styles.contentContainer}>
                <div className={styles.logoContainer}>
                    <Image
                        src={logo}
                        alt="logo"
                        height={100}
                        width={100}
                        unoptimized
                    />
                </div>
                <div className={styles.textContainer}>
                    <h1>
                        A&K JOURNEYS MAKE AN IMPACT
                    </h1>
                    <p>
                        We are committed to making travel a force for good. Every trip you book with us supports A&K Philanthropy initiatives, positively impacting communities and conservation efforts in the places where we travel.
                    </p>
                </div>
                <Link href={"/signin"}>
                    <button className="primaryButton">Start Today</button>
                </Link>
            </div>
        </section>
    )
}

export default Welcome