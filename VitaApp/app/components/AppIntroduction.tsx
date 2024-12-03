import React, { useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import {
	SafeAreaProvider,
	SafeAreaView as SafeAreaViewRN,
} from 'react-native-safe-area-context';
import SmallButton from './SmallButton';
import { Colors } from '../../constants/Colors';

const stepsData = [
	{
		icon: require('../../assets/images/bell.png'),
		title: 'Reminders',
		desc: 'Gentle reminders for a healthier lifestyle.',
	},
	{
		icon: require('../../assets/images/lotus.png'),
		title: 'Comfort',
		desc: 'Peace of mind for seniors and families.',
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
						<SmallButton
							btnTitle={isFirstStep ? 'Skip' : 'Back'}
							btnBackgroundColor='#ffffff'
							handlePress={isFirstStep ? onSkip : handlePreviousPress} >
						</SmallButton>
						<SmallButton
							btnTitle={isLastStep ? 'Finish' : 'Next'}
							btnBackgroundColor='#0077B6'
							btnTextColor='#ffffff'
							handlePress={isLastStep ? onSkip : handleNextPress} >
						</SmallButton>
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
		flex: 1,
		alignItems: 'center',
		justifyContent: 'space-evenly',
		backgroundColor: '#ffffff',
	},
	stepContainer: {
		width: '100%',
		height: '100%',
		alignItems: 'center',
		justifyContent: 'center',
	},
	contentPartOne: {
		flex: 1,
		height: '50%',
		alignItems: 'center',
		justifyContent: 'center',
	},
	icon: {
		width: 100,
		height: 100,
		marginBottom: '2%',
	},
	title: {
		fontSize: 35,
		fontWeight: '600',
		color: '#000000',
	},
	contentPartTwo: {
		width: '100%',
		height: '50%',
		paddingTop: '8%',
		paddingHorizontal: '5%',
		backgroundColor: Colors.blue.dark,
	},
	description: {
		fontSize: 30,
		color: '#ffffff',
		lineHeight: 45,
		textAlign: 'left',
		marginBottom: '30%',
	},
	buttonContainer: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-around',
		marginBottom: '10%',
	},
	stepIndicatorContainer: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	stepIndicator: {
		width: 45,
		height: 15,
		borderRadius: 8,
		marginHorizontal: 4,
		backgroundColor: '#ffffff',
	},
	activeStep: {
		backgroundColor: Colors.blue.primary,
	},
});

export default AppIntroduction;
