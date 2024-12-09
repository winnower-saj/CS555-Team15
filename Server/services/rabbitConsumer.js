import amqp from 'amqplib';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const RABBITMQ_URL = process.env.RABBITMQ_URL;
const QUEUE_NAME = process.env.RABBITMQ_NOTIFICCATION_QUEUE; // Queue for notifications
const EXCHANGE_NAME = 'delayed_exchange'; // Delayed exchange name

// Function to send push notification via Expo API
const sendPushNotification = async (expoPushToken, title, body) => {
	const message = {
		to: expoPushToken,
		sound: 'default',
		title,
		body,
		data: { title, body },
	};

	try {
		const response = await axios.post(
			'https://exp.host/--/api/v2/push/send',
			message
		);
		console.log('Notification sent:', response.data);
	} catch (error) {
		console.error('Error sending push notification:', error.message);
	}
};

// Function to handle reminder messages
const handleReminderMessage = async (message) => {
	try {
		const reminder = JSON.parse(message.content.toString());
		console.log('Processing reminder:', reminder);

		const { expoPushToken, title, details, notificationType } = reminder;

		if (!expoPushToken) {
			console.error('Missing expoPushToken, skipping notification.');
			return;
		}

		// Send the notification
		const body =
			notificationType === 'day-before'
				? `Friendly reminder: ${title} is scheduled for tomorrow! Take care and see you soon.`
				: notificationType === 'three-hours'
				? `Friendly reminder: ${title} is scheduled in 3 hours! Take care and see you soon.`
				: `Friendly reminder: ${title} is scheduled for tomorrow! Take care and see you soon.`;

		await sendPushNotification(expoPushToken, title, body);
		console.log(
			`Notification for "${title}" (${notificationType}) sent successfully.`
		);
	} catch (error) {
		console.error('Error processing reminder:', error.message);
	}
};

// Start RabbitMQ Consumer
const startConsumer = async () => {
	try {
		const connection = await amqp.connect(RABBITMQ_URL);
		const channel = await connection.createChannel();

		// Assert the delayed exchange and bind the queue
		await channel.assertExchange(EXCHANGE_NAME, 'x-delayed-message', {
			durable: true,
			arguments: { 'x-delayed-type': 'direct' },
		});
		await channel.assertQueue(QUEUE_NAME, { durable: true });
		await channel.bindQueue(QUEUE_NAME, EXCHANGE_NAME, QUEUE_NAME);

		console.log(`Listening for messages on queue: ${QUEUE_NAME}`);

		// Consume messages from the queue
		channel.consume(
			QUEUE_NAME,
			async (message) => {
				if (message !== null) {
					await handleReminderMessage(message);
					channel.ack(message); // Acknowledge message after processing
				}
			},
			{ noAck: false }
		);
	} catch (error) {
		console.error('Error starting RabbitMQ consumer:', error.message);
	}
};

export default startConsumer;
