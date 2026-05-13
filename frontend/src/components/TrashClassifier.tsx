import Webcam from 'react-webcam';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { 
  Camera, RefreshCw, AlertCircle, 
  Volume2, VolumeX, Download, Lightbulb, 
  Trash2, Upload, Zap
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
    <div className="max-w-6xl mx-auto py-4 md:py-8 px-4 h-full flex flex-col justify-center min-h-[calc(100vh-100px)]">
      {/* Compact Header */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-6 gap-4">
        <div className="space-y-1">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full border border-primary/20"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-widest">Neural Scanner v2</span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter">EcoSort <span className="text-primary italic">Intelligence.</span></h2>
        </div>
        <p className="text-muted-foreground font-medium text-xs max-w-[200px] text-right hidden md:block">
          Smart waste classification powered by Gemini Vision.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-stretch">
        {/* LEFT: Compact Scanner */}
        <div className="w-full lg:w-[380px] shrink-0">
          <div className="relative group h-full">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-700"></div>
            <div className="relative h-full bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl p-3 flex flex-col shadow-xl">
              <div className="relative rounded-xl overflow-hidden aspect-square bg-muted mb-4">
                {!capturedImage ? (
                  <>
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      videoConstraints={{ facingMode: "environment" }}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-4 pointer-events-none">
                       <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-primary rounded-tl-md" />
                       <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-primary rounded-tr-md" />
                       <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-primary rounded-bl-md" />
                       <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-primary rounded-br-md" />
                    </div>
                  </>
                ) : (
                  <img src={capturedImage} className="w-full h-full object-cover" alt="Captured" />
                )}

                {loading && (
                  <motion.div 
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    className="absolute left-0 right-0 h-1 bg-primary shadow-[0_0_15px_rgba(16,185,129,0.8)] z-10"
                  />
                )}
              </div>

              <div className="mt-auto flex gap-2">
                {!capturedImage ? (
                  <>
                    <Button 
                      onClick={capture}
                      disabled={loading}
                      className="flex-grow h-12 rounded-xl bg-primary hover:scale-[1.02] transition-all gap-2"
                    >
                      <Camera className="w-4 h-4" />
                      <span className="font-black uppercase tracking-widest text-[9px]">Scan Object</span>
                    </Button>
                    <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
                    <Button 
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                      className="w-12 h-12 rounded-xl border-2"
                    >
                      <Upload className="w-4 h-4" />
                    </Button>
                  </>
                ) : (
                  <Button 
                    onClick={reset}
                    variant="outline"
                    className="w-full h-12 rounded-xl border-2 font-black uppercase text-[9px] tracking-widest"
                  >
                    <RefreshCw className="w-3 h-3 mr-2" /> Reset
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Unified Compact Results */}
        <div className="flex-grow">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="h-full"
              >
                <div className={`h-full border border-border/50 rounded-2xl p-6 md:p-8 flex flex-col shadow-2xl relative overflow-hidden ${
                  result.warna_tong === 'Hijau' ? 'bg-emerald-500/5' :
                  result.warna_tong === 'Kuning' ? 'bg-amber-500/5' :
                  result.warna_tong === 'Merah' ? 'bg-rose-500/5' : 'bg-slate-500/5'
                }`}>
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                    <div className="space-y-1">
                      <p className="text-[9px] font-black uppercase tracking-[0.3em] text-primary">Neural Identify Result</p>
                      <h3 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight">{result.item}</h3>
                    </div>
                    <div className={`px-6 py-4 rounded-2xl flex flex-col items-center justify-center text-white text-center shadow-lg ${
                      result.warna_tong === 'Hijau' ? 'bg-emerald-500 shadow-emerald-500/20' :
                      result.warna_tong === 'Kuning' ? 'bg-amber-500 shadow-amber-500/20' :
                      result.warna_tong === 'Merah' ? 'bg-rose-500 shadow-rose-500/20' : 'bg-slate-500 shadow-slate-500/20'
                    }`}>
                      <Trash2 className="w-6 h-6 mb-1" />
                      <span className="text-[8px] font-black uppercase">{result.warna_tong} Bin</span>
                    </div>
                  </div>

                  <div className="p-5 bg-card/60 backdrop-blur-sm rounded-xl border border-border/40 mb-6 flex-grow">
                    <p className="text-base font-bold leading-relaxed text-foreground/80 italic">
                      "{result.penjelasan}"
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-auto">
                    <div className="bg-muted/50 p-4 rounded-xl border border-border/40 space-y-1">
                       <div className="flex items-center gap-2 text-primary">
                         <Lightbulb className="w-3 h-3" />
                         <span className="text-[8px] font-black uppercase tracking-widest">Management Tips</span>
                       </div>
                       <p className="text-sm font-bold leading-tight">{result.tips}</p>
                    </div>
                    <div className="flex gap-2 h-14">
                       <button 
                         onClick={toggleVoice} 
                         className="flex-grow bg-primary text-primary-foreground rounded-xl font-black text-[9px] uppercase tracking-[0.2em] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-3 px-6 shadow-lg shadow-primary/10"
                       >
                          {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                          {isSpeaking ? "Stop Voice" : "Listen Advice"}
                       </button>
                       <button onClick={downloadImage} className="w-14 h-14 bg-muted rounded-xl flex items-center justify-center hover:bg-border active:scale-95 transition-all border border-border/40">
                          <Download className="w-4 h-4" />
                       </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full min-h-[350px] flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-border/40 rounded-2xl space-y-4 bg-card/10"
              >
                {loading ? (
                   <div className="space-y-4">
                      <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center mx-auto animate-spin-slow">
                        <Zap className="w-8 h-8 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-primary animate-pulse">Neural Matching</p>
                        <AnimatePresence mode="wait">
                          <motion.p key={thinkingStep} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="text-2xl font-black tracking-tight italic">
                            {thinkingSteps[thinkingStep]}
                          </motion.p>
                        </AnimatePresence>
                      </div>
                   </div>
                ) : (
                  <>
                    <div className="w-20 h-20 bg-muted rounded-xl flex items-center justify-center text-muted-foreground/20">
                      <Camera className="w-10 h-10" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-2xl font-black tracking-tighter">Ready for Analysis</p>
                      <p className="text-muted-foreground text-xs font-medium">Scan an object to begin identification.</p>
                    </div>
                  </>
                )}
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
