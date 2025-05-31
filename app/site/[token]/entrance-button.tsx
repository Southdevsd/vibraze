"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart } from "lucide-react"

interface EntranceButtonProps {
  emoji: string
  onEnter: () => void
  siteTitle?: string
}

export default function EntranceButton({ emoji, onEnter, siteTitle }: EntranceButtonProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-100 to-pink-50 flex items-center justify-center p-4">
      {/* Background glow effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 text-center space-y-8">
        {/* Site title */}
        {siteTitle && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-2"
          >
            <h1 className="text-2xl md:text-3xl font-bold text-purple-800">{siteTitle}</h1>
            <div className="flex items-center justify-center gap-2 text-pink-400">
              <Heart className="w-5 h-5 fill-current" />
              <span className="text-sm">Contador de Amor</span>
              <Heart className="w-5 h-5 fill-current" />
            </div>
          </motion.div>
        )}

        {/* Main entrance button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <motion.button
            onClick={onEnter}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className="relative group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-400 via-purple-500 to-pink-400 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Button background */}
            <div className="relative bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl p-1">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-8 py-4 border border-pink-300/30">
                <div className="flex items-center justify-center gap-4">
                  {/* Emoji */}
                  <motion.div
                    animate={{
                      rotate: isHovered ? [0, -10, 10, 0] : 0,
                      scale: isHovered ? 1.1 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                    className="text-3xl md:text-4xl"
                  >
                    {emoji}
                  </motion.div>

                  {/* Click text */}
                  <motion.span
                    animate={{
                      color: isHovered ? "#ffffff" : "#f9fafb",
                    }}
                    className="text-xl md:text-2xl font-bold tracking-wider"
                  >
                    Entrar
                  </motion.span>
                </div>
              </div>
            </div>

            {/* Sparkle effects */}
            <AnimatePresence>
              {isHovered && (
                <>
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0],
                        x: Math.random() * 200 - 100,
                        y: Math.random() * 200 - 100,
                      }}
                      exit={{ opacity: 0 }}
                      transition={{
                        duration: 1.5,
                        delay: i * 0.1,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatDelay: 2,
                      }}
                      className="absolute w-2 h-2 bg-pink-300 rounded-full"
                      style={{
                        left: "50%",
                        top: "50%",
                      }}
                    />
                  ))}
                </>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-purple-700/80 text-sm md:text-base max-w-md mx-auto"
        >
          Clique para entrar e descobrir nossa história de amor
        </motion.p>

        {/* Floating hearts */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                opacity: 0,
                x: Math.random() * window.innerWidth,
                y: window.innerHeight + 50,
              }}
              animate={{
                opacity: [0, 0.6, 0],
                y: -50,
                x: Math.random() * window.innerWidth,
              }}
              transition={{
                duration: 8 + Math.random() * 4,
                delay: i * 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
              className="absolute text-pink-300/40 text-xl"
            >
              ❤️
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
