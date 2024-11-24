import mongoose from 'mongoose';

const medicationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    about: {
        type: String,
        required: true,
    },
},
    { timestamps: true }
);

export default mongoose.model('Medication', medicationSchema);