import React from 'react';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { View, Text } from 'react-native';

const Notifications = ({ navigation }) => {
	const handleGesture = (event) => {
		const { translationX } = event.nativeEvent;
		if (translationX < -50) {
			// Detect left swipe
		} else if (translationX > 50) {
			// Detect right swipe
			navigation.navigate('home');
		}
	};
	return (
		<PanGestureHandler
			onGestureEvent={handleGesture}
			onHandlerStateChange={handleGesture}
		>
			<View>
				<Text>Notifications</Text>
			</View>
		</PanGestureHandler>
	);
};

export default Notifications;
