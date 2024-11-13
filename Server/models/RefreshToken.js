import mongoose from 'mongoose';

const refreshTokenSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	token: {
		type: String,
		required: true,
	},
	expiryDate: {
		type: Date,
		required: true,
	},
});

export default mongoose.model('RefreshToken', refreshTokenSchema);
