import { useState, useRef, useCallback, useEffect, type ChangeEvent } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import html2canvas from "html2canvas";

interface ApiResponse {
  status: string;
  data: {
    item: string;
    kategori: "Organik" | "Anorganik" | "B3" | "Bukan Sampah";
    penjelasan: string;
    tips: string;
    warna_tong: string;
  };
  message?: string;
}

export const useTrashScanner = (onResultSaved?: (data: ApiResponse["data"]) => void) => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiResponse["data"] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [thinkingStep, setThinkingStep] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const voicesRef = useRef<SpeechSynthesisVoice[] | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const thinkingSteps = ["Menganalisis tekstur objek...", "Mendeteksi material penyusun...", "Konsultasi standar lingkungan IDN...", "Mengevaluasi tingkat daur ulang...", "Menyusun tips pengelolaan..."];

  useEffect(() => {
    let interval: any;
    if (loading) {
      interval = setInterval(() => {
        setThinkingStep((prev) => (prev + 1) % thinkingSteps.length);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [loading, thinkingSteps.length]);

  // Preload available speechSynthesis voices. Some mobile browsers populate
  // voices asynchronously; listen to `voiceschanged` and cache the list.
  useEffect(() => {
    const loadVoices = () => {
      try {
        const v = window.speechSynthesis.getVoices();
        if (v && v.length) voicesRef.current = v;
      } catch (e) {
        // ignore
      }
    };

    loadVoices();
    try {
      window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    } catch (e) {
      // ignore
    }

    return () => {
      try {
        window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
      } catch (e) {
        // ignore
      }
    };
  }, []);

  const classifyTrash = async (image: string) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post<ApiResponse>("/api/classify", {
        imageBase64: image,
      });

      if (response.data.status === "success" && response.data.data) {
        const data = response.data.data;
        setResult(data);
        if (onResultSaved) onResultSaved(data);
      } else {
        setError(response.data.message || "Gagal klasifikasi");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Server tidak merespon. Pastikan backend aktif.");
    } finally {
      setLoading(false);
    }
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot({
      width: 720,
      height: 960,
    });

    if (imageSrc) {
      setCapturedImage(imageSrc);
      classifyTrash(imageSrc);
    }
  }, [webcamRef]);

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setCapturedImage(base64String);
        classifyTrash(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleVoice = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setError("Fitur suara tidak didukung browser ini.");
      return;
    }

    const synth = window.speechSynthesis;

    if (isSpeaking) {
      synth.cancel();
      utteranceRef.current = null;
      setIsSpeaking(false);
    } else {
      if (!result) return;
      const text = `Ini adalah ${result.item}. Kategorinya adalah ${result.kategori}. Tips: ${result.tips}. Gunakan tong sampah ${result.warna_tong}.`;
      const utterance = new SpeechSynthesisUtterance(text);
      utteranceRef.current = utterance;

      // choose a suitable voice if available (prefer Indonesian, then English)
      const voices = voicesRef.current?.length ? voicesRef.current : synth.getVoices();
      if (voices && voices.length) {
        const selectedVoice =
          voices.find((v) => v.lang?.toLowerCase().startsWith("id")) ||
          voices.find((v) => v.lang?.toLowerCase().startsWith("en")) ||
          voices[0];
        utterance.voice = selectedVoice;
        utterance.lang = selectedVoice.lang || "id-ID";
      } else {
        utterance.lang = "id-ID";
      }

      // mobile browsers can be sensitive; set explicit params
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => {
        setIsSpeaking(false);
        setError("Suara gagal diputar di perangkat ini. Coba naikkan volume media / matikan mode senyap.");
      };

      // Speak on the same user gesture (this function is called from button click)
      try {
        // Clear pending queue and resume in case synth is paused (common on mobile).
        synth.cancel();
        synth.resume();
        synth.speak(utterance);
      } catch (e) {
        // Some browsers may throw if speech cannot start; fail gracefully
        console.warn("speechSynthesis.speak failed", e);
        setIsSpeaking(false);
      }
    }
  };

  const downloadImage = async (exportNode?: HTMLElement | null) => {
    if (!result || !exportNode) return;
    // Some browsers / html2canvas behave inconsistently if the node is hidden/offscreen.
    // Temporarily force the export node to be visible and centered in the viewport
    // so the canvas rendering matches the intended layout, then restore styles.
    const prevStyle = {
      position: exportNode.style.position || "",
      left: exportNode.style.left || "",
      top: exportNode.style.top || "",
      transform: exportNode.style.transform || "",
      opacity: exportNode.style.opacity || "",
      visibility: exportNode.style.visibility || "",
      zIndex: exportNode.style.zIndex || "",
      pointerEvents: exportNode.style.pointerEvents || "",
    };

    try {
      exportNode.style.position = "fixed";
      exportNode.style.left = "50%";
      exportNode.style.top = "50%";
      exportNode.style.transform = "translate(-50%, -50%)";
      exportNode.style.opacity = "1";
      exportNode.style.visibility = "visible";
      exportNode.style.zIndex = "99999";
      exportNode.style.pointerEvents = "none";

      const canvas = await html2canvas(exportNode, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const link = document.createElement("a");
      link.download = `EcoSort-${result.item}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } finally {
      // restore previous inline styles
      exportNode.style.position = prevStyle.position;
      exportNode.style.left = prevStyle.left;
      exportNode.style.top = prevStyle.top;
      exportNode.style.transform = prevStyle.transform;
      exportNode.style.opacity = prevStyle.opacity;
      exportNode.style.visibility = prevStyle.visibility;
      exportNode.style.zIndex = prevStyle.zIndex;
      exportNode.style.pointerEvents = prevStyle.pointerEvents;
    }
  };

  const reset = () => {
    setCapturedImage(null);
    setResult(null);
    setError(null);
    window.speechSynthesis.cancel();
    utteranceRef.current = null;
    setIsSpeaking(false);
  };

  return {
    webcamRef,
    fileInputRef,
    capturedImage,
    loading,
    result,
    error,
    thinkingStep,
    thinkingSteps,
    isSpeaking,
    capture,
    handleFileUpload,
    toggleVoice,
    downloadImage,
    reset,
  };
};
