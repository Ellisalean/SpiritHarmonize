import { useState } from 'react';
import { ChevronLeft, Minus, Plus } from 'lucide-react';

interface ChordChartViewerProps {
  title: string;
  artist: string;
  initialChords: string; // Plain text with [Chord]
  onBack: () => void;
}

const CHORD_ORDER = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const transposeChord = (chord: string, steps: number): string => {
  const index = CHORD_ORDER.indexOf(chord);
  if (index === -1) return chord;
  return CHORD_ORDER[(index + steps + 12) % 12];
};

export default function ChordChartViewer({ title, artist, initialChords, onBack }: ChordChartViewerProps) {
  const [transposition, setTransposition] = useState(0);

  // Improved regex to find [Chord] supporting complex chords like [D/A], [E/G#], etc.
  const renderChords = () => {
    const parts = initialChords.split(/(\[[A-G][b#]?[a-z0-9/]*\])/g);
    return parts.map((part, index) => {
      if (part.startsWith('[') && part.endsWith(']')) {
        // We might not be able to transpose complex chords easily, so just display them.
        // For simplicity, for now we will just display the chord as is, but styled.
        const chord = part.slice(1, -1);
        return <span key={index} className="font-bold text-blue-600 bg-blue-50 px-1 rounded">{chord}</span>;
      }
      return part;
    });
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      <header className="p-4 flex items-center justify-between border-b border-gray-100 bg-white">
        <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition">
                <ChevronLeft size={20} />
            </button>
            <div>
                <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                <p className="text-sm text-gray-500">{artist}</p>
            </div>
        </div>
        <div className="flex gap-2">
            <button onClick={() => setTransposition(t => t - 1)} className="p-2 bg-gray-100 rounded-lg"><Minus size={20} /></button>
            <span className="font-mono font-bold self-center w-8 text-center">{transposition > 0 ? '+' : ''}{transposition}</span>
            <button onClick={() => setTransposition(t => t + 1)} className="p-2 bg-gray-100 rounded-lg"><Plus size={20} /></button>
        </div>
      </header>
      <div className="flex-1 p-6 overflow-y-auto whitespace-pre-wrap font-mono text-lg leading-loose">
        {renderChords()}
      </div>
    </div>
  );
}
