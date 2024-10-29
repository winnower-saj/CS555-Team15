const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
	createUser,
	deleteUser,
	findUserByPhoneNumber,
	storeRefreshToken,
	findRefreshToken,
	deleteRefreshToken,
} = require('../helpers/dbHelpers.js');
const router = express.Router();
const dotenv = require('dotenv');

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

		const hashedPassword = await bcrypt.hash(password, 12);
		const newUser = await createUser({
			firstName,
			lastName,
			phoneNumber,
			password: hashedPassword,
		});

		const accessToken = generateAccessToken(newUser._id);
		const refreshToken = await createRefreshToken(newUser._id);

		res.status(201).json({
			accessToken,
			refreshToken,
			userId: newUser._id,
			firstName: user.firstName,
			lastName: user.lastName,
			phoneNumber: user.phoneNumber,
		});
	} catch (error) {
		console.error('Error during sign-up:', error.message);
		res.status(500).json({ message: 'Server error during sign-up' });
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

		const isPasswordCorrect = user.comparePassword(password);
		if (!isPasswordCorrect) {
			return res.status(400).json({ message: 'Invalid credentials' });
		}

		const accessToken = generateAccessToken(user._id);
		const refreshToken = await createRefreshToken(user._id);

		res.status(200).json({
			accessToken,
			refreshToken,
			userId: user._id,
			firstName: user.firstName,
			lastName: user.lastName,
			phoneNumber: user.phoneNumber,
		});
	} catch (error) {
		console.error('Error during login:', error.message);
		res.status(500).json({ message: 'Server error during login' });
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
			if (err)
				return res
					.status(403)
					.json({ message: 'Invalid refresh token' });

			const newAccessToken = generateAccessToken(decoded.userId);
			res.json({ accessToken: newAccessToken });
		});
	} catch (error) {
		console.error('Error during token refresh:', error.message);
		res.status(500).json({ message: 'Server error during token refresh' });
	}
});

// Logout route
router.post('/logout', async (req, res) => {
	const { token } = req.body;

	try {
		await deleteRefreshToken(token);
		res.status(204).send();
	} catch (error) {
		console.error('Error during logout:', error.message);
		res.status(500).json({ message: 'Server error during logout' });
	}
});

// Delete user route
router.delete('/delete', async (req, res) => {
	const { userId, token } = req.body;

	try {
		const user = await findUserByPhoneNumber(userId);

		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		await deleteUser(userId);
		await deleteRefreshToken(token);

		res.status(204).send();
	} catch (error) {
		console.error('Error during user deletion', error.message);
		res.status(500).json({ message: 'Server error during user deletion' });
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

module.exports = router;
