import React, { useState } from "react";
import { Bell } from "lucide-react";
import Card from "../../components/ui/Card";
import { useNotifications } from "../../contexts/NotificationContext";
import { Link } from "react-router-dom";

const NotificationsPage: React.FC = () => {
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    fetchAllNotifications,
    fetchUnreadNotifications,
  } = useNotifications();
  const [filter, setFilter] = useState<"unread" | "all">("unread");

  const handleFilterChange = async (newFilter: "unread" | "all") => {
    setFilter(newFilter);
    if (newFilter === "unread") {
      await fetchUnreadNotifications();
    } else {
      await fetchAllNotifications();
    }
  };

  const filteredNotifications =
    filter === "unread" ? notifications.filter((n) => !n.read) : notifications;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return "Today";
    } else if (days === 1) {
      return "Yesterday";
    } else if (days < 7) {
      return `${days} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getNotificationLink = (notification: {
    projectId?: number;
    workPackageId?: number;
  }) => {
    if (notification.workPackageId) {
      return `/work-packages/${notification.workPackageId}`;
    }
    if (notification.projectId) {
      return `/projects/${notification.projectId}`;
    }
    return "#";
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Inbox</h1>
        <div className="flex items-center gap-4">
          <button onClick={() => markAllAsRead()} className="btn-secondary">
            Mark all as read
          </button>
        </div>
      </div>

      <Card>
        <div className="mb-6">
          <div className="flex gap-2">
            <button
              className={`px-4 py-2 text-sm rounded-md ${
                filter === "unread"
                  ? "bg-primary text-white"
                  : "text-text-muted hover:bg-background"
              }`}
              onClick={() => handleFilterChange("unread")}
            >
              Unread
            </button>
            <button
              className={`px-4 py-2 text-sm rounded-md ${
                filter === "all"
                  ? "bg-primary text-white"
                  : "text-text-muted hover:bg-background"
              }`}
              onClick={() => handleFilterChange("all")}
            >
              All
            </button>
          </div>
        </div>

        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-text-muted">
            <Bell size={48} className="mb-4" />
            <p className="text-lg mb-2">No notifications to show</p>
            <p className="text-sm">
              {filter === "unread"
                ? "You have no unread notifications"
                : "You have no notifications yet"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border ${
                  notification.read
                    ? "bg-white border-border"
                    : "bg-primary/5 border-primary/10"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <Link
                      to={getNotificationLink(notification)}
                      className="text-sm font-medium text-text hover:text-primary"
                    >
                      {notification.title}
                    </Link>
                    <p className="text-xs text-text-muted mt-1">
                      {formatDate(notification.timestamp)}
                    </p>
                  </div>

                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="text-xs text-primary hover:underline"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default NotificationsPage;
