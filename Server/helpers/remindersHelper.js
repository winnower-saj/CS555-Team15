import amqp from 'amqplib';
import dotenv from 'dotenv';

dotenv.config();

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';
const EXCHANGE_NAME = 'delayed_exchange'; // Delayed exchange name

// Publish a single reminder with delay
async function publishReminder(reminder, delayMs, notificationType) {
	const connection = await amqp.connect(RABBITMQ_URL);
	const channel = await connection.createChannel();

	// Declare the delayed exchange
	await channel.assertExchange(EXCHANGE_NAME, 'x-delayed-message', {
		durable: true,
		arguments: { 'x-delayed-type': 'direct' },
	});

	const reminderData = {
		userId: reminder.userId,
		title: reminder.title,
		description: reminder.description,
		time: reminder.time,
		notificationType, // "day-before" or "three-hours"
	};

	// Publish the reminder to the delayed exchange
	channel.publish(
		EXCHANGE_NAME,
		'reminders', // Routing key
		Buffer.from(JSON.stringify(reminderData)),
		{
			headers: { 'x-delay': delayMs }, // Delay in milliseconds
		}
	);

	console.log(
		`Scheduled ${notificationType} notification for reminder: ${reminder.title}`
	);
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

	// Schedule both notifications
	await publishReminder(reminder, dayBeforeDelay, 'day-before');
	await publishReminder(reminder, threeHoursDelay, 'three-hours');
	await publishReminder(reminder, testNotificationDelay, 'test-notification');
}
