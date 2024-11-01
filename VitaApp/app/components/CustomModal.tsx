import React from 'react';
import {
	View,
	Text,
	Modal,
	StyleSheet,
	TouchableOpacity,
	Image,
} from 'react-native';

const CustomModal = ({ title, message, button, onClose, visible }) => {
	return (
		<Modal visible={visible} animationType='fade' transparent={true}>
			<View style={styles.modalContainer}>
				<View style={styles.modalContent}>
					<Image
						source={require('../../assets/images/check.png')}
						style={styles.checkmark}
					/>
					<Text style={styles.title}>{title}</Text>
					<Text style={styles.message}>{message}</Text>
					<TouchableOpacity
						onPress={onClose}
						style={styles.homeButton}
					>
						<Text style={styles.buttonText}>{button}</Text>
					</TouchableOpacity>
				</View>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	modalContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
	},
	modalContent: {
		backgroundColor: '#001d6c', // Dark blue background
		borderRadius: 20,
		padding: 30,
		alignItems: 'center',
		width: '85%',
	},
	checkmark: {
		width: 50,
		height: 50,
		marginBottom: 20,
		tintColor: '#9CE67B', // Success green color
	},
	title: {
		fontSize: 24,
		color: '#FFFFFF',
		fontWeight: 'bold',
		textAlign: 'center',
		marginBottom: 10,
	},
	message: {
		fontSize: 16,
		color: '#FFFFFF',
		textAlign: 'center',
		marginBottom: 30,
	},
	homeButton: {
		backgroundColor: '#377DFF', // Blue color
		borderRadius: 20,
		paddingVertical: 10,
		paddingHorizontal: 40,
	},
	buttonText: {
		color: '#FFFFFF',
		fontSize: 16,
		fontWeight: 'bold',
	},
});

export default CustomModal;
