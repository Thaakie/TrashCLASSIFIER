import Webcam from 'react-webcam';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { 
  Camera, RefreshCw, AlertCircle, Recycle, 
  Volume2, VolumeX, Download, FileText, Image as ImageIcon 
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
    <div className="w-full">
      <div className={`grid gap-8 transition-all duration-500 items-start ${result ? 'lg:grid-cols-2' : 'grid-cols-1 max-w-xl mx-auto'}`}>
        
        {/* Camera Section */}
        <motion.div layout className="relative w-full">
          <Card className="overflow-hidden border-none shadow-2xl bg-card rounded-[2.5rem] border border-border relative aspect-video">
            <div className="relative w-full h-full bg-slate-900 overflow-hidden">
              {!capturedImage ? (
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  className="w-full h-full object-cover"
                  videoConstraints={{ facingMode: 'environment', aspectRatio: 1.7777777778 }}
                />
              ) : (
                <img src={capturedImage} className="w-full h-full object-cover" alt="Captured" />
              )}

              <AnimatePresence>
                {loading && (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-slate-900/70 backdrop-blur-md flex flex-col items-center justify-center text-white z-20"
                  >
                    <motion.div 
                      className="absolute left-0 right-0 h-1 bg-primary shadow-[0_0_20px_white] z-30"
                      animate={{ top: ["0%", "100%", "0%"] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.div 
                      animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full"
                    />
                    <motion.p 
                      key={thinkingStep}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 font-black tracking-widest uppercase text-[9px] text-center px-6"
                    >
                      {thinkingSteps[thinkingStep]}
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Overlay Controls */}
              <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-4 z-10">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
                
                {!result && !loading ? (
                  <>
                    <Button 
                      onClick={() => fileInputRef.current?.click()} 
                      className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/30 shadow-xl hover:scale-105 transition-all p-0"
                    >
                      <ImageIcon className="w-5 h-5 text-white" />
                    </Button>
                    
                    <Button 
                      onClick={capture} 
                      className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 border-2 border-white/50 shadow-2xl hover:scale-105 transition-all p-0 group"
                    >
                      <Camera className="w-8 h-8 text-white" />
                    </Button>
                  </>
                ) : !loading && (
                  <Button onClick={reset} className="rounded-full px-6 py-2 bg-white/20 backdrop-blur-md hover:bg-white/40 border border-white/50 text-white gap-2 text-xs font-bold">
                    <RefreshCw className="w-4 h-4" /> Reset
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Result Section */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="w-full"
            >
              <Card className="border-none shadow-2xl bg-card rounded-[2.5rem] border border-border overflow-hidden flex flex-col h-full">
                <CardHeader className="pt-8 px-8 pb-3">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${
                        result.kategori === 'Organik' ? 'bg-[#4ade80]' : 
                        result.kategori === 'Anorganik' ? 'bg-[#facc15]' : 'bg-[#f87171]'
                      }`} />
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        {result.kategori}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="icon" variant="outline" onClick={toggleVoice} className={`w-9 h-9 rounded-full ${isSpeaking ? 'bg-primary text-primary-foreground animate-pulse' : 'hover:bg-muted'}`}>
                        {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </Button>
                      <Button size="icon" variant="outline" onClick={downloadImage} className="w-9 h-9 rounded-full hover:bg-muted"><Download className="w-4 h-4" /></Button>
                      <Button size="icon" variant="outline" onClick={() => window.print()} className="w-9 h-9 rounded-full hover:bg-muted"><FileText className="w-4 h-4" /></Button>
                    </div>
                  </div>
                  <CardTitle className="text-4xl font-black tracking-tighter text-foreground leading-tight">
                    {result.item}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="px-8 pb-10 space-y-6 flex-grow flex flex-col justify-between">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Analisis AI</p>
                    <p className="text-[14px] text-muted-foreground leading-relaxed font-medium">
                      {result.penjelasan}
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 items-stretch pt-6 border-t border-border">
                    <div className="p-5 rounded-3xl bg-muted/20 border border-border flex flex-col justify-center">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Tips Cepat</p>
                      <p className="text-[13px] text-muted-foreground leading-relaxed font-bold italic">"{result.tips}"</p>
                    </div>
                    
                    <div className="p-5 rounded-3xl bg-primary/5 border border-primary/10 flex flex-col items-center justify-center text-center">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 shadow-lg ${
                        result.kategori === 'Organik' ? 'bg-[#4ade80]' : 
                        result.kategori === 'Anorganik' ? 'bg-[#facc15]' : 'bg-[#f87171]'
                      }`}>
                        <Recycle className="text-white w-7 h-7" />
                      </div>
                      <p className="text-[10px] font-black uppercase text-muted-foreground mb-0.5">Wadah</p>
                      <p className="text-[14px] font-black text-foreground leading-tight">Tong {result.warna_tong}</p>
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
            <Alert variant="destructive" className="rounded-[2rem] bg-card border-2 border-[#f87171] shadow-xl">
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
