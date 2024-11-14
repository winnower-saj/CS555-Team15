const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const bcrypt = require('bcryptjs');

// Find user by phone number
const findUserByPhoneNumber = async (phoneNumber) => {
	try {
		return await User.findOne({ phoneNumber });
	} catch (error) {
		throw new Error('Error finding user by phone number: ' + error.message);
	}
};

// Create a new user
const createUser = async (userData) => {
	try {
		const newUser = new User(userData);
		await newUser.save();
		return newUser;
	} catch (error) {
		throw new Error('Error creating user: ' + error.message);
	}
};

// Find user by userId
const findUserById = async (userId) => {
	try {
		return await User.findById(userId);
	} catch (error) {
		throw new Error('Error finding user by userId: ' + error.message);
	}
};

// Delete a user by userId
const deleteUserById = async (userId) => {
	try {
		await User.findByIdAndDelete(userId);
	} catch (error) {
		throw new Error('Error deleting user: ' + error.message);
	}
};

// Store a refresh token
const storeRefreshToken = async (tokenData) => {
	try {
		const newToken = new RefreshToken(tokenData);
		await newToken.save();
		return newToken;
	} catch (error) {
		throw new Error('Error storing refresh token: ' + error.message);
	}
};

// Find refresh token in the database
const findRefreshToken = async (token) => {
	try {
		return await RefreshToken.findOne({ token });
	} catch (error) {
		throw new Error('Error finding refresh token: ' + error.message);
	}
};

// Delete refresh token
const deleteRefreshToken = async (token) => {
	try {
		await RefreshToken.deleteOne({ token });
	} catch (error) {
		throw new Error('Error deleting refresh token: ' + error.message);
	}
};

//To Update Password by UserID
const updateUserPassword = async (isPasswordCorrect, phoneNumber, newPassword) => {
	try {
		const user = await User.findOne({ phoneNumber });
		if (!isPasswordCorrect) 
			throw new Error('Invalid current password');
		else
		{
			const hashedPassword = await bcrypt.hash(newPassword,12);
			user.password = hashedPassword;
		}
		await user.save();
		return "Password successfully updated!";
	} catch (error) {
		throw new Error('Error updating password: ' + error.message);
	}
};

module.exports = {
	findUserByPhoneNumber,
	createUser,
	deleteUserById,
	findUserById,
	storeRefreshToken,
	findRefreshToken,
	deleteRefreshToken,
	updateUserPassword,
};
