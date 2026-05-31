import Webcam from "react-webcam";
import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { Camera, RefreshCw, AlertCircle, Volume2, VolumeX, Download, Lightbulb, Trash2, Upload, Zap } from "lucide-react";
import { useTrashScanner } from "../hooks/useTrashScanner";

interface TrashClassifierProps {
  onResultSaved?: (item: any) => void;
}

const TrashClassifier = ({ onResultSaved }: TrashClassifierProps) => {
  const exportRef = useRef<HTMLDivElement>(null);
  const { webcamRef, fileInputRef, capturedImage, loading, result, error, thinkingStep, thinkingSteps, isSpeaking, capture, handleFileUpload, toggleVoice, downloadImage, reset } = useTrashScanner(onResultSaved);

  const getBinStyles = (warnaTong: string) => {
    if (warnaTong === "Hijau") {
      return {
        bgTint: "bg-emerald-500/5",
        badge: "bg-emerald-500 shadow-emerald-500/20",
        solid: "#10b981",
      };
    }
    if (warnaTong === "Kuning") {
      return {
        bgTint: "bg-amber-500/5",
        badge: "bg-amber-500 shadow-amber-500/20",
        solid: "#f59e0b",
      };
    }
    if (warnaTong === "Merah") {
      return {
        bgTint: "bg-rose-500/5",
        badge: "bg-rose-500 shadow-rose-500/20",
        solid: "#f43f5e",
      };
    }
    return {
      bgTint: "bg-slate-500/5",
      badge: "bg-slate-500 shadow-slate-500/20",
      solid: "#64748b",
    };
  };

  return (
    <div className="max-w-6xl mx-auto py-4 md:py-8 px-4 h-full flex flex-col justify-center min-h-[calc(100vh-100px)]">
      {/* Compact Header */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-6 gap-4">
        <div className="space-y-1">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full border border-primary/20">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-widest">Neural Scanner</span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter">
            EcoSort <span className="text-primary italic">Intelligence.</span>
          </h2>
        </div>
        <p className="text-muted-foreground font-medium text-xs max-w-[200px] text-right hidden md:block">Smart waste classification powered by Gemini Vision.</p>
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
                    <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" videoConstraints={{ facingMode: "environment" }} className="w-full h-full object-cover" />
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
                  <motion.div animate={{ top: ["0%", "100%", "0%"] }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} className="absolute left-0 right-0 h-1 bg-primary shadow-[0_0_15px_rgba(16,185,129,0.8)] z-10" />
                )}
              </div>

              <div className="mt-auto flex gap-2">
                {!capturedImage ? (
                  <>
                    <Button onClick={capture} disabled={loading} className="flex-grow h-12 rounded-xl bg-primary hover:scale-[1.02] transition-all gap-2">
                      <Camera className="w-4 h-4" />
                      <span className="font-black uppercase tracking-widest text-[9px]">Scan Object</span>
                    </Button>
                    <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
                    <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="w-12 h-12 rounded-xl border-2">
                      <Upload className="w-4 h-4" />
                    </Button>
                  </>
                ) : (
                  <Button onClick={reset} variant="outline" className="w-full h-12 rounded-xl border-2 font-black uppercase text-[9px] tracking-widest">
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
              <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="h-full">
                <div className={`h-full border border-border/50 rounded-2xl p-6 md:p-8 flex flex-col shadow-2xl relative overflow-hidden ${getBinStyles(result.warna_tong).bgTint}`}>
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                    <div className="space-y-1">
                      <p className="text-[9px] font-black uppercase tracking-[0.3em] text-primary">Neural Identify Result</p>
                      <h3 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight">{result.item}</h3>
                    </div>
                    <div className={`px-6 py-4 rounded-2xl flex flex-col items-center justify-center text-white text-center shadow-lg ${getBinStyles(result.warna_tong).badge}`}>
                      <Trash2 className="w-6 h-6" style={{ display: "inline-block", transform: "translateY(-3px)" }} />
                      <span className="text-center text-[8px] font-black uppercase" style={{ display: "inline-block", transform: "translateY(-3px)" }}>
                        {result.warna_tong} Bin
                      </span>
                    </div>
                  </div>

                  <div className="p-5 bg-card/60 backdrop-blur-sm rounded-xl border border-border/40 mb-6 flex-grow">
                    <p className="text-base font-bold leading-relaxed text-foreground/80 italic">"{result.penjelasan}"</p>
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
                      <button onClick={() => downloadImage(exportRef.current)} className="w-14 h-14 bg-muted rounded-xl flex items-center justify-center hover:bg-border active:scale-95 transition-all border border-border/40">
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

      {result && (
        <div className="fixed -left-[99999px] top-0 pointer-events-none opacity-0">
          <div
            ref={exportRef}
            style={{
              width: "1200px",
              minHeight: "1600px",
              background: "linear-gradient(160deg, #e2e8f0 0%, #f8fafc 45%, #dbeafe 100%)",
              padding: "72px",
              color: "#0f172a",
              fontFamily: '"Segoe UI", Arial, sans-serif',
            }}
          >
            <div style={{ borderRadius: "36px", overflow: "hidden", background: "#ffffff", border: "1px solid #dbe4ee", boxShadow: "0 26px 50px rgba(15,23,42,0.18)" }}>
              <div style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", color: "#f8fafc", padding: "44px 52px" }}>
                <p style={{ fontSize: "15px", textTransform: "uppercase", letterSpacing: "0.3em", color: "#cbd5e1", fontWeight: 800, margin: 0 }}>EcoSort Intelligence</p>
                <h2 style={{ fontSize: "66px", lineHeight: 1.06, fontWeight: 900, marginTop: "16px", marginBottom: "10px" }}>{result.item}</h2>
                <p style={{ margin: 0, fontSize: "22px", color: "#bfdbfe", fontWeight: 600 }}>Laporan klasifikasi objek berbasis AI</p>
              </div>

              <div style={{ padding: "48px 52px 52px 52px", display: "flex", flexDirection: "column", gap: "28px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "22px" }}>
                  <div style={{ borderRadius: "22px", overflow: "hidden", height: "280px", border: "1px solid #dbe4ee", background: "#e2e8f0" }}>
                    {capturedImage ? (
                      <img src={capturedImage} alt="Captured" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    ) : (
                      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b", fontWeight: 700 }}>Tidak ada foto</div>
                    )}
                  </div>
                  <div style={{ borderRadius: "22px", border: "1px solid #dbe4ee", background: "#f8fafc", padding: "28px" }}>
                    <p style={{ margin: 0, color: "#64748b", fontWeight: 700, fontSize: "20px" }}>Rekomendasi Tong</p>
                    <p style={{ marginTop: "8px", marginBottom: "20px", fontSize: "48px", lineHeight: 1.1, fontWeight: 900, color: getBinStyles(result.warna_tong).solid }}>{result.warna_tong}</p>
                    <p style={{ margin: 0, color: "#64748b", fontWeight: 700, fontSize: "20px" }}>Waktu Dibuat</p>
                    <p style={{ marginTop: "8px", marginBottom: 0, color: "#0f172a", fontSize: "24px", fontWeight: 700 }}>
                      {new Date().toLocaleString("id-ID", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <span style={{ display: "flex", alignItems: "center", height: "70px", fontSize: "32px", fontWeight: 700, color: "#334155", lineHeight: "70px" }}>Kategori</span>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "70px",
                      padding: "0 30px",
                      borderRadius: "999px",
                      background: getBinStyles(result.warna_tong).solid,
                      whiteSpace: "nowrap",
                    }}
                  >
                    <span
                      style={{
                        margin: 0,
                        fontSize: "30px",
                        fontWeight: 900,
                        color: "#fff",
                        lineHeight: 1,
                        textAlign: "center",
                        display: "block",
                      }}
                    >
                      {result.kategori}
                    </span>
                  </div>
                </div>

                <div style={{ borderRadius: "20px", border: "1px solid #dbe4ee", background: "#f8fafc", padding: "34px" }}>
                  <p style={{ fontSize: "18px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.14em", color: "#64748b", marginTop: 0, marginBottom: "14px" }}>Ringkasan</p>
                  <p style={{ fontSize: "40px", lineHeight: 1.42, fontWeight: 600, margin: 0 }}>{result.penjelasan}</p>
                </div>

                <div style={{ borderRadius: "20px", border: "1px solid #fcd34d", background: "#fffbeb", padding: "34px" }}>
                  <p style={{ fontSize: "18px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.14em", color: "#a16207", marginTop: 0, marginBottom: "14px" }}>Tips Pengelolaan</p>
                  <p style={{ fontSize: "40px", lineHeight: 1.42, fontWeight: 600, color: "#78350f", margin: 0 }}>{result.tips}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrashClassifier;
