import Webcam from 'react-webcam';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { 
  Camera, RefreshCw, AlertCircle, Recycle, 
  Volume2, VolumeX, Download, Lightbulb, 
  Trash2, Upload, Zap, ChevronRight
} from 'lucide-react';
import { useTrashScanner } from '../hooks/useTrashScanner';

interface TrashClassifierProps {
  onResultSaved?: (item: any) => void;
}

const TrashClassifier = ({ onResultSaved }: TrashClassifierProps) => {
  const {
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
  } = useTrashScanner(onResultSaved);

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-6 px-0 md:px-6">
      <div className="text-center space-y-2">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-[9px] font-black uppercase tracking-[0.2em]"
        >
          EcoSort Intelligence
        </motion.div>
        <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight text-balance px-4">
          Scan the <span className="text-primary italic">Future.</span>
        </h2>
        <p className="text-muted-foreground dark:text-foreground/60 font-medium text-sm max-w-2xl mx-auto">
          Gunakan kekuatan AI untuk mengidentifikasi sampah secara instan dan dapatkan panduan pengelolaan yang tepat.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Scanner Section */}
        <div className="relative group order-2 lg:order-1">
          <div className="absolute -inset-4 bg-primary/5 rounded-[3.5rem] -z-10 group-hover:bg-primary/10 transition-colors duration-700" />
          
          <div className="relative bg-card rounded-[3rem] p-3 border border-border shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] overflow-hidden">
            {!capturedImage ? (
              <div className="relative rounded-[2.5rem] overflow-hidden aspect-[4/3] bg-muted">
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{ facingMode: "environment" }}
                  className="w-full h-full object-cover"
                />
                
                {/* Viewfinder Overlay */}
                <div className="absolute inset-0 border-[1px] border-white/20 rounded-[2.2rem] pointer-events-none m-8">
                  <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-primary rounded-tl-2xl" />
                  <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-primary rounded-tr-2xl" />
                  <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-primary rounded-bl-2xl" />
                  <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-primary rounded-br-2xl" />
                  
                  {/* Scanning Line Animation */}
                  {loading && (
                    <motion.div 
                      animate={{ top: ['10%', '90%', '10%'] }}
                      transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                      className="absolute left-0 right-0 h-0.5 bg-primary shadow-[0_0_15px_rgba(16,185,129,0.5)] z-20"
                    />
                  )}
                </div>
              </div>
            ) : (
              <div className="relative rounded-[2.5rem] overflow-hidden aspect-[4/3]">
                <img src={capturedImage} className="w-full h-full object-cover grayscale-[0.2]" alt="Captured" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <button 
                  onClick={reset}
                  className="absolute top-8 right-8 w-14 h-14 glass-dark text-white rounded-2xl flex items-center justify-center hover:bg-black/80 transition-all hover:rotate-90"
                >
                  <RefreshCw className="w-7 h-7" />
                </button>
              </div>
            )}

            {loading && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-md flex flex-col items-center justify-center text-white z-50">
                <div className="relative z-10 text-center space-y-8 p-12">
                  <div className="w-24 h-24 bg-primary rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl animate-pulse">
                    <Camera className="w-12 h-12 text-primary-foreground" />
                  </div>
                  <div className="space-y-4">
                    <p className="text-xs font-black uppercase tracking-[0.4em] opacity-80">System Analysing</p>
                    <AnimatePresence mode="wait">
                      <motion.p 
                        key={thinkingStep}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-2xl font-black italic tracking-tight"
                      >
                        {thinkingSteps[thinkingStep]}
                      </motion.p>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            )}

            <div className="p-6 md:p-8 flex flex-row justify-center items-center gap-3 md:gap-4">
              {!capturedImage && (
                <>
                  <Button 
                    onClick={capture}
                    disabled={loading}
                    className="flex-grow rounded-[2rem] bg-primary text-primary-foreground h-16 md:h-20 px-6 md:px-10 gap-2 md:gap-3 group shadow-[0_20px_40px_-10px_rgba(0,0,0,0.2)] hover:scale-105 transition-all"
                  >
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:rotate-12 transition-transform">
                      <Camera className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                    <span className="font-black uppercase tracking-widest text-[9px] md:text-[10px]">Capture Object</span>
                  </Button>
                  
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                  />
                  <Button 
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="rounded-[2rem] h-16 w-16 md:h-20 md:w-20 flex-shrink-0 flex items-center justify-center border-2 hover:bg-muted transition-colors"
                  >
                    <Upload className="w-5 h-5 md:w-6 md:h-6 text-muted-foreground" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="order-1 lg:order-2">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="bg-card border border-border rounded-[4rem] p-10 space-y-10 shadow-2xl">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${
                          result.kategori === 'Organik' ? 'bg-emerald-500' :
                          result.kategori === 'Anorganik' ? 'bg-amber-500' :
                          result.kategori === 'B3' ? 'bg-rose-500' : 'bg-slate-500'
                        }`} />
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-80 text-primary">Result Category</span>
                      </div>
                      <h3 className="text-5xl font-black tracking-tighter">{result.item}</h3>
                    </div>
                    <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center text-white shadow-2xl ${
                      result.warna_tong === 'Hijau' ? 'bg-emerald-500 shadow-emerald-500/20' :
                      result.warna_tong === 'Kuning' ? 'bg-amber-500 shadow-amber-500/20' :
                      result.warna_tong === 'Merah' ? 'bg-rose-500 shadow-rose-500/20' : 'bg-slate-500 shadow-slate-500/20'
                    }`}>
                      <Trash2 className="w-10 h-10" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-8 bg-muted/30 rounded-[3rem] border border-border/50">
                      <p className="text-xl font-bold leading-relaxed italic text-balance">
                        "{result.penjelasan}"
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 rounded-[2rem] bg-primary text-primary-foreground space-y-1">
                      <p className="text-[8px] font-black uppercase tracking-widest opacity-80">Disposal</p>
                      <p className="text-lg font-black tracking-tight">{result.warna_tong} Bin</p>
                    </div>
                    <div className="p-6 rounded-[2rem] bg-muted/50 border border-border space-y-1 text-center">
                      <p className="text-[8px] font-black uppercase tracking-widest opacity-80">Type</p>
                      <p className="text-lg font-black tracking-tight">{result.kategori}</p>
                    </div>
                  </div>
                </div>

                <div className="glass dark:glass-dark rounded-[4rem] p-10 space-y-8">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-primary">
                      <Lightbulb className="w-5 h-5" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Expert Guidance</span>
                    </div>
                    <p className="text-2xl font-bold leading-snug tracking-tight">{result.tips}</p>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <button 
                      onClick={toggleVoice}
                      className="flex-grow flex items-center justify-center gap-3 py-4 bg-primary text-primary-foreground rounded-2xl hover:scale-[1.02] active:scale-95 transition-all font-black text-[10px] uppercase tracking-widest"
                    >
                      {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      {isSpeaking ? "Stop Voice" : "Listen Advice"}
                    </button>
                    <button 
                      onClick={downloadImage}
                      className="w-16 h-16 bg-muted hover:bg-border transition-colors rounded-2xl flex items-center justify-center"
                    >
                      <Download className="w-6 h-6" />
                    </button>
                    <button 
                      onClick={reset}
                      className="w-16 h-16 bg-muted hover:bg-border transition-colors rounded-2xl flex items-center justify-center"
                    >
                      <RefreshCw className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-center p-8 md:p-12 border-2 border-dashed border-border rounded-[4rem] space-y-6 mx-4 md:mx-0"
              >
                <div className="w-24 h-24 bg-muted rounded-[2.5rem] flex items-center justify-center text-muted-foreground/30">
                  <Camera className="w-12 h-12" />
                </div>
                <div className="space-y-2 px-6">
                  <p className="text-2xl font-black tracking-tighter">Waiting for Data</p>
                  <p className="text-muted-foreground font-medium">Lakukan scan objek untuk melihat analisis mendalam.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Error State */}
      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[60] w-full max-w-lg px-6">
            <div className="bg-rose-500 text-white p-6 rounded-3xl shadow-2xl flex items-center gap-4">
              <AlertCircle className="w-8 h-8 shrink-0" />
              <div className="flex-grow">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-0.5">System Alert</p>
                <p className="text-sm font-bold leading-tight">{error}</p>
              </div>
              <button onClick={reset} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TrashClassifier;
