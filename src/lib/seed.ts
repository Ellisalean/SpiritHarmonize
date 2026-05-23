import { getSongs, deleteSong, addSong } from './db';
import { db } from './firebase';
import { collection, deleteDoc, doc, addDoc, setDoc, writeBatch, getDocs } from 'firebase/firestore';

const SONGS_COLLECTION = 'songs_v3';

const initialSongs = [
  {
      title: 'Medley Coritos',
      artist: 'Israel & New Breed',
      pdfUrl: 'https://drive.google.com/file/d/1pedhl35HmjLeRrfdiP0bC1N8xOv3qfsG/preview',
      chords: "[In] INTERLUDIO\n(Toda la banda entra con fuerza)\n\n1. CORITO: \"CON MIS MANOS Y MI VIDA\"\n[V1] VERSO 1\n[C] Con mis manos y mi vida te alabo Señor\n\n[C] CORO 1\n[Fmaj7] Porque Tú has sido\n[Em7] [Ebm7] [Dm7] Precioso para mí\n[G7sus4] [C] [Dm7] Precioso para mí\n[C/E] [C] [Fmaj7] Por que Tú has sido\n[Em7] [Ebm7] [Dm7] Precioso para mí\n[F/G] [C] Por eso te alabo Señor\n\n2. CORITO: \"ALABARÉ\"\n[C] CORO\n[Fmaj7] Alabaré, porque Tú has sido precioso para mí\n[G7sus4] [C] [Dm7] Precioso para mí\n[G] [C] Alabaré a mi Señor\n[Am7] [G] Alabaré, alabaré\n[F] [C] Alabaré a mi Señor\n\n[Vp] VAMP\n[C/E] [Fmaj7] Porque Tú has sido\n[Em7] [Ebm7] [Dm7] Precioso para mí\n[F/G] [C] Por eso te alabo Señor\n\n[PC] POST CORO\n[C] [C/G] [C] [C/G] Alabaré, alabaré\n[C] [G] Alabaré a mi Señor\n[C] Alabaré, alabaré\n[G] [C] Alabaré a mi Señor\n\n3. CORITO: \"TE ALABARÁN OH JEHOVÁ\"\n[V2] VERSO 2\n[C] Te alabarán oh Jehová todos los reyes\n[G] Todos los reyes de la tierra Porque han oído los dichos de Tu boca\n[G] [F] Y cantarán de los\n[Em] [Dm] [C] Caminos de Jehová\n\n4. CORITO: \"JUAN VIO EL NÚMERO\"\n[P1] PUENTE 1\n[C] Juan vio el número de los redimidos\n[G] De los que alababan al Señor\nUnos cantaban, otros oraban\n[C] Pero todos alababan al Señor\n\n[V2] VERSO 2\n[C] Te alabarán oh Jehová todos los reyes\n[G] Todos los reyes de la tierra Porque han oído los dichos de tu boca\n[G] [F] Y cantarán de los\n[Em] [Dm] [C] Caminos de Jehová\n\n[It] INTERLUDIO\n[F] [G] [A] [B7] [C7] [C]\n\n[C2] CORO 2\n[C] Porque la gloria de Jehová es grande\nPorque Jehová es perfecto\n[C] [G/B] En sus caminos\n[Am] [G] Porque Jehová atiende al humilde\n[G] [F] [Em] [Dm] [C] Más mira de lejos al altivo"
  },
  {
      title: 'Alaba Praise',
      artist: 'Elevation Worship',
      pdfUrl: 'https://drive.google.com/file/d/1dm-HBcGsuSTYY0n2Cg3ZRcnzF07s9LSv/preview',
      chords: "Intro: \n[A] [E] [F#m] [D]\n\nVERSO 1\n[A]\nTe alabo en el valle\n[D/A] [A]\nTe alabo en el monte\n[E/A] [D/A]\nTe alabo en el día\n[A]\nTe alabo en la noche\n[A]\nTe alabo en el medio\n[D/A] [A]\nEstando rodeado\n[E/G#] [D/A]\nPorque cuando alabo\n[A]\nTú estás a mi lado\n\nPRE-CORO\n[E]\nMientras tenga aliento\n[D]\nMi alma canta y\n\nCORO 1\n[F#m] [D] [A]\nA - la - ba a Dios\n[E]\nMi corazón\n[F#m] [D] [A]\nA - la - ba a Dios\n[E]\nMi corazón\n\nVERSO 2\n[A]\nTe alabo al sentirlo\n[D/A] [A]\nY aun cuando no\n[E/A]\nTe alabo y sé\n[D/A] [A]\nQue estás en control\n[A]\nEs más que un sonido\n[D/A] [A]\nEs adoración\n[E/G#] [D/A]\nY cuando alabamos\n[A]\nCaerá Jericó\n\nCORO 2\n[F#m] [D] [A]\nA - la - ba a Dios\n[E]\nMi corazón\n[F#m] [D] [A]\nA - la - ba a Dios\n[E]\nMi corazón\n[F#m]\nNo me detengo\n[D]\nMi Dios vivo está\n[A] [E]\nCómo me voy a callar\n[F#m] [D] [A] [E] [A]\nA - la - ba a Dios mi corazón\n\nPUENTE 1\n[A]\nAlabo al que reina\n[A]\nAlabo al Señor\n[A]\nAlabo a aquel que la tumba venció\n[A]\nAlabo al que es bueno\n[A]\nAlabo al que es fiel\n[A]\nLe alabo porque no hay otro como él\n\nPUENTE 2\n[A]\nAlabo al que reina\n[Bm]\nAlabo al Señor\n[F#m] [D]\nAlabo a aquel que la tumba venció\n[A]\nAlabo al que es bueno\n[Bm]\nAlabo al que es fiel\n[F#m] [D]\nLe alabo porque no hay otro como él\n\nCORO 2\n[F#m] [D] [A]\nA - la - ba a Dios\n[E]\nMi corazón\n[F#m] [D] [A]\nA - la - ba a Dios\n[E]\nMi corazón\n[F#m]\nNo me detengo\n[D]\nMi Dios vivo está\n[A] [E]\nCómo me voy a callar\n[F#m] [D] [A] [E] [A]\nA - la - ba a Dios mi corazón\n\nVAMP\nQue toda la creación\nAlabe a Dios\nAlabe a Dios"
  },
  {
      title: 'Queremos Fuego',
      artist: 'Jesus Worship Center',
      pdfUrl: '',
      chords: "[Intro]\n[Am] [G] [F] [Dm] [F] [E]\n[E] [Am] [E] [Am] [G] [F]\n[E] [Am] [E] [F] [G] [Am]\n\n[Verso]\n\n[Am]\nEstamos reunidos, con un solo motivo\n[F] [G]\nAlabando tú nombre, buscando más de ti\n[Am]\nSabemos que respondes, cuando tu pueblo clama\n[F] [G]\nQueremos ver tu gloria, visítanos señor\n\n[Pre-Estribillo]\n\n[E] [Am]\nCon ese fuego que quema...el que de gozo me llena\n[G] [C]\nEs ese fuego que invade...mi corazón\n[G] [E] [Am]\nCon ese fuego que quema...el que de gozo me llena\n[F] [Dm] [E]\nOh que el poder de tu espíritu venga, a ese lugar\n\n[Estribillo]\n\n[E] [Am] [E]\nSeñor queremos fuego... Señor queremos fuego... Señor queremos fuego\n[F] [G] [Am]\nQue Tu fuego consuma mi corazón\n\n([F] [G] [F] [G] [E])\n\n[E] [Am]\nQueremos que tu fuego, tú fuego que restaura\n[E]\nQue sana y purifica, renueva y santifica\n[Am]\nNo hay nada en este mundo, que deseamos más\n\nDerrama de tu espíritu, Yo sé que nos va a llenar\n[E]\nEstamos todos juntos con manos arriba\n[Am]\nGritando queremos fuego, Porque nosotros sabemos que ese\n\nFuego aún puede cambiar al mundo entero\n[E]\nFuego fuego eso queremos más, En medio de tu pueblo ahí estás\n[Am] [E]\nTodos a una voz a un mismo sentir, Cantamos alabanza y dice así\n\n[Puente]\n\n[E]\nQue tu fuego descienda...y llene mi alma\n[Am]\nQue tu fuego me encienda...que tu espíritu venga"
  },
  {
      title: 'Hay poder en la alabanza',
      artist: 'Jesús Worship Center',
      pdfUrl: '',
      chords: "//Dm G Dm G Dm G Bb A//\n\nCORO:\n\nN.C.              Dm     G\nHay poder en la alabanza\nDm.  G.       Dm        G\nHay poder en la alabanza\nDm     G                Bb\nHay poder en la alabanza\n          C                       Dm\nCuando tu pueblo canta y te danza\n\n\nVERSO:\n\nN.C.      Dm\nTengo un Dios\n         Dm   G\nQue es real\n        Dm   G            Dm   G\nEl se mueve Cuando yo le alabo\n\n          Bb (manten el acorde)\nTengo un Dios\nQue es capaz\nPara El\nNada es imposible\n\nGm\nAbrio el mar\nBb                     A\nY aun los vientos le obedecen\n\nN.C.     Dm   Gm\nTengo un Dios\n        Dm   Gm\nQue es amor\n    Dm\nPoderoso\nGm              Dm  C  Bb  Gm  A (pausa)"
  },
  {
      title: 'El ha cambiado mi lamento',
      artist: 'Desconocido',
      pdfUrl: '',
      chords: "Intro : \nG, B, D, G, E, C, A, G, F#, A, C, E, D, C#, D, E, D;\nG, B, D, G, E, C, E, G#, A, B, C, B, A, F#, G\n\nCORO\n G Am/F# Baug D/E Em7 D/F# G Am7\n// EL HA CAM--BIA---DO MI LA-MENTO\n Bm7 C2 Em/D D G\nY MI TRISTEZA EN DAN---ZA\nG Am/F# Baug D/E Em7 D/F# G Am7 Bm7 Am/C C/D D/F# G\nNO CA-----LLA--RE----E CAN-TA-RE DE TU GO---ZO EN MI //\n\nVOZ\n\nG C2/G G\nDONDE SOLO HABIA DOLOR\n G C2/G G\nEL TRAJO SANIDAD\n G C2/G G\nDONDE HABIA DESTRUCCION\n G C2/ G\nEL NOS DIO CONSOLACION\n\nG/B Am7 G F C/E C/D G\nSIEN--TO SU DULCE, DULCE AMOR QUE ME ILUMI---NA\nG/B Am7 G F C/E\nVE----O EL RESPLANDOR DEL SOL\n Cm/Eb C/D Am7 G/B C D\nQUE BRILLANDO ESTA CON SU ALE--GRI-A\n \nCORO X 2     ////   VOZ \n\nINTERLUDIO\nF2/G C/G A/G C2/G\nTU IRA SERA MOMENTANEA SEÑOR\nG/A A\nMAS TU GRACIA Y FAVOR\nG/D Am/D Am7 G/B C D G\nDURARAN PARA TODA LA VI--DA\n\nCORO X 2    /////  INTRO  X 2"
  },
  {
      title: 'Con Fuego Y Poder',
      artist: 'Desconocido',
      pdfUrl: '',
      chords: "Intro: [Em | D | Am | %] \n\nVoz: [Em | % | D | Am | C | G | D | A] \n\nPre Coro: [B - C | Em - D | B - C | E - D] \n\nCoro: [C | G | D/F# | Em]"
  },
  {
      title: '¿Quién Podrá?',
      artist: 'Desconocido',
      pdfUrl: '',
      chords: "Intro: [F - Bb | F] x2\n[F - Bb | C - D | F - Bb | F]\n\nSanto 1ra Parte: [B | C | A - C]\n\nSanto 2da Parte: [B | C | D - C | B]\n\nNingún Principado: [D | C | Bb | Gm]"
  },
  {
      title: 'Él Viene Otra Vez',
      artist: 'Christiane D\'Clario & Alex Zurdo',
      pdfUrl: '',
      chords: "[INTRO]\nF – C – F –\nF – C – F – Bb\n\n[VERSO 1]\nF C Bb F\nYa no puedo esperar por el día en que volverá\nC Bb F\nA la puerta él está y el tiempo se acerca ya\nF C F Bb F\neh eh eh eh –\nC Bb F\nComo anhelo estar, junto a él por la eternidad\nC Bb F\nTodo hay que preparar, porque Cristo viene ya\nC F Bb\nVen, ven, ven\n(Dilo conmigo) Dm C Bb\nven, ven\n\n[CORO 1]\nF C/E F\nEl viene otra vez\nBb F C/E F\nCon gloria y con poder\nBb F C/E F\nCon gloria y con poder\nBb\nY viene entre las nubes\nDm C Bb\nY su iglesia dice: Ven, ven, ven, ven\nF C/E F Bb Dm C Bb\nVen, ven, ven\n\n[VERSO 2]\nF C F Bb F\nComo anhelo estar, junto a él por la eternidad\nC F Bb C/E F\nTodo hay que preparar porque Cristo viene ya\nC F Bb\nVen, ven (oh ven señor Jesús)\nC/E Bb\nven, ven\n\n[CORO 2]\nF\nÉl viene otra vez\nC/E F\n(de que viene, viene y nada lo detiene)\nBb F\nCon gloria y con poder\nC/E F\n\n[PUENTE (coro 3)]\n(con mucha gloria, con su poder)\nBb F\nCon gloria y con poder\nC F/C\nY viene entre las nubes (lo veré, lo veré, lo veré, lo veré)\nBb Dm C Bb\nY su iglesia dice: Ven, ven, ven, ven\n\n[CORO 3]\nF C/E F\nÉl viene otra vez\nBb F\nCon gloria y con poder\nC/E F\n(con gloria y con poder)\nBb F\nCon gloria y con poder\nC F\nY viene entre las nubes (por su iglesia)\nBb Dm C Bb\nY su iglesia dice: Ven, ven, ven, ven\nF\nVen, ven, ven\n\n[PUENTE]\nBb F/A# C/E Dm\nTodo ojo le verá, muertos resucitarán\nBb\nY su pueblo se unirá en el cielo\nF/A# A7 Dm\nYa no habrá porque llorar, será un gozo sin final\nBb\nJuntos, cantaremos santo, santo\nBb F/A# C/E Dm\nTodo ojo le verá, muertos resucitarán\nBb\nY su pueblo se unirá en el cielo\nF/A# A7 Dm\nYa no habrá porque llorar, será un gozo sin final\nBb\nJuntos, cantaremos santo, santo\n\n[FINAL]\nF C/E\nSanto, santo\nDm C/E Bb\nJuntos cantaremos santo, santo\nF C/E\nSanto, santo\nDm C/E Bb\nJuntos cantaremos santo, santo\nF C/E\nPor los siglos de los siglos (santo, santo)\nDm C/E Bb\nPorque solo él es digno (santo, santo)\nF C\n\nVamos cántalo con tu vecino (santo, santo)\nDm\nEs que Cristo ha vencido\n\n[CORO FINAL]\nF\nÉl viene otra vez\nC F\n(él viene otra vez)\nBb F\nCon gloria y con poder\nC F\n(con gloria y con poder)\nBb F\nCon gloria y con poder\nC F/C\nY viene entre las nubes (lo veré, lo veré, lo veré, lo veré)\nBb Dm C/E Bb\nY su iglesia dice: Ven, ven, ven; ven,\nF C F\nVen, ven, ven\nBb F C F\nY dice ven, ven, ven\nBb F C F Bb Dm C/E Bb\nven, ven, ven\nF\nEl viene otra vez"
  }
];

export async function resetSongs() {
  if (localStorage.getItem('is_resetting')) {
    console.log("Reset already in progress. Skipping.");
    return;
  }
  localStorage.setItem('is_resetting', 'true');
  try {
    console.log("Resetting songs collection...");
    
    // 1. Get all documents in the collection
    const snapshot = await getDocs(collection(db, SONGS_COLLECTION));
    
    // 2. Delete them using batches (max 500)
    if (snapshot.size > 0) {
        let batch = writeBatch(db);
        let count = 0;
        for (const document of snapshot.docs) {
          batch.delete(document.ref);
          count++;
          if (count === 500) {
            await batch.commit();
            batch = writeBatch(db);
            count = 0;
          }
        }
        if (count > 0) {
          await batch.commit();
        }
        console.log(`Deleted ${snapshot.size} songs.`);
    }
    
    // 3. Seed fresh
    console.log("Seeding fresh songs...");
    for (const song of initialSongs) {
      console.log(`Adding song: ${song.title}`);
      await addDoc(collection(db, SONGS_COLLECTION), song);
    }
    console.log("Reset complete.");
  } catch (error) {
    console.error("Error in resetSongs:", error);
    throw error;
  } finally {
    localStorage.removeItem('is_resetting');
  }
}
