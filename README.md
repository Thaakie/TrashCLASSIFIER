# 🌍 EcoSort: AI-Powered Waste Classifier

**EcoSort** is a premium web-based trash classification engine designed to solve waste management challenges in Indonesia. Using cutting-edge Computer Vision (Google Gemini 3.1 Flash) and real-time Geographic Information Systems (OpenStreetMap), EcoSort helps users identify trash types and find the nearest disposal facilities instantly.

---

## ✨ Key Features

- **🧠 Smart AI Classification**: Instantly identify waste categories (Organic, Inorganic, Hazardous/B3) using Google's most efficient Gemini model.
- **🛡️ Strict Object Detection**: Not trash? No problem. The AI can distinguish between waste and non-waste objects (people, pets, gadgets) to ensure data integrity.
- **📍 Real-time Bank Sampah Locator**: Dynamically find the nearest *Bank Sampah*, *TPS3R*, or *Recycling Centers* across Indonesia using satelite data with an intelligent multi-server fallback system.
- **📊 Impact Dashboard**: Track your positive environmental impact with metrics for CO2 saved and Eco-Points earned.
- **🎙️ Voice Guidance**: Educational tips are spoken aloud automatically to help you handle specific materials properly.
- **🌓 Adaptive Interface**: Premium design with seamless Dark and Light mode support.

---

## 🚀 Tech Stack

### Frontend
- **Framework**: React.js with Vite
- **Styling**: Tailwind CSS v4 (Modern & Efficient)
- **Animations**: Framer Motion (Smooth Transitions)
- **Icons**: Lucide React
- **Data Fetching**: Axios & Browser Geolocation API

### Backend
- **Runtime**: Node.js & Express
- **AI Engine**: Google Gemini 3.1 Flash Lite
- **External API**: OpenStreetMap Overpass API (for Geo-discovery)

---

## 🛠️ Getting Started

### Prerequisites
- Node.js installed on your machine.
- A Google Gemini API Key.

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-repo/ecosort.git
   cd ecosort
   ```

2. **Setup Backend**:
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` folder:
   ```env
   GEMINI_API_KEY=your_api_key_here
   PORT=5001
   ```
   Start the server:
   ```bash
   node src/server.js
   ```

3. **Setup Frontend**:
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

4. **Access the App**:
   Open `http://localhost:5173` in your browser.

---

## 🗺️ System Workflow

1. **Capture**: Take a photo using your webcam or upload an image.
2. **Analysis**: The image is sent to the Express backend and processed by Gemini AI.
3. **Reasoning**: AI categorizes the item based on Indonesian environmental standards.
4. **Localization**: If recyclable, the app uses your location to find nearby waste banks via OpenStreetMap.
5. **Reward**: Points are added to your local profile based on your contribution.

---

## 📄 License

© 2026 EcoSort Indonesia.
