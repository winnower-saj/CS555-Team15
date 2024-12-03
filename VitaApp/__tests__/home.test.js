import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Home from '../app/home';
import { AuthProvider } from '../context/authContext';

jest.mock('@react-native-async-storage/async-storage', () => ({
	setItem: jest.fn(() => Promise.resolve()),
	getItem: jest.fn(() => Promise.resolve(null)),
	removeItem: jest.fn(() => Promise.resolve()),
	clear: jest.fn(() => Promise.resolve()),
	getAllKeys: jest.fn(() => Promise.resolve([])),
}));

jest.mock('react-native-gesture-handler', () => {
	const { View } = require('react-native'); // Import View inside the mock
	return {
		PanGestureHandler: ({ children, ...props }) => (
			<View {...props} testID='panGestureHandler'>
				{children}
			</View>
		),
	};
});

const renderWithAuthProvider = (component, navigation) => {
	return render(
		<AuthProvider>
			{React.cloneElement(component, { navigation })}
		</AuthProvider>
	);
};

describe('Home Component', () => {
	const navigationMock = {
		navigate: jest.fn(),
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('renders greeting message based on the time of day', async () => {
		const { getByText } = renderWithAuthProvider(
			<Home
				route={{
					params: { user: { firstName: 'John', lastName: 'Doe' } },
				}}
			/>,
			navigationMock
		);
		await waitFor(() => {
			const hour = new Date().getHours();
			const greeting =
				hour < 12
					? 'Good Morning!'
					: hour < 18
					? 'Good Afternoon!'
					: 'Good Evening!';
			expect(getByText(greeting)).toBeTruthy();
		});
	});

	it('renders user’s full name correctly', () => {
		const { getByText } = renderWithAuthProvider(
			<Home
				route={{
					params: { user: { firstName: 'John', lastName: 'Doe' } },
				}}
			/>,
			navigationMock
		);
		expect(getByText('John Doe')).toBeTruthy();
	});

	it('navigates to profile screen on right swipe', () => {
		const { getByTestId } = renderWithAuthProvider(
			<Home
				route={{
					params: { user: { firstName: 'John', lastName: 'Doe' } },
				}}
			/>,
			navigationMock
		);

		fireEvent(getByTestId('panGestureHandler'), 'onGestureEvent', {
			nativeEvent: { translationX: 51 },
		});

		expect(navigationMock.navigate).toHaveBeenCalledWith('profile');
	});

	it('navigates to notifications screen on left swipe', () => {
		const { getByTestId } = renderWithAuthProvider(
			<Home
				route={{
					params: { user: { firstName: 'John', lastName: 'Doe' } },
				}}
			/>,
			navigationMock
		);

		fireEvent(getByTestId('panGestureHandler'), 'onGestureEvent', {
			nativeEvent: { translationX: -51 },
		});

		expect(navigationMock.navigate).toHaveBeenCalledWith('notifications');
	});

	it('navigates to profile when Profile icon is pressed', () => {
		const { getByText } = renderWithAuthProvider(
			<Home
				route={{
					params: { user: { firstName: 'John', lastName: 'Doe' } },
				}}
			/>,
			navigationMock
		);

		fireEvent.press(getByText('Profile'));
		expect(navigationMock.navigate).toHaveBeenCalledWith('profile');
	});

	it('navigates to notifications when Notifications icon is pressed', () => {
		const { getByText } = renderWithAuthProvider(
			<Home
				route={{
					params: { user: { firstName: 'John', lastName: 'Doe' } },
				}}
			/>,
			navigationMock
		);

		fireEvent.press(getByText('Notifications'));
		expect(navigationMock.navigate).toHaveBeenCalledWith('notifications');
	});
});
