import { useState, useRef, useCallback, useEffect, type ChangeEvent } from 'react'
import Webcam from 'react-webcam'
import axios from 'axios'

interface ApiResponse {
  status: string
  data: {
    item: string
    kategori: 'Organik' | 'Anorganik' | 'B3' | 'Bukan Sampah'
    penjelasan: string
    tips: string
    warna_tong: string
  }
  message?: string
}

export const useTrashScanner = (onResultSaved?: (data: ApiResponse['data']) => void) => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ApiResponse['data'] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [thinkingStep, setThinkingStep] = useState(0)
  const [isSpeaking, setIsSpeaking] = useState(false)
  
  const webcamRef = useRef<Webcam>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const thinkingSteps = [
    "Menganalisis tekstur objek...",
    "Mendeteksi material penyusun...",
    "Konsultasi standar lingkungan IDN...",
    "Mengevaluasi tingkat daur ulang...",
    "Menyusun tips pengelolaan..."
  ]

  useEffect(() => {
    let interval: any
    if (loading) {
      interval = setInterval(() => {
        setThinkingStep((prev) => (prev + 1) % thinkingSteps.length)
      }, 1500)
    }
    return () => clearInterval(interval)
  }, [loading, thinkingSteps.length])

  const classifyTrash = async (image: string) => {
    setLoading(true)
    setError(null)
    setResult(null)
    
    try {
      const response = await axios.post<ApiResponse>('http://localhost:5001/api/classify', {
        imageBase64: image
      })

      if (response.data.status === 'success' && response.data.data) {
        const data = response.data.data
        setResult(data)
        if (onResultSaved) onResultSaved(data)
      } else {
        setError(response.data.message || 'Gagal klasifikasi')
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Server tidak merespon. Pastikan backend aktif.')
    } finally {
      setLoading(false)
    }
  }

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot({
      width: 720,
      height: 960
    })
    
    if (imageSrc) {
      setCapturedImage(imageSrc)
      classifyTrash(imageSrc)
    }
  }, [webcamRef])

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setCapturedImage(base64String)
        classifyTrash(base64String)
      }
      reader.readAsDataURL(file)
    }
  }

  const toggleVoice = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    } else {
      if (!result) return
      const text = `Ini adalah ${result.item}. Kategorinya adalah ${result.kategori}. Tips: ${result.tips}. Gunakan tong sampah ${result.warna_tong}.`
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'id-ID'
      utterance.onend = () => setIsSpeaking(false)
      window.speechSynthesis.speak(utterance)
      setIsSpeaking(true)
    }
  }

  const downloadImage = () => {
    if (!result) return
    const canvas = document.createElement('canvas')
    canvas.width = 800
    canvas.height = 600
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.fillStyle = '#FAF0E6'
      ctx.fillRect(0, 0, 800, 600)
      ctx.fillStyle = '#352F44'
      ctx.font = 'bold 40px Outfit'
      ctx.fillText(`EcoSort Analysis: ${result.item}`, 50, 80)
      ctx.font = '30px Outfit'
      ctx.fillText(`Kategori: ${result.kategori}`, 50, 140)
      ctx.font = '20px Outfit'
      ctx.fillText(`Tips: ${result.tips}`, 50, 200)
      
      const link = document.createElement('a')
      link.download = `EcoSort-${result.item}.png`
      link.href = canvas.toDataURL()
      link.click()
    }
  }

  const reset = () => {
    setCapturedImage(null)
    setResult(null)
    setError(null)
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
  }

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
    reset
  }
}
