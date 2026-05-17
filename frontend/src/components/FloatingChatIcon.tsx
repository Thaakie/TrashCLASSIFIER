import { MessageCircle, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

type FloatingChatIconProps = {
  onClick: () => void
  hasUnread?: boolean
  isOpen?: boolean
}

const FloatingChatIcon = ({ onClick, hasUnread = false, isOpen = false }: FloatingChatIconProps) => {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.9, rotate: -10 }}
      animate={{ scale: isOpen ? 1.05 : 1, rotate: isOpen ? 8 : 0 }}
      transition={{ type: 'spring', stiffness: 320, damping: 20 }}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-xl hover:scale-105 transition-transform"
      aria-label="Buka chatbot edukasi sampah"
    >
      <span className="relative w-6 h-6 mx-auto flex items-center justify-center">
        <AnimatePresence mode="wait" initial={false}>
          {isOpen ? (
            <motion.span
              key="close"
              initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
              transition={{ duration: 0.16 }}
              className="absolute"
            >
              <X className="w-6 h-6" />
            </motion.span>
          ) : (
            <motion.span
              key="chat"
              initial={{ opacity: 0, rotate: 90, scale: 0.6 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: -90, scale: 0.6 }}
              transition={{ duration: 0.16 }}
              className="absolute"
            >
              <MessageCircle className="w-6 h-6" />
            </motion.span>
          )}
        </AnimatePresence>
      </span>
      {hasUnread && (
        <motion.span
          initial={{ scale: 0.8, opacity: 0.7 }}
          animate={{ scale: [0.9, 1.2, 1], opacity: 1 }}
          transition={{ repeat: Infinity, duration: 1.2 }}
          className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-rose-500 border-2 border-background"
        />
      )}
    </motion.button>
  )
}

export default FloatingChatIcon
