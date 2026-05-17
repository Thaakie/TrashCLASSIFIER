import express from 'express';
import { chatWithBot } from '../controllers/chatbotController.js';

const router = express.Router();

router.post('/chatbot', chatWithBot);

export default router;
