import dotenv from 'dotenv';
import app from './app.js';
import connectMongoDB from './config/mongoDB.js';

dotenv.config();

const HOST = '192.168.1.202';
const PORT = process.env.PORT || 3000;

const startServer = async () => {
	try {
		// Connect to MongoDB
		await connectMongoDB();

		// Start the server
		app.listen(PORT, HOST, () => {
			console.log(`Server running on port ${PORT}`);
		});
	} catch (error) {
		console.error('Error starting server:', error.message);
		process.exit(1); // Exit the process with an error code
	}
};

startServer();
