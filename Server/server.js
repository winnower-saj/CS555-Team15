import dotenv from 'dotenv';
import app from './app.js';
import startRabbitConsumer from './services/rabbitConsumer.js';

dotenv.config();

const HOST = process.env.HOST || '0.0.0.0'; // Default to 0.0.0.0 if HOST is not provided
const PORT = process.env.PORT || 3000;

const startServer = async () => {
	try {
		// Start the server
		app.listen(PORT, HOST, () => {
			console.log('====================================');
			console.log(`Server running on http://${HOST}:${PORT}`);
			console.log('====================================');
		});

		// Start the RabbitMQ consumer
		console.log('Starting RabbitMQ Consumer...');
		await startRabbitConsumer();
		console.log('RabbitMQ Consumer started successfully.');
	} catch (error) {
		console.error(
			'Error starting server or RabbitMQ Consumer:',
			error.message
		);
		process.exit(1); // Exit process if there is a critical error
	}
};

startServer();
