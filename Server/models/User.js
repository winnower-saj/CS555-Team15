import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			required: true,
			trim: true,
		},
		lastName: {
			type: String,
			required: true,
			trim: true,
		},
		phoneNumber: {
			type: String,
			required: true,
			unique: true,
			match: [/^\d{10}$/, 'Phone number must be 10 digits'],
		},
		password: {
			type: String,
			required: true,
		},
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

export default mongoose.model('User', userSchema);
