import express from 'express';
const router = express.Router();
import dotenv from 'dotenv';
import { createAppointment } from '../helpers/dbHelpers.js';
import { scheduleReminders } from '../helpers/remindersHelper.js';

dotenv.config();

router.post('/appointments', async (req, res) => {
	const { userId, title, details, time, expoPushToken } = req.body;

	try {
		if (!userId || !title || !time || !expoPushToken) {
			return res.status(400).json({ message: 'Missing required fields' });
		}

		// Save the reminder to the database
		const reminder = await createAppointment(userId, title, details, time);
		reminder.expoPushToken = expoPushToken;

		// Schedule reminders with RabbitMQ
		await scheduleReminders(reminder);

		res.status(201).json({
			message: 'Reminder created and scheduled successfully',
			reminder,
		});
	} catch (error) {
		console.error('Error creating reminder:', error.message);
		res.status(500).json({ message: 'Server error', error: error.message });
	}
});

export default router;
