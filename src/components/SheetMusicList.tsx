import { useState, useEffect } from 'react';
import { Search, MoreHorizontal, Music, Heart, Plus, X, Trash2, Edit2, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { subscribeToSongs, Song, addSong, updateSong, deleteSong } from '../lib/db';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, signInWithRedirect, GoogleAuthProvider } from 'firebase/auth';

interface SheetMusicListProps {
  onSongClick: (song: Song) => void;
}

export default function SheetMusicList({ onSongClick }: SheetMusicListProps) {
  const [songs, setSongs] = useState<Song[]>([]);
  const [activeTab, setActiveTab] = useState('Recent');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [newSong, setNewSong] = useState({ title: '', artist: '', chords: '' });

  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToSongs(setSongs);
    const authUnsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setIsAdmin(u?.email?.toLowerCase() === 'eliseortega20@gmail.com');
    });
    return () => { unsubscribe(); authUnsubscribe(); };
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
        await signInWithRedirect(auth, provider);
    } catch (error) {
        console.error("Error logging in:", error);
    }
  };

  const handleSaveSong = async () => {
    if (newSong.title && newSong.artist) {
      if (editingSong) {
        await updateSong(editingSong.id, newSong);
      } else {
        await addSong({ ...newSong }, crypto.randomUUID());
      }
      setNewSong({ title: '', artist: '', chords: '' });
      setEditingSong(null);
      setShowAddForm(false);
    }
  };

  const handleEditSong = (e: React.MouseEvent, song: Song) => {
    e.stopPropagation();
    setEditingSong(song);
    setNewSong({ title: song.title, artist: song.artist, chords: song.chords });
    setShowAddForm(true);
  };

  const handleDeleteSong = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this song?")) {
      await deleteSong(id);
    }
  };

  const filteredSongs = songs.filter(song => {
    const matchesSearch = song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'Favorites' ? favorites.includes(song.id) : true;
    return matchesSearch && matchesTab;
  });

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans p-4 pb-24">
      <div className="flex justify-between items-center mb-6 mt-4">
        <h1 className="text-3xl font-bold tracking-tight">Sheet Music Menu</h1>
        {isAdmin && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-blue-600 font-medium">Admin Mode</span>
            <button onClick={() => setShowAddForm(true)} className="p-2 bg-blue-600 text-white rounded-full">
              <Plus size={24} />
            </button>
          </div>
        )}
        <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">
                {user ? `Logged in as: ${user.email}` : (
                    <button onClick={handleLogin} className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-lg">
                        <LogIn size={14} /> Log In
                    </button>
                )}
            </span>
        </div>
      </div>
            {showAddForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{editingSong ? 'Edit Song' : 'Add New Song'}</h2>
              <button onClick={() => { setShowAddForm(false); setEditingSong(null); setNewSong({ title: '', artist: '', chords: '' }); }}><X size={24} /></button>
            </div>
            <input 
              placeholder="Title"
              className="w-full p-3 mb-3 bg-gray-100 rounded-xl"
              value={newSong.title}
              onChange={e => setNewSong({...newSong, title: e.target.value})}
            />
            <input 
              placeholder="Artist"
              className="w-full p-3 mb-3 bg-gray-100 rounded-xl"
              value={newSong.artist}
              onChange={e => setNewSong({...newSong, artist: e.target.value})}
            />
            <textarea 
              placeholder="Chords"
              className="w-full p-3 mb-3 bg-gray-100 rounded-xl"
              value={newSong.chords}
              onChange={e => setNewSong({...newSong, chords: e.target.value})}
            />
            <button onClick={handleSaveSong} className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold">
              {editingSong ? 'Save Changes' : 'Save Song'}
            </button>
          </div>
        </div>
      )}

      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search" 
          className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all" 
        />
      </div>

      <div className="flex gap-6 mb-6 text-sm font-medium text-gray-500 border-b border-gray-100 pb-2">
        {['Recent', 'Favorites', 'All Songs'].map(tab => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)}
            className={`${activeTab === tab ? 'text-gray-900 border-b-2 border-gray-900' : ''} pb-2`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredSongs.map(song => (
          <motion.div 
            key={song.id}
            whileHover={{ scale: 1.01 }}
            className="flex items-center gap-4 p-2 cursor-pointer"
            onClick={() => onSongClick(song)}
          >
            <div className="w-14 h-14 bg-gray-200 rounded-xl flex items-center justify-center text-gray-500">
              <Music size={24} />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">{song.title}</p>
              <p className="text-sm text-gray-500">{song.artist}</p>
            </div>
            <button onClick={(e) => toggleFavorite(e, song.id)} className="mr-2">
              <Heart size={20} className={favorites.includes(song.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
            </button>
            {isAdmin && (
                <>
                  <button onClick={(e) => handleEditSong(e, song)} className="text-gray-400 hover:text-blue-500 mr-2">
                      <Edit2 size={20} />
                  </button>
                  <button onClick={(e) => handleDeleteSong(e, song.id)} className="text-gray-400 hover:text-red-500 mr-2">
                      <Trash2 size={20} />
                  </button>
                </>
            )}
            <button className="text-gray-400"><MoreHorizontal /></button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
