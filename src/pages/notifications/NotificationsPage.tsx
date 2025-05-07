import React, { useState } from "react";
import { Bell, Settings } from "lucide-react";
import Card from "../../components/ui/Card";

const NotificationsPage: React.FC = () => {
  const [filter, setFilter] = useState<"unread" | "all">("unread");

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Inbox</h1>
        <div className="flex items-center gap-4">
          <button className="btn-secondary">Mark all as read</button>
          <button className="text-text-muted hover:text-text">
            <Settings size={20} />
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
              onClick={() => setFilter("unread")}
            >
              Unread
            </button>
            <button
              className={`px-4 py-2 text-sm rounded-md ${
                filter === "all"
                  ? "bg-primary text-white"
                  : "text-text-muted hover:bg-background"
              }`}
              onClick={() => setFilter("all")}
            >
              All
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-12 text-text-muted">
          <Bell size={48} className="mb-4" />
          <p className="text-lg mb-2">Looks like you are all caught up.</p>
          <p className="text-sm">
            New notifications will appear here when there is activity that
            concerns you.
          </p>
          <p className="text-sm mt-4">
            You can modify your{" "}
            <button className="text-primary hover:underline">
              notification settings
            </button>{" "}
            to ensure you never miss an important update.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default NotificationsPage;
