import React from 'react';
import {
	View,
	Text,
	Modal,
	StyleSheet,
	Image,
} from 'react-native';
import { Colors } from '../../constants/Colors';
import SmallButton from './SmallButton';

const CustomModal = ({ title, message, btnTitle, onClose, visible }) => {
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
					<SmallButton btnTitle={btnTitle} btnTextColor='#ffffff' handlePress={onClose} />
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
		backgroundColor: 'rgba(256, 256, 256, 1)',
		padding: '5%',
	},
	modalContent: {
		width: '100%',
		alignItems: 'center',
		backgroundColor: Colors.blue.dark,
		borderRadius: 50,
		padding: '10%',
	},
	checkmark: {
		width: 85,
		height: 85,
		marginBottom: 20,
		tintColor: '#adff2f',
	},
	title: {
		fontSize: 35,
		fontWeight: '600',
		color: '#ffffff',
		textAlign: 'center',
		marginBottom: '10%',
	},
	message: {
		fontSize: 16,
		fontWeight: '500',
		lineHeight: 25,
		color: '#ffffff',
		textAlign: 'center',
		marginBottom: '15%',
	},
});

export default CustomModal;
