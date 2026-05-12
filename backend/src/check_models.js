import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
  try {
    console.log("Mengecek daftar model yang tersedia...");
    // Menggunakan fetch manual karena SDK v2 tidak memiliki listModels langsung yang mudah
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();
    
    if (data.models) {
      console.log("Model yang tersedia untuk API Key Anda:");
      data.models.forEach(m => {
        if (m.supportedGenerationMethods.includes("generateContent")) {
          console.log(`- ${m.name.replace('models/', '')}`);
        }
      });
    } else {
      console.log("Tidak ada model yang ditemukan atau API Key salah.", data);
    }
  } catch (error) {
    console.error("Gagal mengambil daftar model:", error.message);
  }
}

listModels();
