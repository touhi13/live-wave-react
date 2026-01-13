import { useCallback, useEffect, useState } from 'react';
import { useLiveWave } from './useLiveWave';
import type { Notification, NotificationOptions } from '../types';

interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  remove: (id: string) => void;
}

export function useNotifications(
  options: NotificationOptions = {}
): UseNotificationsReturn {
  const { maxItems = 50, channel: customChannel, onNotification } = options;
  const { echo, isConnected } = useLiveWave();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const addNotification = useCallback(
    (data: Omit<Notification, 'read' | 'createdAt'>) => {
      const notification: Notification = {
        ...data,
        read: false,
        createdAt: new Date(),
      };

      setNotifications((prev) => {
        const updated = [notification, ...prev];
        return updated.slice(0, maxItems);
      });

      onNotification?.(notification);
    },
    [maxItems, onNotification]
  );

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const remove = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  useEffect(() => {
    if (!echo || !isConnected) {
      return;
    }

    const channelName = customChannel || 'notifications';
    const channel = echo.private(channelName);

    channel.listen('.notification.created', (data: any) => {
      addNotification({
        id: data.id || crypto.randomUUID(),
        title: data.title,
        body: data.body,
        type: data.type || 'info',
        data: data.data,
        action: data.action,
      });
    });

    return () => {
      echo.leave(`private-${channelName}`);
    };
  }, [echo, isConnected, customChannel, addNotification]);

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearAll,
    remove,
  };
}
