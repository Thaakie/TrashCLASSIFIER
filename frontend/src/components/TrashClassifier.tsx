import { useState, useRef, useCallback, useEffect } from 'react';
// ... rest of imports
import Webcam from 'react-webcam';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Camera, RefreshCw, AlertCircle, Sparkles, CheckCircle2, Recycle } from 'lucide-react';

interface ApiResponse {
  status: string;
  data: {
    item: string;
    kategori: 'Organik' | 'Anorganik' | 'B3';
    penjelasan: string;
    tips: string;
    warna_tong: string;
  };
  message?: string;
}

interface TrashClassifierProps {
  onResultSaved?: (item: any) => void;
}

const TrashClassifier = ({ onResultSaved }: TrashClassifierProps) => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiResponse['data'] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [thinkingStep, setThinkingStep] = useState(0);
  
  const webcamRef = useRef<Webcam>(null);

  const thinkingSteps = [
    "Menganalisis tekstur objek...",
    "Mendeteksi material penyusun...",
    "Konsultasi standar lingkungan IDN...",
    "Mengevaluasi tingkat daur ulang...",
    "Menyusun tips pengelolaan..."
  ];

  useEffect(() => {
    let interval: any;
    if (loading) {
      interval = setInterval(() => {
        setThinkingStep((prev) => (prev + 1) % thinkingSteps.length);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot({
      width: 720,
      height: 960,
      quality: 0.8
    });
    
    if (imageSrc) {
      setCapturedImage(imageSrc);
      classifyTrash(imageSrc);
    }
  }, [webcamRef]);

  const classifyTrash = async (image: string) => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await axios.post<ApiResponse>('http://localhost:5000/api/classify', {
        imageBase64: image
      });

      if (response.data.status === 'success' && response.data.data) {
        const data = response.data.data;
        setResult(data);
        if (onResultSaved) onResultSaved(data);
      } else {
        setError(response.data.message || 'Gagal klasifikasi');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Server tidak merespon. Pastikan backend aktif.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setCapturedImage(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="w-full">
      <div className={`grid gap-8 transition-all duration-500 ${result ? 'lg:grid-cols-2' : 'grid-cols-1 max-w-xl mx-auto'}`}>
        
        {/* Camera Section */}
        <motion.div layout className="relative space-y-4">
          <Card className="overflow-hidden border-none shadow-2xl bg-white rounded-[2.5rem]">
            <div className="relative aspect-[3/4] bg-[#352F44] overflow-hidden">
              {!capturedImage ? (
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  className="w-full h-full object-cover"
                  videoConstraints={{ facingMode: 'environment' }}
                />
              ) : (
                <img src={capturedImage} className="w-full h-full object-cover" alt="Captured" />
              )}
              
              <AnimatePresence>
                {loading && (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-[#352F44]/70 backdrop-blur-md flex flex-col items-center justify-center text-white z-20"
                  >
                    {/* Scanning Line HUD */}
                    <motion.div 
                      className="absolute left-0 right-0 h-1 bg-[#B9B4C7] shadow-[0_0_20px_#B9B4C7] z-30"
                      animate={{ top: ["0%", "100%", "0%"] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />

                    <motion.div 
                      animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-16 h-16 border-4 border-[#B9B4C7]/20 border-t-[#B9B4C7] rounded-full"
                    />
                    <motion.p 
                      key={thinkingStep}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 font-black tracking-widest uppercase text-[10px] text-center px-6"
                    >
                      {thinkingSteps[thinkingStep]}
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
            
            <div className="p-6 bg-white flex justify-center">
              {!result && !loading ? (
                <Button 
                  onClick={capture} 
                  className="w-20 h-20 rounded-full bg-[#352F44] hover:bg-[#5C5470] shadow-xl hover:scale-105 transition-all p-0 group"
                >
                  <Camera className="w-8 h-8 text-white" />
                </Button>
              ) : (
                <Button onClick={reset} variant="outline" className="rounded-full px-8 gap-2 border-[#B9B4C7] text-[#352F44] hover:bg-[#FAF0E6]">
                  <RefreshCw className="w-4 h-4" /> Reset Scanner
                </Button>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Result Section (Side-by-Side) */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              className="h-full"
            >
              <Card className="border-none shadow-2xl bg-white rounded-[2.5rem] h-full flex flex-col overflow-hidden border border-[#B9B4C7]/20">
                <div className={`h-3 w-full ${
                  result.kategori === 'Organik' ? 'bg-[#4ade80]' : 
                  result.kategori === 'Anorganik' ? 'bg-[#facc15]' : 'bg-[#f87171]'
                }`} />
                <CardHeader className="pt-10 px-8">
                  <div className="flex justify-between items-start mb-6">
                    <Badge variant="outline" className="rounded-full px-4 py-1 border-[#B9B4C7] text-[#5C5470] uppercase tracking-widest text-[10px] font-black">
                      Classification Success
                    </Badge>
                    <CheckCircle2 className={`w-8 h-8 ${
                      result.kategori === 'Organik' ? 'text-[#4ade80]' : 
                      result.kategori === 'Anorganik' ? 'text-[#facc15]' : 'text-[#f87171]'
                    }`} />
                  </div>
                  <CardTitle className="text-5xl font-black tracking-tighter leading-none text-[#352F44]">
                    {result.item}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-8 px-8 pb-12 flex-grow">
                  <div className="flex items-center gap-4">
                    <div className={`px-6 py-2 rounded-2xl font-black text-white text-lg ${
                      result.kategori === 'Organik' ? 'bg-[#4ade80]' : 
                      result.kategori === 'Anorganik' ? 'bg-[#facc15]' : 'bg-[#f87171]'
                    }`}>
                      {result.kategori}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#B9B4C7]">Insight AI</p>
                    <p className="text-[#5C5470] leading-relaxed font-medium italic underline decoration-[#B9B4C7] underline-offset-4 decoration-2">
                      {result.penjelasan}
                    </p>
                  </div>

                  <div className="p-6 rounded-[2rem] bg-[#FAF0E6] border border-[#B9B4C7]/30 space-y-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-[#352F44]" />
                      <span className="text-sm font-black uppercase tracking-tighter">Tips Pengolahan</span>
                    </div>
                    <p className="text-sm text-[#5C5470] font-medium leading-relaxed">{result.tips}</p>
                  </div>

                  <div className="mt-auto pt-6 flex items-center justify-between border-t border-[#FAF0E6]">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        result.kategori === 'Organik' ? 'bg-[#4ade80]' : 
                        result.kategori === 'Anorganik' ? 'bg-[#facc15]' : 'bg-[#f87171]'
                      }`}>
                        <Recycle className="text-white w-6 h-6" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase text-[#B9B4C7]">Warna Tong</span>
                        <span className="text-sm font-black text-[#352F44]">Tong Sampah {result.warna_tong}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Error Alert */}
      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mt-8">
            <Alert variant="destructive" className="rounded-[2rem] bg-white border-2 border-[#f87171] shadow-xl">
              <AlertCircle className="h-5 w-5" />
              <AlertTitle className="font-black uppercase tracking-widest text-xs">System Error</AlertTitle>
              <AlertDescription className="text-sm font-medium">{error}</AlertDescription>
              <Button variant="ghost" size="sm" onClick={reset} className="mt-4 h-8 px-4 rounded-full bg-[#f87171] text-white">Reset</Button>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TrashClassifier;
