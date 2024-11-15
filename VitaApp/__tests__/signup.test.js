import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import SignUp from '../app/signup';
import { useRouter } from 'expo-router';
import { AuthProvider } from '../context/authContext';
import { signupUser } from '../services/dbService';

jest.mock('@react-native-async-storage/async-storage', () => ({
	setItem: jest.fn(() => Promise.resolve()),
	getItem: jest.fn(() => Promise.resolve(null)),
	removeItem: jest.fn(() => Promise.resolve()),
	clear: jest.fn(() => Promise.resolve()),
	getAllKeys: jest.fn(() => Promise.resolve([])),
}));

jest.mock('../services/dbService');
jest.spyOn(Alert, 'alert');
jest.mock('expo-router', () => ({
	useRouter: jest.fn(),
}));

const renderWithAuthProvider = (component) => {
	return render(<AuthProvider>{component}</AuthProvider>);
};

describe('SignUp Component', () => {
	let routerMock;

	beforeEach(() => {
		routerMock = {
			replace: jest.fn(),
			navigate: jest.fn(),
		};
		useRouter.mockReturnValue(routerMock);
		jest.clearAllMocks();
	});

	it('renders the SignUp form correctly', () => {
		const { getByPlaceholderText, getByText } = renderWithAuthProvider(
			<SignUp />
		);
		expect(getByPlaceholderText('First Name')).toBeTruthy();
		expect(getByPlaceholderText('Last Name')).toBeTruthy();
		expect(getByPlaceholderText('Phone Number')).toBeTruthy();
		expect(getByPlaceholderText('Password')).toBeTruthy();
		expect(getByPlaceholderText('Confirm Password')).toBeTruthy();
		expect(getByText('Sign Up')).toBeTruthy();
	});

	it('shows an error if form fields are empty', async () => {
		const { getByText } = renderWithAuthProvider(<SignUp />);
		fireEvent.press(getByText('Sign Up'));

		await waitFor(() => {
			expect(Alert.alert).toHaveBeenCalledWith(
				expect.stringContaining('⚠️ Signup Error'),
				expect.any(String),
				expect.any(Array)
			);
		});
	});

	it('shows an error if passwords do not match', async () => {
		const { getByPlaceholderText, getByText } = renderWithAuthProvider(
			<SignUp />
		);

		fireEvent.changeText(getByPlaceholderText('First Name'), 'John');
		fireEvent.changeText(getByPlaceholderText('Last Name'), 'Doe');
		fireEvent.changeText(
			getByPlaceholderText('Phone Number'),
			'1234567890'
		);
		fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
		fireEvent.changeText(
			getByPlaceholderText('Confirm Password'),
			'password456'
		);

		fireEvent.press(getByText('Sign Up'));

		await waitFor(() => {
			expect(Alert.alert).toHaveBeenCalledWith(
				expect.stringContaining('⚠️ Signup Error'),
				expect.any(String),
				expect.any(Array)
			);
		});
	});

	it('shows an error if the API call fails', async () => {
		signupUser.mockRejectedValue({
			response: { data: { message: 'Sign-up failed' } },
		});

		const { getByPlaceholderText, getByText } = renderWithAuthProvider(
			<SignUp />
		);

		fireEvent.changeText(getByPlaceholderText('First Name'), 'John');
		fireEvent.changeText(getByPlaceholderText('Last Name'), 'Doe');
		fireEvent.changeText(
			getByPlaceholderText('Phone Number'),
			'1234567890'
		);
		fireEvent.changeText(getByPlaceholderText('Password'), 'Password1!');
		fireEvent.changeText(
			getByPlaceholderText('Confirm Password'),
			'Password1!'
		);

		fireEvent.press(getByText('Sign Up'));

		await waitFor(() => {
			expect(Alert.alert).toHaveBeenCalledWith(
				expect.stringContaining('⚠️ Signup Error'),
				expect.any(String),
				expect.any(Array)
			);
		});
	});

	it('navigates to the login screen when "Log In" is pressed', () => {
		const { getByText } = renderWithAuthProvider(<SignUp />);

		fireEvent.press(getByText('Log In'));

		expect(routerMock.navigate).toHaveBeenCalledWith('/login');
	});
});
