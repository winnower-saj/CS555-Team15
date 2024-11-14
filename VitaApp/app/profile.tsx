import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PanGestureHandler } from 'react-native-gesture-handler';
import LogoutModal from './components/LogoutModal';
import { Colors } from '../constants/Colors';
import { getUserSession } from '../services/authService';
import { logoutUser } from '../services/dbService';
import { useAuth } from '../context/authContext';

const MenuItem = ({ menuIcon, menuTitle, handleOnPress }) => (
	<TouchableOpacity style={styles.menuItem} onPress={handleOnPress}>
		<View style={styles.menuIconContainer}>
			<Ionicons name={menuIcon} size={40} color='#FFFFFF' />
		</View>
		<Text style={styles.menuText}>{menuTitle}</Text>
		<Ionicons name='chevron-forward' size={32} color={Colors.blue.primary} />
	</TouchableOpacity>
);

const Profile = ({ navigation, route }) => {
	const { user } = route.params;
	const { logout } = useAuth();
	const [showLogoutModal, setShowLogoutModal] = useState(false);

	const handleGesture = (event: { nativeEvent: { translationX: any; }; }) => {
		const { translationX } = event.nativeEvent;

		// Detect left swipe
		if (translationX < -50) {
			navigation.navigate('home');
		}
	};

	// Show the LogoutModal
	const handleLogoutPress = () => {
		setShowLogoutModal(true);
	}

	// Hide the LogoutModal
	const handleCancel = () => {
		setShowLogoutModal(false);
	};

	const handleLogout = async () => {
		// Retrive current user session
		const userSession = await getUserSession();

		if (userSession?.refreshToken) {
			try {
				// Logout the user
				await logoutUser(userSession.refreshToken);

				// Clear local session
				await logout();

			} catch (error) {
				Alert.alert('⚠️ Unable to Process Request',
					'\nCannot logout right now. Please try again later.',
					[
						{
							text: 'Close',
							onPress: () => console.log('Logout Error: Alert Closed'),
						}
					]
				);

				console.error('Logout error:', error.response?.data || error.message);

				return;
			}
		}

		// Hide the LogoutModal
		setShowLogoutModal(false);

		// Reset the navigation stack and navigate to welcome screen
		navigation.reset({
			index: 0,
			routes: [{ name: 'home' }],
		});
	};

	return (
		<PanGestureHandler
			onGestureEvent={handleGesture}
			onHandlerStateChange={handleGesture}>
			<View style={styles.container}>
				<View style={styles.header}>
					<Text style={styles.headerTitle}>My Profile</Text>
					<TouchableOpacity
						onPress={() => navigation.navigate('home')}
						style={styles.backButton}>
						<Ionicons name='arrow-forward' size={30} color={Colors.blue.primary} />
					</TouchableOpacity>
				</View>

				<View style={styles.profileSection}>
					<Image
						source={require('../assets/images/user.png')}
						style={styles.profileImage}
					/>
					<Text
						style={styles.userName}
					>{`${user.firstName} ${user.lastName}`}</Text>
				</View>

				<View style={styles.menu}>
					<MenuItem
						menuIcon='person'
						menuTitle='Profile'
						handleOnPress={() => navigation.navigate('my-profile')}
					/>
					<MenuItem
						menuIcon='lock-closed'
						menuTitle='Privacy Policy'
						handleOnPress={() => navigation.navigate('privacypolicy')}
					/>
					<MenuItem
						menuIcon='settings'
						menuTitle='Settings'
						handleOnPress={() => navigation.navigate('settings')}
					/>
					<TouchableOpacity style={styles.menuItem} onPress={handleLogoutPress}>
						<View style={styles.menuIconContainer}>
							<Ionicons name='log-out' size={40} color='#ffffff' />
						</View>
						<Text style={styles.menuText}>Log Out</Text>
					</TouchableOpacity>
				</View>

				<LogoutModal showLogoutModal={showLogoutModal} handleCancel={handleCancel} handleLogout={handleLogout} />
			</View>
		</PanGestureHandler>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#ffffff',
		padding: '5%',
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: '1%',
		paddingVertical: "9%",
	},
	headerTitle: {
		flex: 1,
		fontSize: 32,
		fontWeight: '600',
		textAlign: 'center',
		color: Colors.blue.primary,
		paddingLeft: '10%',
	},
	backButton: {
		backgroundColor: Colors.blue.light,
		borderRadius: 50,
		padding: '2%',
	},
	profileSection: {
		alignItems: 'center',
	},
	profileImage: {
		width: 120,
		height: 120,
		borderRadius: 50,
		marginBottom: '3%',
	},
	userName: {
		fontSize: 32,
		fontWeight: '600',
		color: '#000000',
	},
	menu: {
		marginTop: '10%',
	},
	menuItem: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: '2%',
	},
	menuIconContainer: {
		width: 70,
		height: 70,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: Colors.blue.primary,
		borderRadius: 50,
		marginRight: '6%',
	},
	menuText: {
		flex: 1,
		fontSize: 24,
		fontWeight: '600',
		color: '#000000',
	},
});

export default Profile;
