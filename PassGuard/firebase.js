// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCnaf-kMLnAbrLtjnA7ANSw2qC4VUTQYAQ",
  authDomain: "passguard-2959a.firebaseapp.com",
  projectId: "passguard-2959a",
  storageBucket: "passguard-2959a.firebasestorage.app",
  messagingSenderId: "722814074268",
  appId: "1:722814074268:web:0cf00c3e582782ccb25c59"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Obtener servicios de Firebase
const auth = getAuth(app);
const db = getFirestore(app);

// Exportar servicios
export { auth, db };
export default app;