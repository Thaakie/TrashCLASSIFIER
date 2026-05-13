import { motion } from 'framer-motion'
import { Recycle, BarChart3, Leaf, ShieldCheck, History as HistoryIcon, ArrowUpRight } from 'lucide-react'

interface ImpactProps {
  history: any[]
  stats: {
    total: number
    carbon: string
    points: number
  }
}

const Impact = ({ history, stats }: ImpactProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="max-w-7xl mx-auto px-8 py-10"
    >
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Title & Stats */}
        <div className="lg:col-span-5 space-y-10">
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-block px-4 py-1.5 bg-primary/5 text-primary rounded-full text-[10px] font-black uppercase tracking-[0.2em]"
            >
              Environmental Impact
            </motion.div>
            <h2 className="text-4xl lg:text-6xl font-black tracking-tighter leading-[0.9] text-balance">
              Your Eco <br /> <span className="text-primary italic">Contribution.</span>
            </h2>
            <p className="text-muted-foreground font-medium text-base leading-relaxed max-w-md">
              Setiap sampah yang Anda klasifikasikan adalah langkah nyata menuju Indonesia yang lebih bersih.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            <div className="bg-primary text-primary-foreground p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
              <div className="relative z-10 space-y-4">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Total Analysed</p>
                  <p className="text-4xl font-black tracking-tighter">
                    {stats.total} <span className="text-xs opacity-60 font-medium tracking-normal">Items</span>
                  </p>
                </div>
              </div>
              <ArrowUpRight className="absolute top-6 right-6 w-5 h-5 opacity-20" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card p-6 rounded-[2.5rem] shadow-lg border border-border relative overflow-hidden group">
                <div className="relative z-10 space-y-4">
                  <div className="w-10 h-10 bg-emerald-500/10 text-emerald-600 rounded-xl flex items-center justify-center">
                    <Leaf className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">CO2 Saved</p>
                    <p className="text-3xl font-black text-emerald-600 tracking-tighter">
                      {stats.carbon}<span className="text-xs opacity-60 font-medium text-muted-foreground tracking-normal ml-1">kg</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-card p-6 rounded-[2.5rem] shadow-lg border border-border relative overflow-hidden group">
                <div className="relative z-10 space-y-4">
                  <div className="w-10 h-10 bg-blue-500/10 text-blue-600 rounded-xl flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Eco Points</p>
                    <p className="text-3xl font-black text-blue-600 tracking-tighter">
                      {stats.points}<span className="text-xs opacity-60 font-medium text-muted-foreground tracking-normal ml-1">Pts</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: History */}
        <div className="lg:col-span-7 bg-card border border-border rounded-[3.5rem] p-8 min-h-[500px] flex flex-col shadow-xl relative">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-0.5">
              <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Recent History</p>
              <h3 className="text-xl font-black tracking-tight">Timeline Activity</h3>
            </div>
            {history.length > 0 && (
              <div className="px-3 py-1.5 glass dark:glass-dark rounded-xl border border-primary/10 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[8px] font-black uppercase tracking-widest">Active session</span>
              </div>
            )}
          </div>

          <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar space-y-3 max-h-[600px]">
            {history.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center py-20 space-y-4">
                <div className="w-20 h-20 bg-muted rounded-[2rem] flex items-center justify-center">
                  <HistoryIcon className="w-10 h-10 text-muted-foreground/20" />
                </div>
                <p className="text-muted-foreground font-black uppercase tracking-widest text-[9px]">No scan history found yet</p>
              </div>
            ) : (
              history.map((item, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: i * 0.05 }} 
                  className="bg-muted/30 p-5 rounded-[2rem] border border-transparent hover:border-primary/10 hover:bg-muted/50 transition-all flex justify-between items-center group"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm group-hover:rotate-12 transition-transform ${
                      item.kategori === 'Organik' ? 'bg-emerald-500 text-white' : 
                      item.kategori === 'Anorganik' ? 'bg-amber-500 text-white' : 
                      item.kategori === 'B3' ? 'bg-rose-500 text-white' :
                      'bg-slate-500 text-white'
                    }`}>
                      <Recycle className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-black text-base tracking-tight group-hover:text-primary transition-colors line-clamp-1">{item.item}</h3>
                      <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest opacity-60">
                        {item.kategori} • {item.warna_tong} Bin
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black tracking-tighter text-foreground">+15</p>
                    <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Points</p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default Impact
