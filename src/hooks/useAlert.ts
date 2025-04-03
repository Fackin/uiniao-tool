// composables/useAlert.js
import { reactive } from "vue";

// 定义 Alert 类型
export interface Alert {
    id: number;
    message: string;
    type: "success" | "error" | "warning" | "info";
}

const alerts = reactive<Alert[]>([]);

export function useAlert() {
    const showAlert = (message: string, type: Alert["type"] = "info", duration: number = 3000) => {
        const id = Date.now(); // 唯一 ID
        alerts.push({ id, message, type });

        if (duration > 0) {
            setTimeout(() => {
                removeAlert(id);
            }, duration);
        }
    };

    const removeAlert = (id: number) => {
        const index = alerts.findIndex((alert) => alert.id === id);
        if (index !== -1) alerts.splice(index, 1);
    };

    return { alerts, showAlert, removeAlert };
}
