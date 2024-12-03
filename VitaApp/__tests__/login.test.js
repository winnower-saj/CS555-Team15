import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Login from '../app/login';
import { Alert } from 'react-native';
import { useAuth } from '../context/authContext';
import { useRouter } from 'expo-router';
import { loginUser, refreshAccessToken } from '../services/dbService';

// Mock the modules and components
jest.mock('expo-router', () => ({
    useRouter: jest.fn(),
}));

jest.mock('../services/dbService', () => ({
    loginUser: jest.fn(),
}));

jest.mock('../context/authContext', () => ({
    useAuth: jest.fn(),
}));

describe('Login Component', () => {
    let mockLogin;
    let mockRouter;

    beforeEach(() => {
        mockLogin = jest.fn();
        mockRouter = {
            replace: jest.fn(),
            navigate: jest.fn(),
        };

        useAuth.mockReturnValue({ login: mockLogin });
        useRouter.mockReturnValue(mockRouter);

        jest.spyOn(Alert, 'alert').mockImplementation(jest.fn());
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('Login form renders correctly', () => {
        const { getByPlaceholderText, getByText, getByTestId, getByRole } = render(<Login />);

        expect(getByText('Welcome Back!')).toBeTruthy();
        expect(getByText("We're glad to see you again!")).toBeTruthy();
        expect(getByTestId('login-heading')).toBeTruthy();
        expect(getByPlaceholderText('Phone Number')).toBeTruthy();
        expect(getByPlaceholderText('Password')).toBeTruthy();
        expect(getByText('Forgot Password?')).toBeTruthy();
        expect(getByRole('button', { name: 'Log In' })).toBeTruthy();
        expect(getByText("Don't have an account?")).toBeTruthy();
        expect(getByText('Sign Up')).toBeTruthy();
    });

    test('Navigate to Forgot Password screen when clicked', () => {
        const { getByText } = render(<Login />);

        fireEvent.press(getByText('Forgot Password?'));

        expect(mockRouter.navigate).toHaveBeenCalledWith('/forgot-password');
    });

    test('Navigate to Sign Up screen when clicked', () => {
        const { getByText } = render(<Login />);

        fireEvent.press(getByText('Sign Up'));

        expect(mockRouter.navigate).toHaveBeenCalledWith('/signup');
    });
});