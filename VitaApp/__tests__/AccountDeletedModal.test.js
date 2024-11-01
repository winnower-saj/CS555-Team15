import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import AccountDeletedModal from '../app/components/AccountDeletedModal';

describe('Delete Account Modal', () => {
    let handleClose, getByText;

    // Create mock functions
    beforeEach(() => {
        handleClose = jest.fn();
        ({ getByText, getByRole } = render(
            <AccountDeletedModal showAccountDeletedModal={true} handleClose={handleClose} />
        ));
    });

    // Test if modal renders properly with the expected elements
    test('Account deleted modal renders correctly when visible', () => {
        expect(getByText('Success')).toBeTruthy();
        expect(getByText('Successfully!')).toBeTruthy();
        expect(getByText('Your account has been successfully deleted. We\'re sorry to see you go.')).toBeTruthy();
        expect(getByRole('button', { name: 'Close' })).toBeTruthy();
    });

    // Test if clicking the Close button calls the handleClose function
    test('Calls handleClose when Close button is clicked', () => {
        fireEvent.press(getByRole('button', { name: 'Close' }));
        expect(handleClose).toHaveBeenCalled();
    });
});