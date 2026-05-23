import { useState, useEffect, useRef } from 'react';
import { Mic, ArrowLeft } from 'lucide-react';

// Frequency mapping to notes (A4 = 440Hz)
const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

function getNoteFromFrequency(frequency: number) {
  const noteNum = 12 * (Math.log(frequency / 440) / Math.log(2)) + 69;
  const roundedNote = Math.round(noteNum);
  const noteName = NOTE_NAMES[roundedNote % 12];
  const octave = Math.floor(roundedNote / 12) - 1;
  const centralFrequency = 440 * Math.pow(2, (roundedNote - 69) / 12);
  const cents = Math.floor(1200 * Math.log(frequency / centralFrequency) / Math.log(2));
  return { note: `${noteName}${octave}`, cents };
}

export default function TunerTools({ onBack }: { onBack: () => void }) {
  const [frequency, setFrequency] = useState(0);
  const [note, setNote] = useState('---');
  const [cents, setCents] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  const startTuner = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.fftSize = 2048;
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      setIsListening(true);
      
      const buffer = new Float32Array(analyser.frequencyBinCount);
      const update = () => {
        analyser.getFloatTimeDomainData(buffer);
        // Basic autocorrelation-like estimation for pitch
        let maxVal = 0;
        for (let i = 0; i < buffer.length; i++) {
            if (Math.abs(buffer[i]) > maxVal) maxVal = Math.abs(buffer[i]);
        }
        if (maxVal > 0.05) { // Sensitivity threshold
            // Simple zero-crossing estimation
            let count = 0;
            for (let i = 1; i < buffer.length; i++) {
                if ((buffer[i-1] <= 0 && buffer[i] > 0) || (buffer[i-1] >= 0 && buffer[i] < 0)) count++;
            }
            const freq = (audioContext.sampleRate * count) / (2 * buffer.length);
            if (freq > 50 && freq < 1000) {
                setFrequency(Math.round(freq));
                const details = getNoteFromFrequency(freq);
                setNote(details.note);
                setCents(details.cents);
            }
        }
        requestAnimationFrame(update);
      };
      update();
    } catch (e) {
      console.error("Error accessing mic:", e);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white rounded-3xl p-6">
      <header className="flex items-center mb-12">
        <button onClick={onBack} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-bold flex-grow text-center pr-10">Tuner</h2>
      </header>
      
      <div className="flex-grow flex flex-col items-center justify-center gap-12">
        {/* Needle-style Meter Visualization: Pro-grade gradient meter */}
        <div className="w-full relative h-32 bg-slate-900 rounded-2xl p-6 border border-slate-800 flex flex-col items-center shadow-inner">
            <div className="text-4xl text-white font-mono font-bold mb-4">{note}</div>
            
            <div className="relative w-full h-4 flex items-center">
                {/* Gradient scale */}
                <div className="w-full h-3 rounded-full bg-gradient-to-r from-red-500 via-emerald-500 to-red-500 opacity-60"></div>                
                {/* Center marker */}
                <div className="absolute left-1/2 h-6 w-0.5 bg-white opacity-40"></div>
                {/* Moving needle */}
                <div 
                    className="absolute h-8 w-1 bg-white rounded-full shadow-[0_0_15px_white] transition-all duration-75 ease-out"
                    style={{ left: `${Math.min(96, Math.max(4, 50 + (cents / 100) * 45))}%` }}
                ></div>
            </div>
            <div className="flex justify-between w-full text-[10px] text-slate-500 mt-2 font-mono">
                <span>-50</span>
                <span>0</span>
                <span>+50</span>
            </div>
        </div>

        <div className="text-center">
            <div className="text-9xl font-extrabold font-mono tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400">
                {frequency || '---'}
            </div>
            <div className="text-3xl font-medium text-slate-500 tracking-widest uppercase">Hz</div>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
          <button 
            onClick={startTuner} 
            className={`transition-all p-8 rounded-full w-24 h-24 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.5)] ${isListening ? 'bg-slate-800' : 'bg-emerald-500 hover:bg-emerald-400'}`}
          >
            <Mic size={40} className={isListening ? 'text-emerald-500' : 'text-slate-950'} />
          </button>
      </div>
    </div>
  );
}
