// components/AppToaster.js
'use client';

import { Toaster } from 'react-hot-toast';

const AppToaster = () => {
    return (
        <Toaster
            position="top-center"
            toastOptions={{
                className: 'toast',
                duration: 4000,
                success: {
                    className: 'toast success',
                    duration: 3000,
                },
                error: {
                    className: 'toast error',
                    duration: 5000,
                },
                loading: {
                    className: 'toast loading',
                },
                info: {
                    className: 'toast info',
                    duration: 4000,
                },
                warning: {
                    className: 'toast warning',
                    duration: 4000,
                },
                // 自定义和其他类型使用基础样式
                custom: {
                    className: 'toast',
                }
            }}
        />
    );
};

export default AppToaster;