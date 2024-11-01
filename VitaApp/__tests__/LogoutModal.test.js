import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import LogoutModal from '../app/components/LogoutModal';

describe('Logout Modal', () => {
    let handleCancel, handleLogout, getByText;

    // Create mock functions
    beforeEach(() => {
        handleCancel = jest.fn();
        handleLogout = jest.fn();
        ({ getByText, getByRole, getByTestId } = render(
            <LogoutModal showLogoutModal={true} handleCancel={handleCancel} handleLogout={handleLogout} />
        ));
    });

    // Test if modal renders properly with the expected elements
    test('Logout modal renders correctly when visible', () => {
        expect(getByTestId('logout-heading')).toBeTruthy();
        expect(getByText('Are you sure you want to logout?')).toBeTruthy();
        expect(getByRole('button', { name: 'Cancel' })).toBeTruthy();
        expect(getByRole('button', { name: 'Logout' })).toBeTruthy();
    });

    // Test if clicking the Cancel button calls the handleCancel function
    test('Calls handleCancel when Cancel button is clicked', () => {
        fireEvent.press(getByRole('button', { name: 'Cancel' }));
        expect(handleCancel).toHaveBeenCalled();
    });

    // Test if clicking the Logout button calls the handleLogout function
    test('Calls handleLogout when Logout button is clicked', () => {
        fireEvent.press(getByRole('button', { name: 'Logout' }));
        expect(handleLogout).toHaveBeenCalled();
    });
});