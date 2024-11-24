import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Connection to User database
const connectUserMongoDB = async () => {
	const MONGO_URI_USER = process.env.MONGO_URI_USER;

	try {
		await mongoose.connect(MONGO_URI_USER);
		console.log('Connected to User MongoDB');
	} catch (error) {
		console.error('Error connecting to User MongoDB:', error.message);
		throw new Error('User MongoDB connection failed');
	}
};

// Connection to Voice Data database
const connectVoiceMongoDB = async () => {
	const MONGO_URI_VOICE = process.env.MONGO_URI_VOICE;

	try {
		await mongoose.connect(MONGO_URI_VOICE, {
			ssl: true,
			sslValidate: true,
		});
		console.log('Connected to Voice MongoDB');
	} catch (error) {
		console.error('Error connecting to Voice MongoDB:', error.message);
		throw new Error('Voice MongoDB connection failed');
	}
};

export { connectUserMongoDB, connectVoiceMongoDB };
