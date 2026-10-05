import React from 'react';
import styles from './HistoryFilter.module.scss';

const HistoryFilter = ({ statusType, onFilterChange, filters }) => {
    const defaultFilters = [
        { key: 'all', label: 'All' },
        { key: 'pending', label: 'Pending' },
        { key: 'completed', label: 'Completed' },
        // { key: 'freezed', label: 'On Hold' }
    ];

    const filterItems = filters || defaultFilters;

    return (
        <div className={styles.historyFilter}>
            <div className={styles.radioGroup}>
                {filterItems.map((filter) => (
                    <div
                        key={filter.key}
                        className={`${styles.radioItem} ${statusType === filter.key ? styles.active : undefined}`}
                        onClick={() => onFilterChange(filter.key)}
                    >
                        <span>{filter.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HistoryFilter;