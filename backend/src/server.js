import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import classifyRoutes from './routes/classifyRoutes.js';

import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve Static Files from Frontend
const frontendPath = path.join(__dirname, '../../frontend/dist');
app.use(express.static(frontendPath));

// Routes
app.use('/api', classifyRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.json({ message: "EcoSort Backend is Running!" });
});

// Handle Frontend Routing
app.get('*path', (req, res) => {
  // Jika request dimulai dengan /api tapi sampai di sini, berarti API tidak ketemu
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ status: "error", message: "API Route not found" });
  }
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Error Handling Global
app.use((err, req, res, next) => {
  console.error("❌ Global Error:", err.stack);
  res.status(500).json({ status: "error", message: "Internal Server Error" });
});

const server = app.listen(PORT, () => {
  console.log(`🚀 EcoSort Server running on port ${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Error: Port ${PORT} sudah digunakan!`);
  } else {
    console.error("❌ Server Error:", err);
  }
});