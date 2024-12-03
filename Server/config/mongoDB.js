import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI_VITA_VOICE_USER = process.env.MONGO_URI_VITA_VOICE_USER;
const MONGO_URI_VITA_VOICE_HEALTH = process.env.MONGO_URI_VITA_VOICE_HEALTH;

const connectMongoDB = () => {
	// Connection to User Data database
	const userDatabase = mongoose.createConnection(MONGO_URI_VITA_VOICE_USER);

	userDatabase.on('connected', () => {
		console.log('====================================');
		console.log('Connected to User MongoDB');
	});

	userDatabase.on('error', (error) => {
		console.error('Error connecting to User MongoDB:', error.message);
	});

	// Connection to Health Data database
	const healthDatabase = mongoose.createConnection(MONGO_URI_VITA_VOICE_HEALTH);

	healthDatabase.on('connected', () => {
		console.log('Connected to Health MongoDB');
		console.log('====================================');
	});

	healthDatabase.on('error', (error) => {
		console.error('Error connecting to Health MongoDB:', error.message);
	});

	return { userDatabase, healthDatabase };
};

export default connectMongoDB;
