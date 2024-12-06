import React from 'react';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useNotification } from '../context/notificationContext';

const Notifications = ({ navigation }) => {
	const { notifications } = useNotification(); // Access notifications from context
	console.log('notifications: ', notifications);

	const handleGesture = (event) => {
		const { translationX } = event.nativeEvent;
		if (translationX < -50) {
			// Detect left swipe
		} else if (translationX > 50) {
			// Detect right swipe
			navigation.navigate('home');
		}
	};

	const renderNotification = ({ item }) => (
		<View style={styles.notification}>
			<Text style={styles.title}>{item.title}</Text>
			<Text>{item.body}</Text>
		</View>
	);

	return (
		<PanGestureHandler
			onGestureEvent={handleGesture}
			onHandlerStateChange={handleGesture}
		>
			<View style={styles.container}>
				<Text style={styles.heading}>Notifications</Text>
				{notifications.length > 0 ? (
					<FlatList
						data={notifications}
						keyExtractor={(item) => item.id}
						renderItem={renderNotification}
					/>
				) : (
					<Text style={styles.noNotifications}>
						No notifications yet!
					</Text>
				)}
			</View>
		</PanGestureHandler>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: '#f9f9f9',
	},
	heading: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 20,
	},
	notification: {
		padding: 15,
		backgroundColor: '#fff',
		marginBottom: 10,
		borderRadius: 10,
		shadowColor: '#000',
		shadowOpacity: 0.1,
		shadowRadius: 4,
		shadowOffset: { width: 0, height: 2 },
		elevation: 2,
	},
	title: {
		fontSize: 18,
		fontWeight: 'bold',
		marginBottom: 5,
	},
	noNotifications: {
		marginTop: 20,
		fontSize: 16,
		color: '#aaa',
		textAlign: 'center',
	},
});

export default Notifications;
