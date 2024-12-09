import React, { createContext, useContext, useState, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { useTTS } from './ttsContext';

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
		title: 'Physiotherapy Session',
		body: 'Quarterly appointment with Dr. Smith for blood pressure monitoring is scheduled in 3 hours.',
		timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
	},
	{
		id: '2',
		title: 'Physiotherapy Session',
		body: 'Quarterly appointment with Dr. Smith for blood pressure monitoring is scheduled for tomorrow.',
		timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
	},
];

export const NotificationProvider = ({ children }) => {
	const [notifications, setNotifications] = useState(initialNotifications);
	const { playTTS, isTTSActive } = useTTS();
	const listenerAdded = React.useRef(false); // Track if the listener is already added
	let lastNotificationId = null; // Track duplicate notifications

	useEffect(() => {
		if (!listenerAdded.current) {
			console.log('Adding notification listener');
			listenerAdded.current = true;

			const listener = Notifications.addNotificationReceivedListener(
				(notification) => {
					// Prevent duplicate notifications
					if (
						lastNotificationId === notification.request.identifier
					) {
						console.log(
							'Duplicate notification ignored:',
							notification.request.identifier
						);
						return;
					}
					lastNotificationId = notification.request.identifier;

					// Create a new notification
					const newNotification = {
						id: notification.request.identifier,
						title: notification.request.content.title,
						body: notification.request.content.body,
						timestamp: new Date().toISOString(),
					};

					// Play TTS
					if (
						!isTTSActive /* &&
						lastNotificationId !== notification.request.identifier */
					) {
						console.log(
							'Playing TTS for notification:',
							newNotification.body
						);
						playTTS(newNotification.body);
					} else {
						console.log(
							'TTS already active, skipping this notification'
						);
					}

					// Add the notification to the list
					setNotifications((prev) => {
						const exists = prev.some(
							(n) => n.id === newNotification.id
						);
						if (!exists) {
							return [...prev, newNotification];
						}
						return prev;
					});
				}
			);

			// Cleanup listener on unmount
			return () => {
				console.log('Cleaning up notification listener');
				Notifications.removeNotificationSubscription(listener);
				listenerAdded.current = false;
			};
		}
	}, [isTTSActive, playTTS]);

	return (
		<NotificationContext.Provider
			value={{ notifications, setNotifications }}
		>
			{children}
		</NotificationContext.Provider>
	);
};

export const useNotification = () => {
	const context = useContext(NotificationContext);
	if (!context) {
		throw new Error(
			'useNotification must be used within a NotificationProvider'
		);
	}
	return context;
};
