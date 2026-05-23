import { motion } from 'motion/react';

interface WelcomeScreenProps {
  onStart: () => void;
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="relative min-h-screen text-white flex flex-col justify-between p-8 font-sans overflow-hidden">
      {/* Fluid Gradient Background */}
      <motion.div 
        className="absolute inset-0 z-0 bg-gradient-to-br from-indigo-500 via-purple-600 to-cyan-500"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{ backgroundSize: '300% 300%' }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center flex-grow">
        <motion.h1 
          className="text-7xl font-extrabold tracking-tight leading-tight"
          animate={{ 
            scale: [1, 1.05, 1],
            filter: [
                "drop-shadow(0 0 5px rgba(255, 255, 255, 0.3))",
                "drop-shadow(0 0 15px rgba(255, 255, 255, 0.6))",
                "drop-shadow(0 0 5px rgba(255, 255, 255, 0.3))"
            ]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          SONUS
        </motion.h1>
      </div>

      <button 
        onClick={onStart}
        className="relative z-10 w-full bg-white/20 backdrop-blur-md text-white font-bold py-4 rounded-full text-lg shadow-xl hover:bg-white/30 transition mb-8 border border-white/20"
      >
        Start Exploring
      </button>
    </div>
  );
}
