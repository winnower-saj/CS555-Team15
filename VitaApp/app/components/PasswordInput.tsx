import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';

const PasswordInput = ({ value, placeholder, onChange, hasError }) => {
	const [showPassword, setShowPassword] = useState(true);
	return (
		<View style={[styles.passwordContainer, hasError && styles.inputError]}>
			<TextInput
				style={styles.inputPassword}
				placeholder={placeholder}
				value={value}
				secureTextEntry={showPassword}
				onChangeText={onChange}
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
		borderColor: '#0077FF',
		borderWidth: 1,
		borderRadius: 10,
		marginBottom: 15,
		paddingRight: 10,
	},
	inputPassword: {
		flex: 1,
		padding: 10,
	},
	inputError: {
		borderColor: 'red',
	},
});

export default PasswordInput;
