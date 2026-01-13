import React, { useEffect, useState } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import type { Notification } from '../types';

interface ToastProps {
  notification: Notification;
  onClose: () => void;
  duration: number;
}

function Toast({ notification, onClose, duration }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const typeStyles: Record<string, React.CSSProperties> = {
    info: { backgroundColor: '#3b82f6', color: 'white' },
    success: { backgroundColor: '#22c55e', color: 'white' },
    warning: { backgroundColor: '#f59e0b', color: 'white' },
    error: { backgroundColor: '#ef4444', color: 'white' },
  };

  return (
    <div
      style={{
        padding: '12px 16px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        marginBottom: '8px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        maxWidth: '350px',
        animation: 'slideIn 0.3s ease-out',
        ...typeStyles[notification.type],
      }}
    >
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, marginBottom: '4px' }}>
          {notification.title}
        </div>
        <div style={{ fontSize: '14px', opacity: 0.9 }}>
          {notification.body}
        </div>
        {notification.action && (
          <a
            href={notification.action.url}
            style={{
              marginTop: '8px',
              display: 'inline-block',
              color: 'inherit',
              textDecoration: 'underline',
            }}
          >
            {notification.action.text}
          </a>
        )}
      </div>
      <button
        onClick={onClose}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'inherit',
          cursor: 'pointer',
          fontSize: '18px',
          lineHeight: 1,
          opacity: 0.7,
        }}
      >
        ×
      </button>
    </div>
  );
}

interface NotificationToastProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  duration?: number;
  maxToasts?: number;
  channel?: string;
}

export function NotificationToast({
  position = 'top-right',
  duration = 5000,
  maxToasts = 5,
  channel,
}: NotificationToastProps) {
  const [toasts, setToasts] = useState<Notification[]>([]);

  useNotifications({
    channel,
    maxItems: maxToasts,
    onNotification: (notification) => {
      setToasts((prev) => [notification, ...prev].slice(0, maxToasts));
    },
  });

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const positionStyles: Record<string, React.CSSProperties> = {
    'top-right': { top: '20px', right: '20px' },
    'top-left': { top: '20px', left: '20px' },
    'bottom-right': { bottom: '20px', right: '20px' },
    'bottom-left': { bottom: '20px', left: '20px' },
    'top-center': { top: '20px', left: '50%', transform: 'translateX(-50%)' },
    'bottom-center': { bottom: '20px', left: '50%', transform: 'translateX(-50%)' },
  };

  if (toasts.length === 0) {
    return null;
  }

  return (
    <>
      <style>
        {`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(100%);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
        `}
      </style>
      <div
        style={{
          position: 'fixed',
          zIndex: 9999,
          ...positionStyles[position],
        }}
      >
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            notification={toast}
            onClose={() => removeToast(toast.id)}
            duration={duration}
          />
        ))}
      </div>
    </>
  );
}
