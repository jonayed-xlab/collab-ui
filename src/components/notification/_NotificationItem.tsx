// import React from "react";
// import { CheckCircle, Info, AlertTriangle } from "lucide-react";
// import { Notification } from "../../types";

// interface NotificationItemProps {
//   notification: Notification;
//   onMarkAsRead?: (id: number) => void;
// }

// const NotificationItem: React.FC<NotificationItemProps> = ({
//   notification,
//   onMarkAsRead,
// }) => {
//   const getNotificationIcon = () => {
//     const type = notification.type.toLowerCase();

//     if (type.includes("success")) {
//       return <CheckCircle size={16} className="text-success" />;
//     } else if (type.includes("warning")) {
//       return <AlertTriangle size={16} className="text-warning" />;
//     } else if (type.includes("error")) {
//       return <AlertTriangle size={16} className="text-error" />;
//     } else {
//       return <Info size={16} className="text-primary" />;
//     }
//   };

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return date.toLocaleString();
//   };

//   return (
//     <div
//       className={`flex items-start gap-3 p-3 rounded-md ${
//         notification.isRead ? "bg-white" : "bg-primary/5"
//       }`}
//     >
//       <div className="mt-1">{getNotificationIcon()}</div>

//       <div className="flex-1">
//         <p className="text-sm mb-1">{notification.message}</p>
//         <p className="text-xs text-text-muted">
//           {formatDate(notification.createdAt)}
//         </p>
//       </div>

//       {!notification.isRead && onMarkAsRead && (
//         <button
//           className="text-xs text-primary hover:underline"
//           onClick={() => onMarkAsRead(notification.id)}
//         >
//           Mark as read
//         </button>
//       )}
//     </div>
//   );
// };

// export default NotificationItem;
