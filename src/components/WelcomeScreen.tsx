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

      <div className="relative z-10 pt-16">
        <h1 className="text-5xl font-extrabold tracking-tight leading-tight">
          Welcome,<br />Musician!
        </h1>
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
