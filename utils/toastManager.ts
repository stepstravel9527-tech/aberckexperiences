// utils/toastManager.ts
import { toast } from 'react-hot-toast';

class ToastManager {
    // 成功提示
    static success(message: string, duration = 3000) {
        toast.success(message, { duration });
    }

    // 错误提示
    static error(message: string, duration = 5000) {
        toast.error(message, { duration });
    }

    // 警告提示
    static warning(message: string, duration = 4000) {
        toast(message, {
            duration,
            icon: '⚠️'
        });
    }

    // 信息提示
    static info(message: string, duration = 4000) {
        toast(message, {
            duration,
            icon: 'ℹ️'
        });
    }

    // 加载中
    static loading(message: string) {
        return toast.loading(message);
    }

    // Promise 操作
    static async promise<T>(
        promise: Promise<T>,
        messages: {
            loading: string;
            success: string;
            error: string;
        }
    ): Promise<T> {
        return toast.promise(promise, messages);
    }

    // 关闭特定 Toast
    static dismiss(toastId?: string) {
        toast.dismiss(toastId);
    }

    // 关闭所有 Toast
    static clear() {
        toast.dismiss();
    }
}

export default ToastManager;