import { motion } from 'framer-motion'
import { Card, CardTitle } from '../components/ui/card'
import { Leaf, Recycle, AlertTriangle } from 'lucide-react'

const WASTE_CATEGORIES = [
  {
    title: 'Sampah Organik',
    desc: 'Limbah hayati yang berasal dari alam dan mudah terurai secara alami oleh mikroorganisme.',
    examples: 'Sisa makanan, dedaunan, kulit buah, ranting pohon.',
    icon: Leaf,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10'
  },
  {
    title: 'Sampah Anorganik',
    desc: 'Limbah buatan manusia yang sulit terurai secara alami namun sangat potensial untuk didaur ulang.',
    examples: 'Plastik, botol minum, kertas, kardus, kaca, kaleng.',
    icon: Recycle,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10'
  },
  {
    title: 'Limbah B3',
    desc: 'Bahan Berbahaya dan Beracun yang memerlukan penanganan khusus karena berisiko merusak lingkungan.',
    examples: 'Baterai, lampu neon, kabel, pestisida, obat kadaluwarsa.',
    icon: AlertTriangle,
    color: 'text-rose-500',
    bgColor: 'bg-rose-500/10',
    special: true
  }
]

const Education = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="max-w-7xl mx-auto px-8 py-12"
    >
      <div className="text-center mb-20 space-y-4">
        <h2 className="text-5xl lg:text-6xl font-black tracking-tighter">Waste Education</h2>
        <div className="w-16 h-2 bg-primary mx-auto rounded-full" />
        <p className="text-muted-foreground font-medium">Kenali jenis sampahmu untuk bumi yang lebih baik.</p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-10">
        {WASTE_CATEGORIES.map((cat, i) => (
          <Card 
            key={i} 
            className={`p-10 border-none shadow-xl bg-card flex flex-col h-full transition-all hover:-translate-y-2 ${cat.special ? 'ring-2 ring-rose-500/20' : ''}`}
          >
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 ${cat.bgColor}`}>
              <cat.icon className={`w-8 h-8 ${cat.color}`} />
            </div>
            <CardTitle className="mb-6 text-3xl font-black tracking-tight">{cat.title}</CardTitle>
            <p className="text-muted-foreground text-sm leading-relaxed mb-8 flex-grow font-medium">
              {cat.desc}
            </p>
            <div className="bg-muted p-5 rounded-2xl border border-border">
              <p className="text-[10px] font-black uppercase tracking-widest mb-3 opacity-60">Benda Umum:</p>
              <p className="text-xs font-bold leading-relaxed">{cat.examples}</p>
            </div>
          </Card>
        ))}
      </div>
    </motion.div>
  )
}

export default Education
