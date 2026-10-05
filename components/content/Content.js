"use client";

import NavigationBar from '@/components/layout/NavigationBar'
import styles from './Content.module.scss'

const Content = ({ title, description }) => {
    return (
        <>
            <NavigationBar title={title} />
            <div className={styles.contentSection}>
                <div dangerouslySetInnerHTML={{ __html: description }}></div>
            </div>
        </>
    )
}

export default Content