import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PanGestureHandler } from 'react-native-gesture-handler';

const MenuItem = ({ icon, title, onPress }) => (
	<TouchableOpacity style={styles.menuItem} onPress={onPress}>
		<View style={styles.menuIconContainer}>
			<Ionicons name={icon} size={40} color='#0077B6' />
		</View>
		<Text style={styles.menuText}>{title}</Text>
		<Ionicons name='chevron-forward' size={36} color='#0077B6' />
	</TouchableOpacity>
);

const Profile = ({ navigation }) => {

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
					<Text style={styles.headerTitle}>Settings</Text>
				</View>

				<View style={styles.menu}>
					<MenuItem
						icon='bulb-outline'
						title='Notification Settings'
						onPress={() => navigation.navigate('soundandvibration')}
					/>
					<MenuItem
						icon='key-outline'
						title='Password Manager'
						onPress={() => navigation.navigate('passwordmanager')}
					/>
					<MenuItem
						icon='trash-outline'
						title='Delete Account'
						onPress={() => alert('Deleting Account')}
					/>
				</View>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('profile')}>
        <Text style={styles.backButtonText}>&lt;   Back</Text>
      </TouchableOpacity>
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
		alignItems: 'center'
	},
	headerTitle: {
		flex: 1,
		color: '#0077B6',
		fontSize: 25,
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
		marginBottom:100,
	},
	menuItem: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 8,
	},
	menuIconContainer: {
		width: 70,
		height: 70,
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
  backButtonText: {
    color: 'white',
    fontSize: 25,
  },
  backButton: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: '#0077C8',
    borderRadius: 50,
    width: '70%',
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Profile;
