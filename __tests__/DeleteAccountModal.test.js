import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import DeleteAccountModal from '../app/components/DeleteAccountModal';

describe('Delete Account Modal', () => {
    let handleCancel, handleLogout, getByText;

    // Create mock functions
    beforeEach(() => {
        handleCancel = jest.fn();
        handleDeleteAccount = jest.fn();
        ({ getByText, getByRole } = render(
            <DeleteAccountModal showDeleteAccountModal={true} handleCancel={handleCancel} handleDeleteAccount={handleDeleteAccount} />
        ));
    });

    // Test if modal renders properly with the expected elements
    test('Delete account modal renders correctly when visible', () => {
        expect(getByText('Warning')).toBeTruthy();
        expect(getByText('Delete your account?')).toBeTruthy();
        expect(getByText('By deleting your account you will lose all your data. This action cannot be undone.')).toBeTruthy();
        expect(getByRole('button', { name: 'Cancel' })).toBeTruthy();
        expect(getByRole('button', { name: 'Delete' })).toBeTruthy();
    });

    // Test if clicking the Cancel button calls the handleCancel function
    test('Calls handleCancel when Cancel button is clicked', () => {
        fireEvent.press(getByRole('button', { name: 'Cancel' }));
        expect(handleCancel).toHaveBeenCalled();
    });

    // Test if clicking the Delete button calls the handleDeleteAccount function
    test('Calls handleDeleteAccount when Delete button is clicked', () => {
        fireEvent.press(getByRole('button', { name: 'Delete' }));
        expect(handleDeleteAccount).toHaveBeenCalled();
    });
});