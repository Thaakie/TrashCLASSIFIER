import { GoogleGenerativeAI } from "@google/generative-ai";

const CHATBOT_SYSTEM_PROMPT = `
Kamu adalah "EcoSort Assistant", chatbot edukasi sampah untuk pengguna di Indonesia.
Fokus utama:
1. Edukasi pemilahan sampah: Organik, Anorganik, dan B3.
2. Beri langkah praktis yang aman dan mudah diterapkan di rumah/sekolah.
3. Gunakan Bahasa Indonesia yang ramah, natural, dan jelas seperti ngobrol.
4. Jika pertanyaan di luar topik persampahan, arahkan secara sopan kembali ke topik sampah.
5. Jangan mengarang data spesifik lokasi. Jika butuh lokasi bank sampah, sarankan cek DLH setempat atau aplikasi peta.
6. JANGAN gunakan Markdown (tanpa **, ##, -, atau nomor otomatis).
7. Tulis maksimal 3 paragraf pendek, tiap paragraf 1-2 kalimat.
8. Jika memberi langkah, pakai format kalimat biasa, bukan bullet.
9. Gaya jawaban harus human: hangat, suportif, dan tidak kaku.
10. Struktur jawaban:
    - Kalimat 1: empati/sapaan singkat sesuai konteks pertanyaan pengguna.
    - Kalimat 2-3: penjelasan inti yang sederhana.
    - Kalimat terakhir: satu aksi kecil yang bisa langsung dilakukan pengguna.
11. Hindari kalimat terlalu formal seperti buku teks.
`;

const sanitizeAssistantText = (text) => {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/`{1,3}([^`]+)`{1,3}/g, "$1")
    .replace(/^#{1,6}\s*/gm, "")
    .replace(/^\s*[-*]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

const humanizeTone = (text) => {
  if (!text) return "Makasih sudah bertanya. Yuk, kita bahas sampahnya pelan-pelan biar makin mudah dipraktikkan.";
  const normalized = text.trim();
  const hasWarmStart = /^(halo|hai|hi|terima kasih|makasih|bagus|pertanyaan bagus|keren)/i.test(normalized);
  if (hasWarmStart) return normalized;
  return `Pertanyaan yang bagus. ${normalized}`;
};

export const chatWithBot = async (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({
      status: "error",
      message: "Pesan tidak valid"
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      status: "error",
      message: "API Key tidak ditemukan"
    });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite" });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: `${CHATBOT_SYSTEM_PROMPT}\n\nPertanyaan pengguna: ${message}` }]
        }
      ],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 512
      }
    });

    const response = await result.response;
    const answer = humanizeTone(sanitizeAssistantText(response.text()));

    return res.json({
      status: "success",
      data: {
        answer
      }
    });
  } catch (error) {
    console.error("Chatbot Error:", error.message);
    return res.status(500).json({
      status: "error",
      message: error.message?.includes("429")
        ? "Kuota Gemini penuh, coba lagi beberapa saat."
        : "Terjadi kesalahan pada layanan chatbot."
    });
  }
};
