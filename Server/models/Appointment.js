import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		details: {
			type: String,
			required: true,
		},
		// date: {
		// 	type: Date,
		// 	required: true,
		// },
		// time: {
		// 	type: String,
		// 	required: true,
		// },
		time: { type: Date, required: true },
		// isDayBeforeSent: { type: Boolean, default: false },
		// isThreeHoursBeforeSent: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

export const AppointmentModel = (healthDatabase) =>
	healthDatabase.model('Appointment', appointmentSchema);
