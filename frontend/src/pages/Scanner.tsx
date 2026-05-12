import { motion } from 'framer-motion'
import TrashClassifier from '../components/TrashClassifier'

interface ScannerProps {
  addToHistory: (item: any) => void
}

const Scanner = ({ addToHistory }: ScannerProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }} 
      className="max-w-7xl mx-auto px-8 min-h-[calc(100vh-160px)] flex flex-col justify-center"
    >
      <TrashClassifier onResultSaved={addToHistory} />
    </motion.div>
  )
}

export default Scanner
