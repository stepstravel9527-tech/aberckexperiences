"use client";

import { useRouter } from 'next/navigation';
import { validateStartJourney } from "@/app/actions/journey/action";
import { useEffect, useState } from "react";
import FailModal from '@/components/ui/modals/FailModal';
import ToastManager from '@/utils/toastManager';
import PrimaryButton from '@/components/ui/PrimaryButton';

const ValidateJourney = ({ allowRobOrder }) => {
    const { push, refresh } = useRouter();
    const [resData, setResponseData] = useState(false);
    const [modalState, setModalState] = useState({
        isInsufficient: false,
        isCompleted: false,
        isPending: false,
        isDisabledRob: false
    });

    const handleForm = async () => {
        try {
            const response = await validateStartJourney();
            setResponseData(response);

            const statusHandlers = {
                201: () => push("/journey/submit"),
                101: () => {
                    setModalState(prev => ({ ...prev, isPending: true }));
                    //setTimeout(() => push("/journey/history"), 2000);
                },
                404: () => setModalState(prev => ({ ...prev, isInsufficient: true })),
                403: () => setModalState(prev => ({ ...prev, isDisabledRob: true })),
                200: () => setModalState(prev => ({ ...prev, isCompleted: true }))
            };

            if (statusHandlers[response.status]) {
                statusHandlers[response.status]();
            } else {
                ToastManager.error(response.message);
            }

        } catch (error) {
            console.log(error);
        }
    }

    // useEffect(() => {
    //     refresh();
    // }, []);

    const closeModal = (modalKey) => {
        setModalState(prev => ({ ...prev, [modalKey]: false }));
    };

    const modalConfigs = [
        {
            key: 'isPending',
            title: "",
            subTitle: "Please submit the pending itinerary flow before proceeding with the next one",
            category: "pendingOrder"
        },
        {
            key: 'isCompleted',
            title: "",
            subTitle: "You have reached the maximum quantity for your current membership level",
            category: "journeyCompleted"
        },
        {
            key: 'isInsufficient',
            title: "",
            subTitle: "You have insufficient balance",
            category: "nobalance"
        },
        {
            key: 'isDisabledRob',
            title: "",
            subTitle: "Can not place your order at this time",
            category: "isDisabledRob",
            resData
        }
    ];

    return (
        <>
            {modalConfigs.map(({ key, title, subTitle, category, resData: modalResData }) =>
                modalState[key] && (
                    <FailModal
                        key={key}
                        title={title}
                        subTitle={subTitle}
                        setIsModal={() => closeModal(key)}
                        category={category}
                        resData={modalResData}
                    />
                )
            )}

            <form action={handleForm}>
                <PrimaryButton
                    defaultText="Reservation"
                    disabled={!allowRobOrder}
                    className="primaryButton"
                    pendingText="Processing"
                />
            </form>
        </>
    )
}

export default ValidateJourney