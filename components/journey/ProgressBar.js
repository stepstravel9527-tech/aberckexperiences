"use client";

import { useState, useEffect, useMemo, useRef } from 'react';
import styles from './ProgressBar.module.scss';

const ProgressBar = ({ progress, totalProgress, hasPending = false }) => {
    const [currentProgress, setCurrentProgress] = useState(0);
    const [adjustedProgress, setAdjustedProgress] = useState(progress);
    const intervalRef = useRef(null);

    const originalPercent = useMemo(() => {
        return Math.round((progress / totalProgress) * 100);
    }, [progress, totalProgress]);

    const adjustedPercent = useMemo(() => {
        return Math.round((adjustedProgress / totalProgress) * 100);
    }, [adjustedProgress, totalProgress]);

    useEffect(() => {
        const updateProgress = async () => {
            // 1. 先检查待处理状态
            const newAdjustedProgress = hasPending ? Math.max(0, progress - 1) : progress;

            // 2. 更新状态
            setAdjustedProgress(newAdjustedProgress);

            // 清除之前的 interval
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }

            // 开始新的进度动画
            if (currentProgress < newAdjustedProgress) {
                intervalRef.current = setInterval(() => {
                    setCurrentProgress(prev => {
                        if (prev < newAdjustedProgress) {
                            return prev + 1;
                        }
                        clearInterval(intervalRef.current);
                        return prev;
                    });
                }, 10);
            } else {
                setCurrentProgress(newAdjustedProgress);
            }
        };

        updateProgress();

        // 清理函数
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [progress, totalProgress]);

    return (
        <div className={styles.progressContainer}>
            <div className={styles.progressTitle}>
                Itineraries In Progress
            </div>
            <div className={styles.progressInfo}>
                <span className={styles.progressPercentage}>{adjustedPercent}% completed</span>
                <div className={styles.progressQuantity}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M6 11.375C3.035 11.375 0.625 8.965 0.625 6C0.625 3.035 3.035 0.625 6 0.625C8.965 0.625 11.375 3.035 11.375 6C11.375 8.965 8.965 11.375 6 11.375ZM6 1.375C3.45 1.375 1.375 3.45 1.375 6C1.375 8.55 3.45 10.625 6 10.625C8.55 10.625 10.625 8.55 10.625 6C10.625 3.45 8.55 1.375 6 1.375Z" fill="#444444" />
                        <path d="M7.85482 7.965C7.78982 7.965 7.72482 7.95 7.66482 7.91L6.11482 6.985C5.72982 6.755 5.44482 6.25 5.44482 5.805V3.755C5.44482 3.55 5.61482 3.38 5.81982 3.38C6.02482 3.38 6.19482 3.55 6.19482 3.755V5.805C6.19482 5.985 6.34482 6.25 6.49982 6.34L8.04982 7.265C8.22982 7.37 8.28482 7.6 8.17982 7.78C8.10482 7.9 7.97982 7.965 7.85482 7.965Z" fill="#444444" />
                    </svg>
                    <span>{progress}/{totalProgress} Quantity</span>
                </div>
            </div>
            <div className={styles.progressBarBackground}>
                {/* 当没有 pending 时，原始进度条使用 progress-bar 样式 */}
                <div className={hasPending ? styles.progressBar1 : styles.progressBar} style={{ width: `${originalPercent}%` }} />
                {/* 只有当有 pending 时才显示调整后的进度条 */}
                {hasPending && (
                    <div className={styles.progressBar} style={{ width: `${adjustedPercent}%` }} />
                )}
            </div>
        </div >
    );
};

export default ProgressBar;