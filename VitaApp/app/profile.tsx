import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PanGestureHandler } from 'react-native-gesture-handler';

const MenuItem = ({ icon, title, onPress }) => (
	<TouchableOpacity style={styles.menuItem} onPress={onPress}>
		<View style={styles.menuIconContainer}>
			<Ionicons name={icon} size={40} color='#FFFFFF' />
		</View>
		<Text style={styles.menuText}>{title}</Text>
		<Ionicons name='chevron-forward' size={36} color='#0077B6' />
	</TouchableOpacity>
);

const Profile = ({ navigation, route }) => {
	const { user } = route.params;

	const handleGesture = (event) => {
		const { translationX } = event.nativeEvent;

		if (translationX < -50) {
			// Detect left swipe
			navigation.navigate('home');
		} else if (translationX > 50) {
			// Detect right swipe
		}
	};
	return (
		<PanGestureHandler
			onGestureEvent={handleGesture}
			onHandlerStateChange={handleGesture}
		>
			<View style={styles.container}>
				<View style={styles.header}>
					<TouchableOpacity
						onPress={() => navigation.goBack()}
						style={styles.backButton}
					>
						<Ionicons name='arrow-back' size={24} color='#0077B6' />
					</TouchableOpacity>
					<Text style={styles.headerTitle}>My Profile</Text>
				</View>

				<View style={styles.profileSection}>
					<Image
						source={require('../assets/images/profile.png')}
						style={styles.profileImage}
					/>
					<Text
						style={styles.userName}
					>{`${user.firstName} ${user.lastName}`}</Text>
				</View>

				<View style={styles.menu}>
					<MenuItem
						icon='person'
						title='Profile'
						onPress={() => alert('Navigate to Profile')}
					/>
					<MenuItem
						icon='lock-closed'
						title='Privacy Policy'
						onPress={() => alert('Navigate to Privacy Policy')}
					/>
					<MenuItem
						icon='settings'
						title='Settings'
						onPress={() => alert('Navigate to Settings')}
					/>
					<MenuItem
						icon='log-out'
						title='Log Out'
						onPress={() => alert('Logging Out')}
					/>
				</View>
			</View>
		</PanGestureHandler>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		padding: 24,
	},
	header: {
		position: 'relative',
		paddingVertical: 36,
		flexDirection: 'row',
		alignItems: 'center',
	},
	backButton: {
		position: 'absolute',
		padding: 8,
		backgroundColor: '#CAF0F8',
		borderRadius: 100,
	},
	headerTitle: {
		flex: 1,
		color: '#0077B6',
		fontSize: 22,
		fontWeight: 'bold',
		textAlign: 'center',
	},
	profileSection: {
		alignItems: 'center',
		marginBottom: 30,
	},
	profileImage: {
		width: 100,
		height: 100,
		borderRadius: 50,
		marginBottom: 10,
	},
	userName: {
		fontSize: 32,
		fontWeight: 'semibold',
		color: '#000000',
	},
	menu: {
		marginTop: 36,
	},
	menuItem: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 8,
	},
	menuIconContainer: {
		width: 70,
		height: 70,
		backgroundColor: '#0077B6',
		borderRadius: 100,
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 15,
	},
	menuText: {
		fontSize: 24,
		fontWeight: 'semibold',
		flex: 1,
		color: '#000000',
	},
});

export default Profile;
