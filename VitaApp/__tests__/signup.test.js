import React from 'react';
import axios from 'axios';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import SignUp from '../app/signup';
import { useRouter } from 'expo-router';
import { AuthProvider } from '../context/authContext';

const mockedConfig = {
	API_URL: 'mocked-api-url',
};

jest.mock('axios');
jest.mock('@react-native-async-storage/async-storage', () => ({
	setItem: jest.fn(() => Promise.resolve()),
	getItem: jest.fn(() => Promise.resolve(null)),
	removeItem: jest.fn(() => Promise.resolve()),
	clear: jest.fn(() => Promise.resolve()),
	getAllKeys: jest.fn(() => Promise.resolve([])),
}));

jest.spyOn(Alert, 'alert');

jest.mock('expo-router', () => ({
	useRouter: jest.fn(),
}));

jest.mock('react-native-config', () => ({
	Config: mockedConfig,
}));

const renderWithAuthProvider = (component) => {
	return render(<AuthProvider>{component}</AuthProvider>);
};

describe('SignUp Component', () => {
	let routerMock;

	beforeEach(() => {
		routerMock = {
			push: jest.fn(),
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
		expect(getByPlaceholderText('Phone number')).toBeTruthy();
		expect(getByPlaceholderText('Password')).toBeTruthy();
		expect(getByPlaceholderText('Confirm Password')).toBeTruthy();
		expect(getByText('Sign Up')).toBeTruthy();
	});

	it('shows an error if form fields are empty', async () => {
		const { getByText } = renderWithAuthProvider(<SignUp />);
		fireEvent.press(getByText('Sign Up'));

		await waitFor(() => {
			expect(Alert.alert).toHaveBeenCalledWith(
				'Error',
				'Please correct the highlighted fields'
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
			getByPlaceholderText('Phone number'),
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
				'Error',
				'Please correct the highlighted fields'
			);
		});
	});

	// it('makes an API call with correct data when form is valid', async () => {
	// 	axios.post.mockResolvedValue({ status: 201 });

	// 	const { getByPlaceholderText, getByText } = renderWithAuthProvider(
	// 		<SignUp />
	// 	);

	// 	fireEvent.changeText(getByPlaceholderText('First Name'), 'John');
	// 	fireEvent.changeText(getByPlaceholderText('Last Name'), 'Doe');
	// 	fireEvent.changeText(
	// 		getByPlaceholderText('Phone number'),
	// 		'1234567890'
	// 	);
	// 	fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
	// 	fireEvent.changeText(
	// 		getByPlaceholderText('Confirm Password'),
	// 		'password123'
	// 	);

	// 	fireEvent.press(getByText('Sign Up'));

	// 	await waitFor(() => {
	// 		expect(axios.post).toHaveBeenCalledWith(
	// 			`${mockedConfig.API_URL}/auth/signup`,
	// 			{
	// 				firstName: 'John',
	// 				lastName: 'Doe',
	// 				phoneNumber: '1234567890',
	// 				password: 'password123',
	// 			}
	// 		);
	// 	});
	// });

	it('shows an error if the API call fails', async () => {
		axios.post.mockRejectedValue({
			response: { data: 'Sign-up failed' },
		});

		const { getByPlaceholderText, getByText } = renderWithAuthProvider(
			<SignUp />
		);

		fireEvent.changeText(getByPlaceholderText('First Name'), 'John');
		fireEvent.changeText(getByPlaceholderText('Last Name'), 'Doe');
		fireEvent.changeText(
			getByPlaceholderText('Phone number'),
			'1234567890'
		);
		fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
		fireEvent.changeText(
			getByPlaceholderText('Confirm Password'),
			'password123'
		);

		fireEvent.press(getByText('Sign Up'));

		await waitFor(() => {
			expect(Alert.alert).toHaveBeenCalledWith(
				'Error',
				'Failed to create account. Please try again.'
			);
		});
	});

	it('navigates to the login screen when "Log In" is pressed', () => {
		const { getByText } = renderWithAuthProvider(<SignUp />);

		fireEvent.press(getByText('Log In'));

		expect(routerMock.navigate).toHaveBeenCalledWith('/login');
	});
});
