const mongoose = require('mongoose');
const dotenv = require('dotenv');

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

module.exports = connectMongoDB;
