import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import { Colors } from '../../constants/Colors';

const PasswordInput = ({ value, placeholder, onChange, hasError }) => {
	const [showPassword, setShowPassword] = useState(true);
	const [isFocused, setIsFocused] = useState(false);

	const handleFocus = () => {
		setIsFocused(true);
	};

	return (
		<View style={[styles.passwordContainer, hasError && styles.inputError]}>
			<TextInput
				style={[styles.inputPassword, isFocused && styles.focusedInput]}
				placeholder={placeholder}
				onFocus={handleFocus}
				value={value}
				secureTextEntry={showPassword}
				onChangeText={onChange}
				underlineColorAndroid="transparent"
			/>
			<Icon
				name={showPassword ? 'eye' : 'eye-off'}
				type='feather'
				size={24}
				onPress={() => setShowPassword(!showPassword)}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	passwordContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		width: '100%',
		borderColor: Colors.blue.primary,
		borderWidth: 4,
		borderRadius: 10,
		marginBottom: '4%',
		paddingRight: '3%',
	},
	inputPassword: {
		flex: 1,
		fontSize: 20,
		fontWeight: '600',
		padding: '4%',
		borderWidth: 0,
	},
	inputError: {
		borderColor: '#ff0000',
	},
	focusedInput: {
		borderColor: '#ffffff',
		borderWidth: 0,
		backgroundColor: 'transparent',
	},
});

export default PasswordInput;
