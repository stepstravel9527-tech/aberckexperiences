"use client"

import styles from './Section2.module.scss';
import React from 'react';

const Section2 = () => {
    return (
        <section className={styles.section2}>
            <div className={styles.title}>
                Middle East: Abercrombie & Kent is monitoring the situation in the Middle East and reviewing all potentially impacted travel itineraries in departure date order. Our team will be in contact with anyone whose travel plans might be impacted.
            </div>
            <div className={styles.desc}>
                For more than 60 years we have been spinning dreams into out-of-this-world experiences for discerning travellers. We believe every journey should be extraordinary; every Life, Well-Travelled.
            </div>
        </section>
    )
}

export default Section2