import bcrypt from 'bcryptjs';
import { UserModel } from '../models/User.js';
import { RefreshTokenModel } from '../models/RefreshToken.js';
import { ConversationModel } from '../models/Conversation.js';
import { AppointmentModel } from '../models/Appointment.js';
import { MedicationModel } from '../models/Medication.js';
import connectMongoDB from '../config/mongoDB.js';

const { userDatabase, healthDatabase } = connectMongoDB();
const User = UserModel(userDatabase);
const RefreshToken = RefreshTokenModel(userDatabase);
const Conversation = ConversationModel(healthDatabase);
const Appointment = AppointmentModel(healthDatabase);
const Medication = MedicationModel(healthDatabase);

// Find user by phone number
const findUserByPhoneNumber = async (phoneNumber) => {
	try {
		// Find an existing user with their phone number
		const user = await User.findOne({ phoneNumber });

		return user;
	} catch (error) {
		throw new Error('Error finding user by phone number: ' + error.message);
	}
};

// Create a new user
const createUser = async (userData) => {
	try {
		// Create a user object
		const newUser = new User(userData);

		// Save the new user
		await newUser.save();

		return newUser;
	} catch (error) {
		throw new Error('Error creating user: ' + error.message);
	}
};

// Find user by userId
const findUserById = async (userId) => {
	try {
		// Find an existing user
		const user = await User.findById(userId);

		if (!user) {
			throw new Error('User not found');
		}

		return user;
	} catch (error) {
		throw new Error('Error finding user by userId: ' + error.message);
	}
};

// Delete a user by userId
const deleteUserById = async (userId) => {
	try {
		// Find and delete an existing user
		const deletedUser = await User.findByIdAndDelete(userId);

		if (!deletedUser) {
			throw new Error('User not found');
		}

		return deletedUser;
	} catch (error) {
		throw new Error('Error deleting user: ' + error.message);
	}
};

// Store a refresh token
const storeRefreshToken = async (tokenData) => {
	try {
		// Create a refresh token object
		const newToken = new RefreshToken(tokenData);

		// Save the new refresh token
		await newToken.save();

		return newToken;
	} catch (error) {
		throw new Error('Error storing refresh token: ' + error.message);
	}
};

// Find refresh token in the database
const findRefreshToken = async (token) => {
	try {
		// Find an existing refresh token
		const refreshToken = await RefreshToken.findOne({ token });

		if (!refreshToken) {
			throw new Error('Refresh token not found');
		}

		return refreshToken;
	} catch (error) {
		throw new Error('Error finding refresh token: ' + error.message);
	}
};

// Delete refresh token
const deleteRefreshToken = async (token) => {
	try {
		// Delete an existing refresh token
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

		// Find and update user details
		const updatedUser = await User.findByIdAndUpdate(userId, updatedInfo, {
			new: true
		});

		if (!updatedUser) {
			throw new Error('User not found');
		}

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

		if (!user) {
			throw new Error('User not found');
		}

		if (!isPasswordCorrect) {
			throw new Error('Invalid current password');
		} else {
			const hashedPassword = await bcrypt.hash(newPassword, 12);
			user.password = hashedPassword;
		}

		await user.save();
		return 'Password successfully updated!';
	} catch (error) {
		throw new Error('Error updating password: ' + error.message);
	}
};

// Save a new conversation
const saveConversation = async (userId, assistantText, userText, emotion) => {
	try {
		let conversation = await Conversation.findOne({ userId });

		if (!conversation) {
			// Create a conversation object
			conversation = new Conversation({
				userId,
				messages: [{
					assistantText,
					userText,
					emotion,
				}],
			});
		} else {
			// Push the new message
			conversation.messages.push({
				assistantText,
				userText,
				emotion,
			});
		}

		// Save the new conversation
		await conversation.save();

		return conversation;
	} catch (error) {
		throw new Error('Error saving conversation: ' + error.message);
	}
};

// Create a new appointment
const createAppointment = async (userId, title, details, date, time) => {
	try {
		// Create an appointment object
		const newAppointment = new Appointment({ userId, title, details, date, time });

		// Save the new appointment
		await newAppointment.save();

		return newAppointment;
	} catch (error) {
		throw new Error('Error creating appointment: ' + error.message);
	}
};

// Save a new medication
const saveMedication = async (userId, name, details, date, time) => {
	try {
		// Create a medication object
		const newMedication = new Medication({ userId, name, details, date, time });

		// Save the new medication
		await newMedication.save();

		return newMedication;
	} catch (error) {
		throw new Error('Error adding medication: ' + error.message);
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
	saveConversation,
	createAppointment,
	saveMedication
};
