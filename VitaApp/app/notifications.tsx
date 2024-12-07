import React from 'react';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import { useNotification } from '../context/notificationContext';

const Notifications = ({ navigation }) => {
	const { notifications } = useNotification();

	const handleGesture = (event) => {
		const { translationX } = event.nativeEvent;
		if (translationX < -50) {
			// Detect left swipe
		} else if (translationX > 50) {
			// Detect right swipe
			navigation.navigate('home');
		}
	};

	// Group and sort notifications by date
	const groupAndSortNotifications = () => {
		const today = new Date().toISOString().split('T')[0];
		const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
			.toISOString()
			.split('T')[0];

		const grouped = {};
		notifications.forEach((notification) => {
			const date = notification.timestamp
				? notification.timestamp.split('T')[0]
				: null;

			let formattedDate = '';
			if (date === today) {
				formattedDate = 'Today';
			} else if (date === yesterday) {
				formattedDate = 'Yesterday';
			} else if (date) {
				formattedDate = new Date(date).toLocaleDateString('en-US', {
					day: 'numeric',
					month: 'long',
				});
			} else {
				formattedDate = 'Invalid Date';
			}

			// Add notification under its corresponding date
			if (!grouped[formattedDate]) grouped[formattedDate] = [];
			grouped[formattedDate].push(notification);
		});

		// Sort groups by date (most recent first)
		const sortedGroups = Object.keys(grouped)
			.sort((a, b) => {
				if (a === 'Today') return -1;
				if (b === 'Today') return 1;
				if (a === 'Yesterday') return -1;
				if (b === 'Yesterday') return 1;
				const dateA = new Date(a).getTime();
				const dateB = new Date(b).getTime();
				return dateB - dateA;
			})
			.map((date) => ({ date, notifications: grouped[date] }));
		return sortedGroups.filter((item) => item.date !== 'Invalid Date');
	};

	// Render a single notification
	const renderNotification = ({ item }) => (
		<View style={styles.notificationCard}>
			<View style={styles.iconContainer}>
				<Image
					source={require('../assets/images/calendar-icon.png')}
					style={styles.icon}
				/>
			</View>
			<View style={styles.textContainer}>
				<Text style={styles.notificationTitle}>{item.title}</Text>
				<Text style={styles.notificationBody}>{item.body}</Text>
			</View>
		</View>
	);

	// Render a date group with its notifications
	const renderDateGroup = ({ item }) => (
		<View>
			<View style={styles.dateBadge}>
				<Text style={styles.dateBadgeText}>{item.date}</Text>
			</View>
			{item.notifications.map((notification) => (
				<View key={notification.id}>
					{renderNotification({ item: notification })}
				</View>
			))}
		</View>
	);

	return (
		<PanGestureHandler
			onGestureEvent={handleGesture}
			onHandlerStateChange={handleGesture}
		>
			<View style={styles.container}>
				<Text style={styles.title}>Notification</Text>
				<FlatList
					data={groupAndSortNotifications()}
					renderItem={renderDateGroup}
					keyExtractor={(item) => item.date}
					contentContainerStyle={styles.contentContainer}
					ListEmptyComponent={
						<Text style={styles.emptyMessage}>
							No notifications yet
						</Text>
					}
				/>
			</View>
		</PanGestureHandler>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
		backgroundColor: '#fff',
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#2b6cb0',
		marginTop: 24,
		marginBottom: 16,
		textAlign: 'center',
	},
	dateBadge: {
		backgroundColor: '#2b6cb0',
		padding: 8,
		borderRadius: 16,
		marginVertical: 8,
		alignSelf: 'flex-start',
	},
	dateBadgeText: {
		color: '#fff',
		fontSize: 14,
		fontWeight: 'bold',
	},
	notificationCard: {
		flexDirection: 'row',
		backgroundColor: '#f9f9f9',
		padding: 12,
		marginBottom: 12,
		borderRadius: 8,
		elevation: 1,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
	},
	iconContainer: {
		marginRight: 12,
	},
	icon: {
		width: 40,
		height: 40,
	},
	textContainer: {
		flex: 1,
	},
	notificationTitle: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#333',
		marginBottom: 4,
	},
	notificationBody: {
		fontSize: 14,
		color: '#666',
	},
	emptyMessage: {
		textAlign: 'center',
		color: '#666',
		marginTop: 20,
		fontSize: 16,
	},
	contentContainer: {
		paddingBottom: 16,
	},
});

export default Notifications;
