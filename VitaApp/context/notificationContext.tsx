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
}

interface NotificationContextType {
	notifications: Notification[];
	setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
	undefined
);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
	const [notifications, setNotifications] = useState<Notification[]>([]);
	// console.log('notifications: ', notifications);

	useEffect(() => {
		const notificationListener =
			Notifications.addNotificationReceivedListener((notification) => {
				setNotifications((prev) => [
					...prev,
					{
						id: notification.request.identifier,
						title: notification.request.content.title,
						body: notification.request.content.body,
					},
				]);
			});

		return () => {
			Notifications.removeNotificationSubscription(notificationListener);
		};
	}, []);

	return (
		<NotificationContext.Provider
			value={{ notifications, setNotifications }}
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
