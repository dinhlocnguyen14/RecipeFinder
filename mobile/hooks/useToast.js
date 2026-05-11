import { useState, useCallback } from "react";

/**
 * Hook để dùng Toast thân thiện thay cho Alert.alert()
 *
 * Cách dùng:
 *   const { toast, showToast, ToastComponent } = useToast();
 *   showToast("Đăng nhập thất bại", "error");
 *   // Trong JSX: {ToastComponent}
 */

import Toast from "../components/Toast";

export const useToast = () => {
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "error", // "error" | "success" | "warning" | "info"
  });

  const showToast = useCallback((message, type = "error") => {
    setToast({ visible: true, message, type });
  }, []);

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, visible: false }));
  }, []);

  const ToastComponent = (
    <Toast
      visible={toast.visible}
      message={toast.message}
      type={toast.type}
      onHide={hideToast}
    />
  );

  return { toast, showToast, hideToast, ToastComponent };
};
