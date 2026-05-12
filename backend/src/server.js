import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import classifyRoutes from './routes/classifyRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Health Check
app.get('/', (req, res) => {
  res.json({ message: "EcoSort Backend is Running!" });
});

// Routes
app.use('/api', classifyRoutes);

// Error Handling Global
app.use((err, req, res, next) => {
  console.error("❌ Global Error:", err.stack);
  res.status(500).json({ status: "error", message: "Internal Server Error" });
});

const server = app.listen(PORT, () => {
  console.log(`🚀 EcoSort Server running on http://localhost:${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Error: Port ${PORT} sudah digunakan!`);
  } else {
    console.error("❌ Server Error:", err);
  }
});