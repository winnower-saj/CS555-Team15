import amqp from 'amqplib';
import dotenv from 'dotenv';

dotenv.config();

const RABBITMQ_URL = process.env.RABBITMQ_URL;
const EXCHANGE_NAME = 'delayed_exchange'; // Delayed exchange name

// Publish a single reminder with delay
async function publishReminder(reminder, delayMs, notificationType) {
	try {
		const connection = await amqp.connect(RABBITMQ_URL);
		console.log('Connected to RabbitMQ successfully!');
		await connection.close();
	} catch (error) {
		console.error('Failed to connect to RabbitMQ:', error.message);
	}
	const connection = await amqp.connect(RABBITMQ_URL);
	const channel = await connection.createChannel();

	// Declare the delayed exchange
	await channel.assertExchange(EXCHANGE_NAME, 'x-delayed-message', {
		durable: true,
		arguments: { 'x-delayed-type': 'direct' }, // Type of routing
	});

	// Ensure the queue exists and is bound to the exchange
	await channel.assertQueue(process.env.RABBITMQ_NOTIFICCATION_QUEUE, {
		durable: true,
	});
	await channel.bindQueue(
		process.env.RABBITMQ_NOTIFICCATION_QUEUE,
		EXCHANGE_NAME,
		process.env.RABBITMQ_NOTIFICCATION_QUEUE
	);

	const reminderData = {
		userId: reminder.userId,
		title: reminder.title,
		description: reminder.description,
		time: reminder.time,
		expoPushToken: reminder.expoPushToken,
		notificationType, // "day-before" or "three-hours"
	};

	// Publish the reminder to the delayed exchange
	channel.publish(
		EXCHANGE_NAME,
		process.env.RABBITMQ_NOTIFICCATION_QUEUE, // Routing key
		Buffer.from(JSON.stringify(reminderData)),
		{
			headers: { 'x-delay': delayMs }, // Delay in milliseconds
		}
	);

	console.log(
		`Scheduled ${notificationType} notification for reminder: ${reminder.title}`
	);

	// Close channel and connection
	await channel.close();
	await connection.close();
}

// Schedule both "day-before" and "three-hours" notifications
export async function scheduleReminders(reminder) {
	const currentTime = Date.now();
	const reminderTime = new Date(reminder.time).getTime();

	// Calculate delays for notifications
	const dayBeforeDelay = Math.max(
		0,
		reminderTime - 24 * 60 * 60 * 1000 - currentTime
	);
	const threeHoursDelay = Math.max(
		0,
		reminderTime - 3 * 60 * 60 * 1000 - currentTime
	);

	// For testing purposes, add a 30-second notification
	const testNotificationDelay = 30 * 1000; // 30 seconds

	// Schedule notifications
	await publishReminder(reminder, dayBeforeDelay, 'day-before');
	await publishReminder(reminder, threeHoursDelay, 'three-hours');
	await publishReminder(reminder, testNotificationDelay, 'test-notification');
}
