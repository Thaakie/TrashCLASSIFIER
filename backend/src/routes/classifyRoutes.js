import express from 'express';
import { classifyImage } from '../controllers/classifyController.js';

const router = express.Router();

router.post('/classify', classifyImage);

export default router;
