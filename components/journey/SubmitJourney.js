"use client";

import styles from './SubmitJourney.module.scss'
import NavigationBar from '@/components/layout/NavigationBar'
import { useRouter } from "next/navigation";
import { submitJourney } from '@/app/actions/journey/action';
import { useEffect, useState } from "react";
import { fetchProduct } from "@/app/actions/journey/data";
import LogoLoader from "../ui/LogoLoader";
import Image from 'next/image';
import icon_commission from "@/public/images/journey/icon_commission.png";
import SuccessModal from '@/components/ui/modals/SuccessModal';
import ToastManager from '@/utils/toastManager';
import { review } from '@/components/journey/review.config';
import PrimaryButton from '@/components/ui/PrimaryButton';
import icon_rebates from "@/public/images/journey/icon_rebates.png";
import { formatPrice } from '@/utils/validateForm';

const SubmitJourney = () => {

    const { push } = useRouter();

    const [isSuccess, setIsSuccess] = useState(false);
    const [order, setOrder] = useState({});
    const [loading, setLoading] = useState(false);
    const [isNextData, setIsNextData] = useState(false);

    const [isReview, setIsReview] = useState({
        isShow: false,
        reviewValue: ""
    });

    const setReviewFunc = (value) => {
        setIsReview({
            isShow: false,
            reviewValue: value
        });
    }

    const [rating, setRating] = useState(5);

    const handleClick = (index) => {
        setRating(index + 1);
    };

    const handleForm = async () => {
        try {
            const response = await submitJourney();

            if (response.status === 201) {
                if (response?.isNextJourney) {
                    setIsNextData(true);
                    setTimeout(() => {
                        window.location.reload();
                    }, 3000)
                } else {
                    setIsSuccess(true);
                    setTimeout(() => {
                        push("/journey");
                    }, 2000)
                }
            } else {
                ToastManager.error(response.message);
                push("/recharge");
            }

        } catch (error) {
            console.log(error)
        }
    }

    const handleProduct = async () => {
        setLoading(true);
        try {
            const response = await fetchProduct();
            setOrder(response.data);
            setLoading(false);

        } catch (error) {
            setLoading(false);
            console.log(error)
        }
    }

    useEffect(() => {
        handleProduct();
    }, []);

    const handleBackClick = () => {
        push("/journey");
    }

    return (
        <>
            {isSuccess && (

                <SuccessModal
                    title="SUCCESSFUL"
                    subTitle="The itinerary flow has been successfully processed"
                    category="journeySuccess"
                    setIsModal={setIsSuccess}
                />
            )}
            {loading && (
                <LogoLoader />
            )}
            {isNextData && (
                <div className={styles.fetchNextData}>
                    <h3>
                        Itinerary flow acquisition in progress
                        <i className="fa fa-circle-notch rotating-spinner"></i>
                    </h3>
                </div>
            )}
            <section className={styles.submitJourneySection}>
                <header className={styles.productImageHeader}>
                    {order.product?.url && (
                        <Image
                            src={order.product?.url}
                            height={100}
                            width={100}
                            alt="product"
                            unoptimized
                            className={styles.productImage}
                        />
                    )}
                    <div className={styles.navigationOverlay}>
                        <NavigationBar
                            onLeftClick={handleBackClick}
                            backgroundColor="transparent"
                            whiteTheme={true}
                        />
                    </div>
                </header>
                <main className={styles.productInfoContent}>
                    <div className={styles.productName}>
                        {order.product?.productName}
                    </div>
                    <div className={styles.productInfoGrid}>
                        <div className={styles.priceRow}>
                            <p className={styles.key}>Price</p>
                            <p className={styles.value}>{formatPrice(order.totalValue)} <span>USD</span></p>
                        </div>
                        <div className={styles.commissionsRow}>
                            <Image
                                src={icon_commission}
                                alt="Commission"
                                height={100}
                                width={100}
                            />
                            <p className={styles.key}>Commissions</p>
                            <p className={styles.value}><span>USD</span> {formatPrice(order.commission)}</p>
                        </div>
                    </div>
                    {/* 评分 */}
                    <div className={styles.ratingSection}>
                        <div className={styles.ratingTitle}>
                            Rating
                        </div>
                        <ul>
                            {Array.from({ length: 5 }, (v, i) => (
                                <li key={i} onClick={() => handleClick(i)}>
                                    <i className={`fa fa-star ${i < rating ? styles.active : ''}`}></i>
                                </li>
                            ))}
                        </ul>
                    </div>
                    {/* 评论 */}
                    <div className={styles.commentSection}>
                        <div className={styles.commentTitle}>Comment</div>
                        <div className={styles.commentSelector} onClick={() => setIsReview(prev => ({ ...prev, isShow: !prev.isShow }))}>
                            <p>
                                {
                                    isReview.reviewValue === ""
                                        ? "Please select an option to comment"
                                        : isReview.reviewValue
                                }
                            </p>
                            <i className="fa fa-angle-down"></i>
                        </div>
                    </div>
                    {isReview.isShow && (
                        <div className={styles.reviewsListWrapper} onClick={() => setIsReview(prev => ({ ...prev, isShow: !prev.isShow }))}>
                            <div className={`${styles.reviewsList} ${styles.fadeUpAnimation}`} onClick={(e) => e.stopPropagation()}>
                                {review?.map((data, index) => (
                                    <li key={index} onClick={() => setReviewFunc(data?.data)}>
                                        {data?.data}
                                    </li>
                                ))}
                                <div className={styles.reviewCloseBtn}>
                                    <button onClick={() => setIsReview(prev => ({ ...prev, isShow: !prev.isShow }))}>
                                        CLOSE
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    <form action={handleForm}>
                        <div className={styles.buttonWraper}>
                            <PrimaryButton
                                defaultText="Submit"
                                disabled={!order.product?.url}
                                pendingText="Processing Please Wait"
                            />
                        </div>
                    </form>
                </main>
            </section>
        </>
    )
}

export default SubmitJourney;