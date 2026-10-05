"use client";

import styles from './Dashboard.module.scss'
import NavigationBar from '@/components/layout/NavigationBar'
import { useState } from 'react';
import logo from "@/public/logo/color_logo.png";
import icon_right_side from "@/public/icons/icon_right_side.svg";
import dynamic from "next/dynamic";
import GlobalProgress from "@/components/dashboard/GlobalProgress";

import RunningNotice from '@/components/dashboard/RunningNotice';
import TopVideo from '@/components/dashboard/TopVideo';
// import Section1 from '@/components/dashboard/section/Section1';
import Section2 from '@/components/dashboard/section/Section2';
// import Section3 from '@/components/dashboard/section/Section3';
const Section3 = dynamic(() => import("@/components/dashboard/section/Section3"), {
    loading: () => <GlobalProgress />
});
const Section4 = dynamic(() => import("@/components/dashboard/section/Section4"), {
    loading: () => <GlobalProgress />
});
import Section5 from '@/components/dashboard/section/Section5';
import Section6 from '@/components/dashboard/section/Section6';
// import WhyChoose from '@/components/dashboard/WhyChoose';


const SidebarLeft = dynamic(() => import("@/components/dashboard/sidebar/Sidebar"), {
    loading: () => <GlobalProgress />
});
const SidebarRight = dynamic(() => import("@/components/dashboard/sidebar/Sidebar"), {
    loading: () => <GlobalProgress />
});

// const Luxury = dynamic(() => import("@/components/dashboard/Luxury"), {
//     loading: () => <GlobalProgress />
// });
// const TrendingDeals = dynamic(() => import("@/components/dashboard/TrendingDeals"), {
//     loading: () => <GlobalProgress />
// });
// const Partners = dynamic(() => import("@/components/dashboard/Partners"), {
//     loading: () => <GlobalProgress />
// });

const Dashboard = ({ authenticatedUser, allCommission, pop, notice }) => {
    const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
    const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);

    return (
        <section className={styles.dashboardSection}>
            <NavigationBar
                // showBackButton={false}//取消左侧点击事件
                onLeftClick={() => (setIsLeftSidebarOpen(true))}
                leftIcon={icon_right_side}
                title='ABERCROMBIE & KENT'
                // onCenterClick={() => setIsRightSidebarOpen(true)}
                rightIcon={icon_right_side}
                onRightClick={() => setIsRightSidebarOpen(true)}
                // backgroundColor="transparent"
                // whiteTheme={true}
                // isDashboard={true}
            />

            <SidebarLeft
                isOpen={isLeftSidebarOpen}
                onClose={() => setIsLeftSidebarOpen(false)}
                isLeft={true}
            />

            <SidebarRight
                isOpen={isRightSidebarOpen}
                onClose={() => setIsRightSidebarOpen(false)}
                isLeft={false}
                authenticatedUser={authenticatedUser}
                allCommission={allCommission}
                pop={pop}
            />
            {/* <RunningNotice notice={notice} /> */}
            <TopVideo />
            {/* <Section1 /> */}
            <Section2 />
            {/* <BrandSlider /> */}
            <Section3 />
            <Section4 />
            <Section5 />
            <Section6 />
            {/* <Luxury /> */}
            {/* <TrendingDeals /> */}
            {/* <Partners /> */}
        </section>
    )
}

export default Dashboard