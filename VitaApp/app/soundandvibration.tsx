import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ToggleButton from './toggleButton';
import PageHeading from './components/PageHeading';

const SoundAndVibration = ({ navigation }) => {
	const [isSoundOn, setIsSoundOn] = useState(true);
	const [isVibrationOn, setIsVibrationOn] = useState(false);
	
	return (
		<View style={styles.container}>
			<PageHeading title='Notification Settings' handlePress={() => navigation.navigate('settings')} />

			<View style={styles.settingContainer}>
				<View style={styles.setting}>
					<Text style={styles.label}>Sound</Text>
					<ToggleButton
						isOn={isSoundOn}
						labelOn='Sound ON'
						labelOff='Sound OFF'
						onToggle={() => setIsSoundOn(!isSoundOn)}
					/>
				</View>

				<View style={styles.setting}>
					<Text style={styles.label}>Vibrate</Text>
					<ToggleButton
						isOn={isVibrationOn}
						labelOn='Vibration ON'
						labelOff='Vibration OFF'
						onToggle={() => setIsVibrationOn(!isVibrationOn)}
					/>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingVertical: '5%',
		backgroundColor: '#ffffff',
	},
	settingContainer: {
		marginTop: '10%'
	},
	setting: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: '8%',
		paddingHorizontal: '5%',
	},
	label: {
		fontSize: 24,
		fontWeight: '600',
	},
});

export default SoundAndVibration;