import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import {
	SafeAreaProvider,
	SafeAreaView as SafeAreaViewRN,
} from 'react-native-safe-area-context';

const stepsData = [
	{
		icon: require('../../assets/images/bell.png'),
		title: 'Reminders',
		desc: 'Gentle reminders for a healthier lifestyle.',
	},
	{
		icon: require('../../assets/images/lotus.png'),
		title: 'Comfort',
		desc: 'Pease of mind for seniors and families.',
	},
	{
		icon: require('../../assets/images/assistant.png'),
		title: 'Support',
		desc: 'Enhancing lives, one voice at a time.',
	},
	{
		icon: require('../../assets/images/wellbeing.png'),
		title: 'Simple',
		desc: 'Making wellness easy and engaging.',
	},
];

const AppIntroduction = ({ onSkip }) => {
	const [currentStep, setCurrentStep] = useState(0);

	const handleNextPress = () => {
		setCurrentStep(
			currentStep + 1 >= stepsData.length
				? stepsData.length - 1
				: currentStep + 1
		);
	};

	const handlePreviousPress = () => {
		setCurrentStep(currentStep - 1 < 0 ? 0 : currentStep - 1);
	};

	const renderStep = () => {
		const currentStepData = stepsData[currentStep];
		const isFirstStep = currentStep === 0;
		const isLastStep = currentStep === stepsData.length - 1;

		return (
			<View style={styles.stepContainer}>
				<View style={styles.contentPartOne}>
					<Image source={currentStepData.icon} style={styles.icon} />
					<Text style={styles.title}>{currentStepData.title}</Text>
				</View>
				<View style={styles.contentPartTwo}>
					<Text style={styles.description}>
						{currentStepData.desc}
					</Text>
					<View style={[styles.buttonContainer]}>
						<TouchableOpacity
							style={[styles.button, styles.secondaryButton]}
							onPress={isFirstStep ? onSkip : handlePreviousPress}
						>
							<Text style={styles.buttonText}>
								{isFirstStep ? 'Skip' : 'Back'}
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={[styles.button, styles.primaryButton]}
							onPress={isLastStep ? onSkip : handleNextPress}
						>
							<Text style={styles.buttonText}>
								{isLastStep ? 'Finsh' : 'Next'}
							</Text>
						</TouchableOpacity>
					</View>
					<View style={styles.stepIndicatorContainer}>
						{stepsData.map((data, index) => (
							<View
								key={index}
								style={[
									styles.stepIndicator,
									index === currentStep && styles.activeStep,
								]}
							/>
						))}
					</View>
				</View>
			</View>
		);
	};

	return (
		<SafeAreaProvider>
			<SafeAreaViewRN style={styles.safeArea}>
				{renderStep()}
			</SafeAreaViewRN>
		</SafeAreaProvider>
	);
};

// Styles
const styles = StyleSheet.create({
	safeArea: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		flex: 1,
		backgroundColor: '#fff',
	},
	stepContainer: {
		width: '100%',
		alignItems: 'center',
		justifyContent: 'center',
	},
	contentPartOne: {
		height: '50%',
		paddingTop: '30%',
		alignItems: 'center',
		justifyContent: 'center',
	},
	icon: {
		width: 100,
		height: 100,
		marginBottom: 24,
	},
	title: {
		color: '#0A0A52',
		fontSize: 28,
		fontWeight: 'bold',
	},
	contentPartTwo: {
		width: '100%',
		height: '50%',
		paddingTop: '20%',
		alignItems: 'center',
		backgroundColor: '#0A0A52',
	},
	description: {
		color: '#fff',
		fontSize: 16,
		textAlign: 'center',
		marginBottom: 56,
	},
	buttonContainer: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-around',
	},
	button: {
		borderRadius: 16,
		paddingVertical: 16,
		paddingHorizontal: 32,
	},
	primaryButton: {
		backgroundColor: '#377DFF',
	},
	secondaryButton: {
		backgroundColor: '#E0E0E0',
	},
	buttonText: {
		color: '#000',
		fontWeight: 'bold',
	},
	stepIndicatorContainer: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		flex: 1,
		marginBottom: 80,
	},
	stepIndicator: {
		width: 32,
		height: 8,
		borderRadius: 8,
		marginTop: 'auto',
		marginHorizontal: 4,
		backgroundColor: '#E0E0E0',
	},
	activeStep: {
		backgroundColor: '#377DFF',
	},
});

export default AppIntroduction;
