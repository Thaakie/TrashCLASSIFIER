// Konfigurasi Gemini 3 Flash sesuai referensi skrip
export const GEMINI_PROMPT = "Berperanlah sebagai ahli lingkungan di Indonesia. Klasifikasikan sampah dalam gambar ini. Berikan jawaban dalam Bahasa Indonesia yang edukatif.";

export const GEMINI_RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    item: { type: "string" },
    kategori: { type: "string", enum: ["Organik", "Anorganik", "B3"] },
    penjelasan: { type: "string" },
    tips: { type: "string" },
    warna_tong: { type: "string", enum: ["Hijau", "Kuning", "Merah"] }
  },
  required: ["item", "kategori", "penjelasan", "tips", "warna_tong"]
};

export const GENERATION_CONFIG = {
  temperature: 0.2,
  responseMimeType: "application/json",
  responseSchema: GEMINI_RESPONSE_SCHEMA
};
