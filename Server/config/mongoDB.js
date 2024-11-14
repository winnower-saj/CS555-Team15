import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectMongoDB = async () => {
	const MONGO_URI = process.env.MONGO_URI;

	try {
		await mongoose.connect(MONGO_URI);
		console.log('Connected to MongoDB');
	} catch (error) {
		console.error('Error connecting to MongoDB:', error.message);
		throw new Error('MongoDB connection failed');
	}
};

export default connectMongoDB;
