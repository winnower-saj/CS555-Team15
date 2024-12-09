import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PageHeading from './components/PageHeading';
import { Colors } from '../constants/Colors';

const MenuItem = ({ icon, title, onPress }) => (
	<TouchableOpacity style={styles.menuItem} onPress={onPress}>
		<View style={styles.menuIconContainer}>
			<Ionicons name={icon} size={40} color={Colors.blue.primary} />
		</View>
		<Text style={styles.menuText}>{title}</Text>
		<Ionicons name='chevron-forward' size={36} color={Colors.blue.primary} />
	</TouchableOpacity>
);

const Settings = ({ navigation }) => {
	return (
		<View style={styles.container}>
			<PageHeading title='Settings' handlePress={() => navigation.navigate('profile')} />

			<View style={styles.menu}>
				<MenuItem
					icon='bulb-outline'
					title='Notification Setting'
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
					onPress={() => navigation.navigate('delete-account')}
				/>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#ffffff',
		paddingVertical: '5%',
	},
	menu: {
		paddingHorizontal: '5%',
		paddingTop: '10%'
	},
	menuItem: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: '7%',
	},
	menuIconContainer: {
		width: 50,
		height: 50,
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: '4%',
	},
	menuText: {
		flex: 1,
		fontSize: 24,
		fontWeight: '600',
		color: '#000000',
	},
});

export default Settings;
