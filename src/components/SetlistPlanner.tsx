import { useState, useEffect } from 'react';
import { Song, Setlist, getSetlists, addSetlist, updateSetlist, deleteSetlist, getSongs } from '../lib/db';
import { Plus, X, Trash2 } from 'lucide-react';

interface SetlistPlannerProps {
  onBack: () => void;
  onSelectSetlist: (setlist: Setlist) => void;
}

export default function SetlistPlanner({ onBack, onSelectSetlist }: SetlistPlannerProps) {
  const [setlists, setSetlists] = useState<Setlist[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [newSetlistName, setNewSetlistName] = useState('');
  const [editingSetlist, setEditingSetlist] = useState<Setlist | null>(null);

  useEffect(() => {
    async function loadData() {
      const [fetchedSetlists, fetchedSongs] = await Promise.all([getSetlists(), getSongs()]);
      setSetlists(fetchedSetlists);
      setSongs(fetchedSongs);
    }
    loadData();
  }, []);

  const createSetlist = async () => {
    if (!newSetlistName) return;
    const newId = await addSetlist({ name: newSetlistName, date: new Date().toISOString(), songIds: [] });
    setSetlists([...setlists, { id: newId, name: newSetlistName, date: new Date().toISOString(), songIds: [] }]);
    setNewSetlistName('');
  };

  const toggleSongInSetlist = async (setlist: Setlist, songId: string) => {
    const isSelected = setlist.songIds.includes(songId);
    const newSongIds = isSelected 
      ? setlist.songIds.filter(id => id !== songId)
      : [...setlist.songIds, songId];
    
    const updatedSetlist = { ...setlist, songIds: newSongIds };
    await updateSetlist(setlist.id, updatedSetlist);
    setSetlists(setlists.map(s => s.id === setlist.id ? updatedSetlist : s));
    setEditingSetlist(updatedSetlist);
  };

  const deleteSetlistById = async (id: string) => {
    await deleteSetlist(id);
    setSetlists(setlists.filter(s => s.id !== id));
  };

  return (
    <div className="p-4 bg-white min-h-screen">
      <header className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Setlist Planner</h2>
        <button onClick={onBack} className="text-gray-500">Close</button>
      </header>

      <div className="mb-8">
        <input 
          value={newSetlistName}
          onChange={(e) => setNewSetlistName(e.target.value)}
          placeholder="New Setlist Name"
          className="w-full p-3 bg-gray-100 rounded-lg mb-2"
        />
        <button onClick={createSetlist} className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold flex items-center justify-center gap-2">
            <Plus size={20} /> Create Setlist
        </button>
      </div>

      <div className="space-y-6">
        {setlists.map(setlist => (
          <div key={setlist.id} className="p-4 border rounded-2xl shadow-sm cursor-pointer hover:bg-gray-50" onClick={() => onSelectSetlist(setlist)}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">{setlist.name}</h3>
              <div className="flex gap-2">
                  <button onClick={(e) => { e.stopPropagation(); setEditingSetlist(setlist); }} className="text-blue-600 font-medium">Edit</button>
                  <button onClick={(e) => { e.stopPropagation(); deleteSetlistById(setlist.id); }} className="text-red-500"><Trash2 size={18} /></button>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-2">{setlist.songIds.length} songs</p>
          </div>
        ))}
      </div>

      {editingSetlist && (
        <div className="fixed inset-0 bg-black/50 p-4 flex items-center justify-center">
            <div className="bg-white p-6 rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto">
                <header className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-xl">{editingSetlist.name}</h3>
                    <button onClick={() => setEditingSetlist(null)}><X /></button>
                </header>
                <div className="space-y-4">
                    <div>
                        <h4 className="font-semibold text-sm text-gray-500 mb-2">Selected Songs (in order)</h4>
                        {editingSetlist.songIds.map(id => {
                            const song = songs.find(s => s.id === id);
                            if (!song) return null;
                            return (
                                <button 
                                    key={song.id}
                                    onClick={() => toggleSongInSetlist(editingSetlist, song.id)}
                                    className="w-full p-3 rounded-lg flex justify-between items-center bg-blue-100 text-blue-800 mb-2"
                                >
                                    {song.title} - {song.artist}
                                    <span className="text-blue-600 font-bold">✓</span>
                                </button>
                            );
                        })}
                    </div>
                    <div>
                        <h4 className="font-semibold text-sm text-gray-500 mb-2">Available Songs</h4>
                        {songs.filter(s => !editingSetlist.songIds.includes(s.id)).map(song => (
                            <button 
                                key={song.id}
                                onClick={() => toggleSongInSetlist(editingSetlist, song.id)}
                                className="w-full p-3 rounded-lg flex justify-between items-center bg-gray-100 mb-2"
                            >
                                {song.title} - {song.artist}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
