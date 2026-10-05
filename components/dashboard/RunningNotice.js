"use client"
import React from 'react'
import styles from './RunningNotice.module.scss'

const RunningNotice = ({ notice }) => {
    return (
        <div className={styles.runningNotice}>
            <div className={styles.noticeIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M10.8854 2.86336L8.77829 4.18029C8.48877 4.36124 8.34401 4.45172 8.18871 4.51574C8.05085 4.57257 7.90707 4.61381 7.76004 4.63868C7.59442 4.6667 7.42371 4.6667 7.08229 4.6667H4.00004C2.33337 4.6667 1.33337 6.00003 1.33337 7.33336C1.33337 8.6667 2.33337 10 4.00004 10V13.3334C4.00004 14.0697 4.59699 14.6667 5.33337 14.6667C6.06975 14.6667 6.66671 14.0697 6.66671 13.3334V10H7.08229C7.42371 10 7.59442 10 7.76004 10.028C7.90707 10.0529 8.05085 10.0942 8.18871 10.151C8.34401 10.215 8.48877 10.3055 8.77829 10.4864L10.8854 11.8034C11.6844 12.3027 12.0838 12.5524 12.4135 12.5259C12.7009 12.5028 12.9643 12.3568 13.1362 12.1254C13.3334 11.8598 13.3334 11.3888 13.3334 10.4466V4.22016C13.3334 3.27797 13.3334 2.80688 13.1362 2.54136C12.9643 2.30992 12.7009 2.16393 12.4135 2.14083C12.0838 2.11432 11.6844 2.364 10.8854 2.86336Z" fill="#212529" />
                </svg>
            </div>
            <div className={styles.noticeContent}>
                <marquee direction="left" behavior="scroll" scrollamount="3">{notice}</marquee>
            </div>
        </div>
    )
}

export default RunningNotice