import { auth, db } from './firebase';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDoc,
  query,
  onSnapshot,
  where
} from 'firebase/firestore';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: any;
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Entity: Song
export interface Song {
  id: string;
  title: string;
  artist: string;
  pdfUrl?: string;
  chords: string;
}

export interface Setlist {
  id: string;
  name: string;
  date: string;
  songIds: string[];
}

const SONGS_COLLECTION = 'songs_v3';
const SETLISTS_COLLECTION = 'setlists';

export async function getSongs(): Promise<Song[]> {
  try {
    const q = query(collection(db, SONGS_COLLECTION));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Song));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, SONGS_COLLECTION);
    return [];
  }
}

export function subscribeToSongs(callback: (songs: Song[]) => void): () => void {
  const q = query(collection(db, SONGS_COLLECTION));
  return onSnapshot(q, (querySnapshot) => {
    console.log(`Snapshot received, ${querySnapshot.size} documents.`);
    const songs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Song));
    console.log("Songs:", songs);
    callback(songs);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, SONGS_COLLECTION);
  });
}

export async function addSong(song: Omit<Song, 'id'>, id: string): Promise<string> {
  try {
    // Check if song already exists
    const q = query(
        collection(db, SONGS_COLLECTION), 
        where("title", "==", song.title), 
        where("artist", "==", song.artist)
    );
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
        console.log(`Song "${song.title}" by ${song.artist} already exists.`);
        return querySnapshot.docs[0].id;
    }

    const docRef = await addDoc(collection(db, SONGS_COLLECTION), { ...song, id });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, SONGS_COLLECTION);
    return '';
  }
}

export async function updateSong(id: string, song: Partial<Song>): Promise<void> {
  try {
    await updateDoc(doc(db, SONGS_COLLECTION, id), song);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${SONGS_COLLECTION}/${id}`);
  }
}

export async function deleteSong(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, SONGS_COLLECTION, id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${SONGS_COLLECTION}/${id}`);
  }
}

export async function getSetlists(): Promise<Setlist[]> {
  try {
    const q = query(collection(db, SETLISTS_COLLECTION));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Setlist));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, SETLISTS_COLLECTION);
    return [];
  }
}

export async function addSetlist(setlist: Omit<Setlist, 'id'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, SETLISTS_COLLECTION), setlist);
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, SETLISTS_COLLECTION);
    return '';
  }
}

export async function updateSetlist(id: string, setlist: Partial<Setlist>): Promise<void> {
  try {
    await updateDoc(doc(db, SETLISTS_COLLECTION, id), setlist);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${SETLISTS_COLLECTION}/${id}`);
  }
}

export async function deleteSetlist(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, SETLISTS_COLLECTION, id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${SETLISTS_COLLECTION}/${id}`);
  }
}
