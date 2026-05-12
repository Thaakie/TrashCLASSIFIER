import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_PROMPT, GENERATION_CONFIG } from '../config/gemini.js';

// Fungsi helper untuk delay/sleep
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const classifyImage = async (req, res) => {
  const { imageBase64 } = req.body;
  if (!imageBase64) {
    return res.status(400).json({ status: "error", message: "Gambar kosong" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ status: "error", message: "API Key tidak ditemukan" });
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ 
    model: "gemini-3.1-flash-lite"
  });

  const maxRetries = 3;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      console.log(`>>> [LOG] Percobaan ${attempt + 1}: Menghubungi Gemini 3 Flash...`);
      const base64Data = imageBase64.split(",")[1] || imageBase64;

      const result = await model.generateContent({
        contents: [{
          role: "user",
          parts: [
            { text: GEMINI_PROMPT },
            {
              inlineData: {
                data: base64Data,
                mimeType: "image/jpeg"
              }
            }
          ]
        }],
        generationConfig: GENERATION_CONFIG
      });

      const response = await result.response;
      const text = response.text();
      const resultJson = JSON.parse(text);

      console.log(`>>> [LOG] Berhasil memproses: ${resultJson.item}`);
      return res.json({
        status: "success",
        data: resultJson
      });

    } catch (error) {
      attempt++;
      if (error.message.includes("429") && attempt < maxRetries) {
        console.warn(`>>> [WARN] Kuota penuh. Menunggu 10 detik sebelum mencoba lagi... (Percobaan ${attempt}/${maxRetries})`);
        await wait(10000); // Tunggu 10 detik
      } else {
        console.error("Gemini Error:", error.message);
        return res.status(500).json({
          status: "error",
          message: error.message.includes("429") 
            ? "Kuota Gemini 3 Anda benar-benar penuh. Tunggu 1 menit lalu coba lagi." 
            : "Terjadi kesalahan pada sistem klasifikasi."
        });
      }
    }
  }
};
