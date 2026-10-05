import React from 'react';
import styles from './QuickAction.module.scss';

const QuickAction = ({ activeIndex, onAmountSelect }) => {
    
    const amounts = [
            { value: "$ 50.00", numericValue: 50 },
            { value: "$ 100.00", numericValue: 100 },
            { value: "$ 300.00", numericValue: 300 },
            { value: "$ 1000.00", numericValue: 1000 },
            { value: "$ 3000.00", numericValue: 3000 },
            { value: "Others", numericValue: 0 }
        ];
    const handleClick = (index, numericValue) => {
        onAmountSelect(index, numericValue);
    };

    return (
        <div className={styles.amountOptions}>
            <div className={styles.quickChoice}>
                <div className={styles.quickChoiceLine}></div>
                <div className={styles.quickChoiceWrapper}>
                    <h3>OR QUICK ACTION</h3>
                </div>
            </div>
            <div className={styles.amountOptionParent}>
                {amounts.map((amount, index) => (
                    <div
                        className={`${styles.amountOptionChilds} ${activeIndex === index ? styles.activeDepositBtn : undefined}`}
                        key={index}
                        onClick={() => handleClick(index, amount.numericValue)}
                    >
                        <h3>{amount.value}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QuickAction;