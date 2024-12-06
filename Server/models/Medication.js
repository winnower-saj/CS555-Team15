import mongoose from 'mongoose';

const medicationSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	details: {
		type: String,
		required: true,
	},
	time: {
		type: String,
		required: true,
	}
},
	{ timestamps: true }
);

export const MedicationModel = (healthDatabase) => healthDatabase.model('Medication', medicationSchema);