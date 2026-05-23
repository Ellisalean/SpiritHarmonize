import { motion } from 'motion/react';

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onAnimationComplete={() => setTimeout(onFinish, 1500)}
            className="flex flex-col items-center justify-center min-h-screen bg-slate-950 p-6"
        >
            <motion.div
                animate={{ 
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    scale: [1, 1.02, 1],
                    filter: [
                        "drop-shadow(0 0 5px rgba(59, 130, 246, 0.3))",
                        "drop-shadow(0 0 15px rgba(139, 92, 246, 0.6))",
                        "drop-shadow(0 0 5px rgba(59, 130, 246, 0.3))"
                    ]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="text-7xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-blue-400"
                style={{
                    backgroundSize: '200% auto',
                }}
            >
                SONUS
            </motion.div>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0.5] }}
                transition={{ delay: 1, duration: 3, repeat: Infinity }}
                className="mt-6 text-slate-500 font-medium tracking-widest uppercase text-sm"
            >
                Ministerios de Música
            </motion.div>
        </motion.div>
    );
}
