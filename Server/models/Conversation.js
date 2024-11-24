import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    userText: {
        type: String,
        required: true,
    },
    assistantText: {
        type: String,
        required: true,
    },
    emotion: {
        type: String,
        required: true,
    },
},
    { timestamps: true }
);

export default mongoose.model('Conversation', conversationSchema);