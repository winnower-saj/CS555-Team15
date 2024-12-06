import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { isValidPhoneNumber } from 'libphonenumber-js';

const userSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			required: [true, 'First name is required'],
			trim: true,
			minLength: [2, 'First name must be at least 2 characters long'],
			match: [/^[a-zA-Z]+$/, 'First name can only contain letters'],
		},
		lastName: {
			type: String,
			required: [true, 'Last name is required'],
			trim: true,
			minLength: [2, 'Last name must be at least 2 characters long'],
			match: [/^[a-zA-Z]+$/, 'Last name can only contain letters'],
		},
		phoneNumber: {
			type: String,
			required: [true, 'Phone number is required'],
			unique: true,
			validate: {
				validator: function (phoneNumber) {
					return isValidPhoneNumber(phoneNumber, 'US');
				},
				message: 'Please provide a valid phone number',
			},
		},
		password: {
			type: String,
			required: [true, 'Password is required'],
			minLength: [8, 'Password must be at least 8 characters long'],
			match: [
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
				'Password must be at least 8 characters long ' +
					'and contain a mix of uppercase, lowercase, numbers, and special characters',
			],
		},
		expoPushToken: { type: String },
	},
	{ timestamps: true }
);

// Hash the password before saving
userSchema.pre('save', async function (next) {
	const user = this;

	if (user.isModified('password')) {
		const salt = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(user.password, salt);
	}

	next();
});

// Add a method to compare passwords
userSchema.methods.comparePassword = async function (enteredPassword) {
	return bcrypt.compare(enteredPassword, this.password);
};

export const UserModel = (userDatabase) =>
	userDatabase.model('User', userSchema);
