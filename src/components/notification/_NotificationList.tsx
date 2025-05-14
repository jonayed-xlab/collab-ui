// import React, { useState, useEffect } from 'react';
// import { Bell } from 'lucide-react';
// import NotificationItem from './NotificationItem';
// import { Notification } from '../../types';
// import notificationService from '../../services/notificationService';
// import { useAuth } from '../../contexts/AuthContext';

// const NotificationList: React.FC = () => {
//   const { state } = useAuth();
//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchNotifications = async () => {
//       if (!state.user) return;

//       try {
//         setIsLoading(true);
//         const response = await notificationService.getAllNotifications(state.user.id);

//         if (response.statusCode === "S200" && response.data) {
//           setNotifications(response.data);
//         } else {
//           setError(response.message || 'Failed to fetch notifications');
//         }
//       } catch (error) {
//         setError('An error occurred while fetching notifications');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchNotifications();
//   }, [state.user]);

//   const markAsRead = async (id: number) => {
//     // This is just a UI update since the API endpoint is not specified
//     setNotifications(notifications.map(notification =>
//       notification.id === id ? { ...notification, isRead: true } : notification
//     ));
//   };

//   if (isLoading) {
//     return (
//       <div className="p-4 text-center">
//         <p className="text-text-muted">Loading notifications...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-4 text-center text-error">
//         <p>{error}</p>
//       </div>
//     );
//   }

//   if (notifications.length === 0) {
//     return (
//       <div className="p-4 text-center">
//         <Bell size={24} className="mx-auto mb-2 text-text-muted" />
//         <p className="text-text-muted">No notifications yet</p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-2">
//       {notifications.map(notification => (
//         <NotificationItem
//           key={notification.id}
//           notification={notification}
//           onMarkAsRead={markAsRead}
//         />
//       ))}
//     </div>
//   );
// };

// export default NotificationList;
