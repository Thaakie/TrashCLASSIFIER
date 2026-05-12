import { motion } from 'framer-motion'
import { Card, CardTitle } from '../components/ui/card'
import { Info, User } from 'lucide-react'

const About = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="max-w-4xl mx-auto px-8 py-12 text-center space-y-16"
    >
      <div className="space-y-4">
        <h2 className="text-6xl font-black tracking-tighter">About EcoSort</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed font-medium">
          EcoSort adalah inisiatif berbasis AI untuk membantu Indonesia mengatasi krisis pengelolaan sampah melalui teknologi Computer Vision tercanggih.
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-10 text-left">
        <Card className="p-10 border-none shadow-lg bg-card">
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-8">
            <Info className="w-7 h-7 text-primary" />
          </div>
          <CardTitle className="mb-4 text-2xl font-black text-foreground">Visi Kami</CardTitle>
          <p className="text-muted-foreground text-sm leading-relaxed font-medium">
            Membangun kesadaran lingkungan yang cerdas di mana setiap individu mampu memilah sampah dengan benar secara instan menggunakan perangkat genggam.
          </p>
        </Card>
        <Card className="p-10 border-none shadow-lg bg-card">
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-8">
            <User className="w-7 h-7 text-primary" />
          </div>
          <CardTitle className="mb-4 text-2xl font-black text-foreground">Misi Teknologi</CardTitle>
          <p className="text-muted-foreground text-sm leading-relaxed font-medium">
            Memanfaatkan Gemini 3 Flash Thinking Mode untuk memberikan edukasi sampah yang tidak hanya cepat, tapi juga mendalam dan solutif.
          </p>
        </Card>
      </div>
    </motion.div>
  )
}

export default About
