"use client";

import NavigationBar from '@/components/layout/NavigationBar'
import Image from 'next/image';
import React, { useEffect, useState, useRef } from 'react';
import bg_game_top from "@/public/images/games/bg_game_top.png";
import bg_cell from "@/public/images/games/bg_cell.png";
import btn_go from "@/public/images/games/btn_go.png";
import { updateLuckyDraw } from '@/app/actions/user/action';
import { useRouter } from 'next/navigation';
import ToastManager from '@/utils/toastManager';
import styles from './LuckySpin.module.scss';

const LuckySpin = ({ user }) => {

    const router = useRouter();
    const animationRef = useRef(null); // 动画定时器引用

    const [winAmount, setWinAmount] = useState(0); // 用户中奖金额
    const [gameDatas, setGameDatas] = useState([]); // 游戏数据映射 {位置: 数据}
    const [isLoading, setIsLoading] = useState(false); // 游戏进行中状态
    const [isAnimation, setIsAnimation] = useState(false); // 重置动画显示状态
    const [gameState, setGameState] = useState('idle'); // 游戏状态: 'idle' | 'playing' | 'completed'
    const [currentAnimationIndex, setCurrentAnimationIndex] = useState(-1); // 当前高亮的单元格位置
    const [resetProgress, setResetProgress] = useState(0); // 重置进度百分比
    const [remainingDraws, setRemainingDraws] = useState(0); // 剩余抽奖次数

    // 默认奖品数据配置
    const defaultDatas = [
        { id: 1, price: "5,000" },
        { id: 2, price: "1,300" },
        { id: 3, price: "400" },
        { id: 4, price: "200" },
        { id: 5, price: "100" },
        { id: 6, price: "50" },
        { id: 7, price: "20" },
        { id: 8, price: "10" }
    ];

    // 九宫格位置顺时针顺序（跳过中心位置4）
    // 位置图：
    // 0(上左) 1(上中) 2(上右)
    // 3(中左) 4(按钮) 5(中右)
    // 6(下左) 7(下中) 8(下右)
    const clockwiseOrder = [0, 1, 2, 5, 8, 7, 6, 3];

    // 创建位置到数据的映射对象
    const createPositionDataMap = (shuffledData) => {
        const positionDataMap = {};
        // 将打乱后的数据按顺时针顺序分配到各个位置
        clockwiseOrder.forEach((position, index) => {
            positionDataMap[position] = {
                ...shuffledData[index], // 对应位置的奖品数据
                path: bg_cell, // 单元格背景图片
                cracked: false, // 是否已翻开（显示金额）
                isWinner: false // 是否为中奖单元格
            };
        });
        return positionDataMap;
    };

    // 打乱数据并初始化游戏状态
    const shuffleData = () => {
        // 随机打乱默认数据数组
        const shuffledDatas = [...defaultDatas].sort(() => Math.random() - 0.5);
        // 创建位置映射并设置到状态
        const positionDataMap = createPositionDataMap(shuffledDatas);
        setGameDatas(positionDataMap);
    };

    // 开始游戏主函数
    const startGame = async () => {
        // 防止重复点击
        if (isLoading) return;

        // 开始前检查剩余次数
        if (remainingDraws <= 0) {
            ToastManager.error("No remaining chance available");
            return;
        }

        // 如果游戏已完成，点击按钮重新开始
        if (gameState === 'completed') {
            resetGame();
            return;
        }

        // 设置游戏进行中状态
        setIsLoading(true);
        setGameState('playing');
        setCurrentAnimationIndex(-1); // 重置动画高亮

        try {
            // 调用API更新抽奖记录
            const res = await updateLuckyDraw(winAmount);

            if (res.status === 201) {
                // 立即更新剩余抽奖次数（减1）
                setRemainingDraws(prev => Math.max(0, prev - 1));
                // 随机选择中奖ID（1-8）
                const randomId = Math.floor(Math.random() * defaultDatas.length) + 1;
                // 开始旋转动画
                startSpinAnimation(randomId);
            } else {
                // API调用失败处理
                ToastManager.error(res.message);
                setIsLoading(false);
                setGameState('idle');
                router.refresh();
            }
        } catch (err) {
            console.log(err);
            // 异常处理
            setIsLoading(false);
            setGameState('idle');
        }
    };

    // 开始旋转动画
    const startSpinAnimation = (winningId) => {
        // 清除之前的动画定时器
        if (animationRef.current) {
            clearTimeout(animationRef.current);
        }

        // 找到中奖数据在顺时针顺序中的索引
        const winningDataIndex = clockwiseOrder.findIndex(position =>
            gameDatas[position]?.id === winningId
        );

        // 中奖数据查找失败处理
        if (winningDataIndex === -1) {
            setIsLoading(false);
            setGameState('idle');
            return;
        }

        const winningPosition = clockwiseOrder[winningDataIndex]; // 中奖位置

        // 随机偏移0-7格，增加动画随机性
        const randomOffset = Math.floor(Math.random() * clockwiseOrder.length);
        const totalSteps = clockwiseOrder.length * 3 + randomOffset; // 总步数 = 3圈(24步) + 偏移量

        // 计算起始位置：通过数学计算确保最终准确停在中奖位置
        // 公式: (中奖索引 - 偏移量 + 数组长度) % 数组长度
        const startIndexInOrder = (winningDataIndex - randomOffset + clockwiseOrder.length) % clockwiseOrder.length;
        const startPosition = clockwiseOrder[startIndexInOrder]; // 实际起始位置

        let currentStep = 0; // 当前动画步数
        const interval = 120; // 动画间隔(毫秒)

        // 动画执行函数
        const animate = () => {
            if (currentStep <= totalSteps) {
                // 计算当前应该高亮的单元格位置
                const currentIndexInOrder = (startIndexInOrder + currentStep) % clockwiseOrder.length;
                const cellIndex = clockwiseOrder[currentIndexInOrder];
                setCurrentAnimationIndex(cellIndex); // 更新高亮位置
                currentStep++;
                // 设置下一帧动画
                animationRef.current = setTimeout(animate, interval);
            } else {
                // 动画结束，确保停在正确的中奖位置
                setCurrentAnimationIndex(winningPosition);
                // 显示最终结果
                showFinalResult(winningPosition);
            }
        };

        // 设置起始位置并开始动画
        setCurrentAnimationIndex(startPosition);
        setTimeout(animate, 100); // 延迟100ms开始动画，确保UI更新
    };

    // 显示最终游戏结果
    const showFinalResult = (winningPosition) => {
        // 更新所有单元格状态：全部翻开，标记中奖单元格
        setGameDatas(prevData => {
            const newData = { ...prevData };
            Object.keys(newData).forEach(position => {
                newData[position] = {
                    ...newData[position],
                    cracked: true, // 所有单元格都显示金额
                    isWinner: parseInt(position) === winningPosition // 标记中奖单元格
                };
            });
            return newData;
        });

        // 更新游戏状态
        setGameState('completed');
        setIsLoading(false);
        setCurrentAnimationIndex(-1); // 清除动画高亮
    };

    // 重置游戏 - 优化版本
    const resetGame = () => {
        // 清除动画定时器
        if (animationRef.current) {
            clearTimeout(animationRef.current);
        }

        // 显示重置加载动画
        setIsAnimation(true);
        setResetProgress(0); // 重置进度从0开始

        // 分阶段重置，提供更流畅的体验
        const resetStages = [
            // 第一阶段：快速重置UI状态（0-200ms）
            () => {
                setGameState('idle');
                setCurrentAnimationIndex(-1);
                setResetProgress(30);
            },
            // 第二阶段：重置数据和金额（200-400ms）
            () => {
                // setWinAmount(0);
                // shuffleData(); // 重新打乱数据
                setResetProgress(60);
            },
            // 第三阶段：准备完成（400-600ms）
            () => {
                setIsLoading(false);
                setResetProgress(90);
            },
            // 第四阶段：完成重置（600-800ms）
            () => {
                setResetProgress(100);
                // 延迟隐藏加载动画，让用户看到完成状态
                setTimeout(() => {
                    setIsAnimation(false);
                    setResetProgress(0); // 重置进度条
                }, 300);
            }
        ];

        // 分阶段执行重置
        resetStages.forEach((stage, index) => {
            setTimeout(stage, index * 200);
        });

        // 刷新页面数据
        router.refresh();
    };

    // 组件初始化
    useEffect(() => {
        shuffleData(); // 初始数据打乱
        setRemainingDraws(user.number_of_draws);

        // 设置用户中奖金额
        if (Array.isArray(user.winning_amount) && user.winning_amount.length !== 0) {
            console.log(user.winning_amount);
            setWinAmount(user.winning_amount[0] === 0 ? -1 : user.winning_amount[0]);
        } else {
            setWinAmount(0);
        }

        // 组件卸载时清理定时器
        return () => {
            if (animationRef.current) {
                clearTimeout(animationRef.current);
            }
        };
    }, [user]);

    // 渲染九宫格布局
    const renderGridCell = () => {
        const grid = [];

        // 遍历3x3网格
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                const position = row * 3 + col; // 计算单元格位置(0-8)

                // 中心位置(4)渲染开始按钮
                if (position === 4) {
                    const buttonText = gameState === 'completed' ? "RESET" : "GO"; // 按钮文本
                    const isDisabled = isLoading || remainingDraws <= 0; // 加载中或无剩余次数时禁用
                    grid.push(
                        <div
                            key="button"
                            className={`${styles.startButton} ${isDisabled ? styles.disabled : ''}`}
                            onClick={startGame}
                        >
                            <Image
                                src={btn_go}
                                alt="start_button"
                                height={100}
                                width={100}
                                unoptimized
                            />
                            <span className={styles.buttonText}>{buttonText}</span>
                        </div>
                    );
                } else {
                    // 其他位置渲染游戏单元格
                    const data = gameDatas[position];
                    if (data) {
                        const isAnimating = gameState === 'playing' && currentAnimationIndex === position; // 是否正在动画中
                        const isWinnerCell = gameState === 'completed' && data.isWinner; // 是否为中奖单元格

                        grid.push(
                            <div
                                key={data.id}
                                className={`${styles.gameCell} ${isWinnerCell ? styles.winnercss : ""} ${isAnimating ? styles.crackAnimation : ''}`}
                            >
                                {/* 显示金额：中奖单元格显示中奖金额，其他显示奖品金额 */}
                                {data.cracked && (
                                    <p className={styles.cellText}>
                                        ${data.isWinner ? Math.max(winAmount, 0) : data.price}
                                    </p>
                                )}
                                <Image
                                    src={data.path}
                                    alt={`cell_${data.id}`}
                                    height={100}
                                    width={100}
                                    unoptimized
                                />
                            </div>
                        );
                    }
                }
            }
        }
        return grid;
    };

    return (
        <>
            {/* 重置游戏时的加载动画 - 增强版本 */}
            {isAnimation && (
                <div className={styles.resetOverlay}>
                    {/* <LogoLoader /> */}
                    <div className={styles.resetProgress}>
                        <div className={styles.progressBar}>
                            <div
                                className={styles.progressFill}
                                style={{ width: `${resetProgress}%` }}
                            ></div>
                        </div>
                        <p className={styles.resetText}>
                            {resetProgress < 100 ? 'Resetting Game...' : 'Ready!'}
                        </p>
                    </div>
                </div>
            )}

            <section className={styles.luckySpinSection}>
                <NavigationBar title="Lucky Spin" />

                {/* 顶部背景图片 */}
                <div className={styles.topImageWrapper}>
                    <Image
                        src={bg_game_top}
                        alt="bg_game_top"
                        height={100}
                        width={100}
                        unoptimized
                    />
                </div>

                {/* 游戏规则说明 */}
                <div className={styles.rulesWrapper}>
                    <h1>CELEBRATION PRIZE DRAW RULES</h1>
                    <p>1. Each time you receive a reward, your chances of winning will increase.</p>
                    <p>2. Prize money will be credited directly to the account balance.</p>
                    <p>3. Your odds of winning improve as you progress through higher levels.</p>
                    <p>4. Prize money can be withdrawn along with your account balance and rewards after completing the required membership task.</p>
                    <h2>Remaining Chance: {remainingDraws}</h2> {/* 显示剩余抽奖次数 */}
                </div>

                {/* 游戏主区域 */}
                <div className={styles.gameSection}>
                    <div className={styles.gameBoard}>
                        <div className={styles.gameGrid}>
                            {renderGridCell()} {/* 渲染九宫格 */}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default LuckySpin;