import React, { createContext, useContext, useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useAuth } from "./AuthContext";
import { Notification } from "../types";
import notificationService from "../services/notificationService";

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  fetchAllNotifications: () => Promise<void>;
  fetchUnreadNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { state } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stompClient, setStompClient] = useState<Client | null>(null);

  const fetchUnreadNotifications = async () => {
    if (!state.user?.id) return;
    try {
      const response = await notificationService.getUnreadNotifications(
        state.user.id
      );
      if (response.statusCode === "S200" && response.data) {
        setNotifications(response.data);
      }
    } catch (error) {
      console.error("Error fetching unread notifications:", error);
    }
  };

  const fetchAllNotifications = async () => {
    if (!state.user?.id) return;
    try {
      const response = await notificationService.getAllNotifications(
        state.user.id
      );
      if (response.statusCode === "S200" && response.data) {
        setNotifications(response.data);
      }
    } catch (error) {
      console.error("Error fetching all notifications:", error);
    }
  };

  useEffect(() => {
    if (!state.user?.id) return;
    fetchUnreadNotifications();

    // Setup WebSocket connection
    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:3300/ws"),
      onConnect: () => {
        console.log("Connected to WebSocket");
        client.subscribe(
          `/topic/notifications/${state.user!.id}`,
          (message) => {
            const notification: Notification = JSON.parse(message.body);
            setNotifications((prev) => [notification, ...prev]);
          }
        );
      },
      onDisconnect: () => {
        console.log("Disconnected from WebSocket");
      },
      onStompError: (frame) => {
        console.error("STOMP error:", frame);
      },
    });

    client.activate();
    setStompClient(client);

    return () => {
      if (client.active) {
        client.deactivate();
      }
    };
  }, [state.user?.id]);

  const markAsRead = async (id: number) => {
    try {
      const response = await notificationService.markAsRead(id);
      if (response.statusCode === "S200") {
        setNotifications((prev) =>
          prev.map((notification) =>
            notification.id === id
              ? { ...notification, isRead: true }
              : notification
          )
        );
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id);
      await Promise.all(
        unreadIds.map((id) => notificationService.markAsRead(id))
      );
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, isRead: true }))
      );
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        fetchAllNotifications,
        fetchUnreadNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};
