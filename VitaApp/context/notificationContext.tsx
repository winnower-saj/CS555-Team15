import React, {
	createContext,
	useContext,
	useState,
	ReactNode,
	useEffect,
} from 'react';
import * as Notifications from 'expo-notifications';

interface Notification {
	id: string;
	title: string;
	body: string;
	timestamp: string; // ISO string for sorting and grouping
}

interface NotificationContextType {
	notifications: Notification[];
	setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
	clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
	undefined
);

const initialNotifications: Notification[] = [
	{
		id: '1',
		title: 'Reminder for Appointment',
		body: 'Your appointment is scheduled for tomorrow.',
		timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
	},
	{
		id: '2',
		title: 'Medication Reminder',
		body: 'Take your medication at 10 AM.',
		timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
	},
	{
		id: '3',
		title: 'Follow-Up Reminder',
		body: 'Your follow-up is scheduled for next week.',
		timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
	},
	{
		id: '4',
		title: 'New Health Tips',
		body: 'Check out the latest health tips in your app.',
		timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
	},
];

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
	const [notifications, setNotifications] =
		useState<Notification[]>(initialNotifications);

	useEffect(() => {
		const handleNotificationReceived = (
			notification: Notifications.Notification
		) => {
			const newNotification: Notification = {
				id: notification.request.identifier,
				title: notification.request.content.title,
				body: notification.request.content.body,
				timestamp: new Date().toISOString(),
			};

			setNotifications((prev) => {
				const exists = prev.some((n) => n.id === newNotification.id);
				if (!exists) {
					return [...prev, newNotification]; // Add if unique
				}
				return prev;
			});
		};

		// Add notification listener
		const notificationListener =
			Notifications.addNotificationReceivedListener(
				handleNotificationReceived
			);

		// Cleanup listener on unmount
		return () => {
			Notifications.removeNotificationSubscription(notificationListener);
		};
	}, []);

	// Clear all notifications
	const clearNotifications = () => {
		setNotifications([]);
	};

	return (
		<NotificationContext.Provider
			value={{ notifications, setNotifications, clearNotifications }}
		>
			{children}
		</NotificationContext.Provider>
	);
};

export const useNotification = (): NotificationContextType => {
	const context = useContext(NotificationContext);
	if (!context) {
		throw new Error(
			'useNotification must be used within a NotificationProvider'
		);
	}
	return context;
};
