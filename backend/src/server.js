import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL_ID = "gemini-3-flash-preview";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_ID}:generateContent?key=${API_KEY}`;

app.post('/api/classify', async (req, res) => {
  console.log(">>> [LOG] Foto masuk, menghubungi Gemini 3 Flash (Thinking Mode)...");
  
  try {
    const { imageBase64 } = req.body;
    if (!imageBase64) return res.status(400).json({ status: "error", message: "Gambar kosong" });
    const base64Data = imageBase64.split(",")[1] || imageBase64;

    const requestBody = {
      contents: [
        {
          role: "user",
          parts: [
            { text: "Berperanlah sebagai ahli lingkungan di Indonesia. Klasifikasikan sampah dalam gambar ini." },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: base64Data
              }
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.2,
        thinkingConfig: {
          includeThoughts: true,
          // thinkingLevel: "HIGH" // Beberapa versi v1beta mungkin menggunakan ini
        },
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            item: { type: "string" },
            kategori: { type: "string", enum: ["Organik", "Anorganik", "B3"] },
            penjelasan: { type: "string" },
            tips: { type: "string" },
            warna_tong: { type: "string", enum: ["Hijau", "Kuning", "Merah"] }
          },
          required: ["item", "kategori", "penjelasan", "tips", "warna_tong"]
        }
      }
    };

    const response = await axios.post(API_URL, requestBody, {
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.data && response.data.candidates) {
      const parts = response.data.candidates[0].content.parts;
      let foundData = null;

      console.log(`>>> [LOG] Menerima ${parts.length} bagian respon.`);

      for (const part of parts) {
        if (part.text) {
          const jsonMatch = part.text.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            foundData = JSON.parse(jsonMatch[0]);
            break;
          }
        }
      }

      if (foundData) {
        console.log(">>> [LOG] Data ditemukan dan berhasil diproses!");
        res.json({ status: "success", data: foundData });
      } else {
        throw new Error("Data JSON tidak ditemukan di bagian manapun.");
      }
    } else {
      throw new Error("Respon API tidak sesuai format");
    }

  } catch (error) {
    console.error(">>> [LOG] ERROR API:", error.response?.data || error.message);
    res.status(500).json({ 
      status: "error", 
      message: error.response?.data?.error?.message || "Terjadi kesalahan pada server." 
    });
  }
});

app.get('/health', (req, res) => res.send('OK'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\x1b[32m[DIRECT ENGINE ONLINE]\x1b[0m Port: ${PORT}`);
});





