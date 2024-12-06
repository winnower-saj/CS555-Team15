import express from 'express';
import jwt from 'jsonwebtoken';
import {
	createUser,
	deleteUserById,
	findUserById,
	findUserByPhoneNumber,
	storeRefreshToken,
	findRefreshToken,
	deleteRefreshToken,
	updateUserPassword,
	updateUserProfile,
	updateUserExpoToken,
} from '../helpers/dbHelpers.js';
const router = express.Router();
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

// Sign-up route
router.post('/signup', async (req, res) => {
	const { firstName, lastName, phoneNumber, password } = req.body;

	try {
		const existingUser = await findUserByPhoneNumber(phoneNumber);
		if (existingUser) {
			return res.status(400).json({
				message: 'User with this phone number already exists',
			});
		}

		const newUser = await createUser({
			firstName,
			lastName,
			phoneNumber,
			password,
		});

		const accessToken = generateAccessToken(newUser._id);
		const refreshToken = await createRefreshToken(newUser._id);

		return res.status(201).json({
			accessToken,
			refreshToken,
			userId: newUser._id,
			firstName: newUser.firstName,
			lastName: newUser.lastName,
			phoneNumber: newUser.phoneNumber,
		});
	} catch (error) {
		console.error('Error during sign-up:', error.message);
		return res.status(500).json({ message: 'Server error during sign-up' });
	}
});

// Login route
router.post('/login', async (req, res) => {
	const { phoneNumber, password } = req.body;

	try {
		const user = await findUserByPhoneNumber(phoneNumber);
		if (!user) {
			return res.status(400).json({ message: 'Invalid credentials' });
		}

		const isPasswordCorrect = await user.comparePassword(password);
		if (!isPasswordCorrect) {
			return res.status(400).json({ message: 'Invalid credentials' });
		}

		const accessToken = generateAccessToken(user._id);
		const refreshToken = await createRefreshToken(user._id);

		return res.status(200).json({
			accessToken,
			refreshToken,
			userId: user._id,
			firstName: user.firstName,
			lastName: user.lastName,
			phoneNumber: user.phoneNumber,
		});
	} catch (error) {
		console.error('Error during login:', error.message);
		return res.status(500).json({ message: 'Server error during login' });
	}
});

// Token refresh route
router.post('/token', async (req, res) => {
	const { token } = req.body;

	if (!token)
		return res.status(401).json({ message: 'Refresh token required' });

	try {
		const storedToken = await findRefreshToken(token);
		if (!storedToken || new Date() > storedToken.expiryDate) {
			return res
				.status(403)
				.json({ message: 'Invalid or expired refresh token' });
		}

		jwt.verify(token, REFRESH_TOKEN_SECRET, (err, decoded) => {
			if (err) {
				return res
					.status(403)
					.json({ message: 'Invalid refresh token' });
			}

			const newAccessToken = generateAccessToken(decoded.userId);
			return res.json({ accessToken: newAccessToken });
		});
	} catch (error) {
		console.error('Error during token refresh:', error.message);
		return res
			.status(500)
			.json({ message: 'Server error during token refresh' });
	}
});

// Logout route
router.post('/logout', async (req, res) => {
	const { token } = req.body;

	try {
		await deleteRefreshToken(token);
		return res
			.status(200)
			.json({ message: 'User successfully logged out.' });
	} catch (error) {
		console.error('Error during logout:', error.message);
		return res.status(500).json({ message: 'Server error during logout' });
	}
});

// Delete user route
router.delete('/delete', async (req, res) => {
	const { userId, token } = req.body;

	try {
		const user = await findUserById(userId);

		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		await deleteUserById(userId);
		await deleteRefreshToken(token);

		return res
			.status(200)
			.json({ message: 'User account deleted successfully.' });
	} catch (error) {
		console.error('Error deleting user account', error.message);
		return res
			.status(500)
			.json({ message: 'Server error during deleting user account' });
	}
});

// Update user route
router.patch('/update-profile', async (req, res) => {
	const { userId, firstName, lastName, phoneNumber } = req.body;

	try {
		const user = await findUserById(userId);

		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		const updatedUser = await updateUserProfile(
			userId,
			firstName,
			lastName,
			phoneNumber
		);

		res.status(200).json(updatedUser);
	} catch (error) {
		console.error('Error during user profile update', error.message);
		return res
			.status(500)
			.json({ message: 'Server error during user profile update' });
	}
});

// Password update route
router.patch('/update-password', async (req, res) => {
	const { userId, currentPassword, newPassword } = req.body;
	try {
		const user = await findUserById(userId);
		const isPasswordCorrect = user.comparePassword(currentPassword);
		if (isPasswordCorrect) {
			const result = await updateUserPassword(
				isPasswordCorrect,
				user.phoneNumber,
				newPassword
			);
			return res.status(200).json(result);
		} else throw new Error('Password is incorrect');
	} catch (error) {
		console.error('Error during password update:', error.message);
		return res
			.status(500)
			.json({ message: 'Server error during password update' });
	}
});

// Update expoPushToken route
router.post('/save-token', async (req, res) => {
	const { userId, expoPushToken } = req.body;

	if (!userId || !expoPushToken) {
		return res
			.status(400)
			.json({ message: 'userId and expoPushToken are required' });
	}

	try {
		// Find the user and update or create the record
		const user = await updateUserExpoToken(userId, expoPushToken);

		res.status(200).json({
			message: 'Push token saved successfully',
			user,
		});
	} catch (error) {
		console.error('Error saving push token:', error.message, error);
		res.status(500).json({ message: 'Server error', error: error.message });
	}
});

// Helper functions for generating tokens
function generateAccessToken(userId) {
	return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '15m' });
}

async function createRefreshToken(userId) {
	const refreshToken = jwt.sign({ userId }, REFRESH_TOKEN_SECRET, {
		expiresIn: '7d',
	});

	const expiryDate = new Date();
	expiryDate.setDate(expiryDate.getDate() + 7);

	const tokenData = { userId, token: refreshToken, expiryDate };
	await storeRefreshToken(tokenData);

	return refreshToken;
}

export default router;
