import dotenv from 'dotenv';
import app from './app.js';

dotenv.config();

const HOST = process.env.HOST;
const PORT = process.env.PORT || 3000;

const startServer = async () => {
	try {
		// Start the server
		app.listen(PORT, HOST, () => {
			console.log('====================================');
			console.log(`Server running on port ${PORT}`);
			console.log('====================================');
		});
	} catch (error) {
		console.error('Error starting server:', error.message);
		process.exit(1);
	}
};

startServer();
