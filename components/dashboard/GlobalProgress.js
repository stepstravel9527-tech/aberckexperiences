import React from 'react'
import styles from './GlobalProgress.module.scss'

const GlobalProgress = () => {
    return (
        <div className={styles.globalProgress}>
            <i className="fa fa-circle-notch rotating-spinner"></i>
        </div>
    )
}

export default GlobalProgress