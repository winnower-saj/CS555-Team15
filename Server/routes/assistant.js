import express from 'express';
const router = express.Router();

import dotenv from 'dotenv';
dotenv.config();

import { createClient } from '@deepgram/sdk';
import multer from 'multer';
import fs from 'fs';

const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY;
const deepgram = createClient(DEEPGRAM_API_KEY);

const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), async (req, res) => {
	console.log('Received a file upload request.');
	const { path, mimetype, originalname, size } = req.file;
	console.log(
		`File details - Path: ${path}, MIME type: ${mimetype}, Original Name: ${originalname}, Size: ${size} bytes`
	);

	try {
		const audio = fs.readFileSync(path);
		console.log('Audio file read successfully.');

		const response = await deepgram.listen.prerecorded.transcribeFile(
			audio,
			{ model: 'nova', punctuate: true, language: 'en' }
		);
		console.log('Received response from Deepgram.');

		if (
			response &&
			response.result &&
			response.result.results &&
			response.result.results.channels
		) {
			const transcript =
				response.result.results.channels[0].alternatives[0].transcript;
			console.log(`Transcription: ${transcript}`);
			res.json({ transcription: transcript });
		} else {
			console.error(
				'Unexpected response structure:',
				JSON.stringify(response, null, 2)
			);
			res.status(500).json({
				error: 'Unexpected response structure from Deepgram API',
			});
		}
	} catch (error) {
		console.error('Error processing audio file:', error);
		res.status(500).json({ error: 'Error processing audio file' });
	} finally {
		fs.unlink(path, (err) => {
			if (err) console.error('Error deleting file:', err);
			else console.log('Uploaded file deleted successfully.');
		});
	}
});

export default router;
