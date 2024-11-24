import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Medication from '../models/Medication.js';
import Appointment from '../models/Medication.js';
import Conversation from '../models/Conversation.js';
import RefreshToken from '../models/RefreshToken.js';

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

// Update user profile
const updateUserProfile = async (
	userId,
	firstName,
	lastName,
	phoneNumber
) => {
	try {
		const updatedInfo = {};

		if (firstName) {
			updatedInfo.firstName = firstName;
		}

		if (lastName) {
			updatedInfo.lastName = lastName;
		}

		if (phoneNumber) {
			updatedInfo.phoneNumber = phoneNumber;
		}

		const updatedUser = await User.findByIdAndUpdate(userId, updatedInfo, {
			new: true
		});

		return updatedUser;

	} catch (error) {
		throw new Error('Error updating user profile: ' + error.message);
	}
};

//To Update Password by UserID
const updateUserPassword = async (
	isPasswordCorrect,
	phoneNumber,
	newPassword
) => {
	try {
		const user = await User.findOne({ phoneNumber });
		if (!isPasswordCorrect) throw new Error('Invalid current password');
		else {
			const hashedPassword = await bcrypt.hash(newPassword, 12);
			user.password = hashedPassword;
		}
		await user.save();
		return 'Password successfully updated!';
	} catch (error) {
		throw new Error('Error updating password: ' + error.message);
	}
};

// Add new medication
const addMedication = async (userId, date, time, about) => {
	try {
		const medication = new Medication({ userId, date, time, about });
		await medication.save();
		return medication;
	} catch (error) {
		throw new Error('Error adding medication: ' + error.message);
	}
};

// Add appointment
const addAppointment = async (userId, date, time, about) => {
	try {
		const appointment = new Appointment({ userId, date, time, about });
		await appointment.save();
		return appointment;
	} catch (error) {
		throw new Error('Error adding appointment: ' + error.message);
	}
};

// Add conversation
const addConversation = async (userId, userText, assistantText, emotion) => {
	try {
		const conversation = new Conversation({ userId, userText, assistantText, emotion });
		await conversation.save();
		return conversation;
	} catch (error) {
		throw new Error('Error adding conversation: ' + error.message);
	}
};

export {
	findUserByPhoneNumber,
	createUser,
	deleteUserById,
	findUserById,
	storeRefreshToken,
	findRefreshToken,
	deleteRefreshToken,
	updateUserProfile,
	updateUserPassword,
	addMedication,
	addAppointment,
	addConversation
};
