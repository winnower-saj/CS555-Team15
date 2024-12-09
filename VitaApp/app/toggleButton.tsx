import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';

const ToggleButton = ({ isOn, labelOn, labelOff, onToggle }) => (
	<TouchableOpacity
		accessibilityLabel={isOn ? labelOn : labelOff}
		style={[styles.toggleButton, isOn ? styles.toggleOn : styles.toggleOff]}
		onPress={onToggle}
	>
		<Text style={styles.toggleText}>{isOn ? 'ON' : 'OFF'}</Text>
	</TouchableOpacity>
);

const styles = StyleSheet.create({
	toggleButton: {
		width: 75,
		height: 40,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 5,
	},
	toggleOn: {
		backgroundColor: Colors.blue.primary,
	},
	toggleOff: {
		backgroundColor: Colors.blue.dark,
	},
	toggleText: {
		fontSize: 20,
		fontWeight: '600',
		color: '#ffffff',
	},
});

export default ToggleButton;
