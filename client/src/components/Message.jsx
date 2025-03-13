"use client";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Message.css"; // Import custom styles

export const showToast = (message, type = "info") => {
  const toastClasses = {
    success: {
      container: "toast-success",
      progress: "progress-success",
      icon: "✅",
    },
    error: {
      container: "toast-error",
      progress: "progress-error",
      icon: "❌",
    },
    info: {
      container: "toast-info",
      progress: "progress-info",
      icon: "ℹ️",
    },
    warning: {
      container: "toast-warning",
      progress: "progress-warning",
      icon: "⚠️",
    },
    default: {
      container: "toast-default",
      progress: "progress-default",
      icon: "🔔",
    },
  };

  const { container, progress, icon } = toastClasses[type] || toastClasses.default;

  toast(
    <div className="toast-content">
      <span className="toast-icon">{icon}</span>
      <span>{message}</span>
    </div>,
    {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      className: container,
      progressClassName: progress,
      closeButton: (
        <button className="toast-close" onClick={() => toast.dismiss()}>✕</button>
      ),
    }
  );
};

export const Notification = () => <ToastContainer />;
