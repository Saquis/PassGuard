import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc,
  query,
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';

// OBTENER todas las contraseñas del usuario
export const getPasswords = async (userId) => {
  try {
    const passwordsRef = collection(db, 'users', userId, 'passwords');
    const q = query(passwordsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    const passwords = [];
    snapshot.forEach((doc) => {
      passwords.push({ 
        id: doc.id, 
        ...doc.data() 
      });
    });
    
    return passwords;
  } catch (error) {
    console.error('Error obteniendo contraseñas:', error);
    return [];
  }
};

// AGREGAR nueva contraseña (ENCRIPTADA)
export const addPassword = async (userId, passwordData) => {
  try {
    const passwordsRef = collection(db, 'users', userId, 'passwords');
    
    const newPassword = {
      ...passwordData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    
    const docRef = await addDoc(passwordsRef, newPassword);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error agregando contraseña:', error);
    return { success: false, error: error.message };
  }
};

// ACTUALIZAR contraseña existente
export const updatePassword = async (userId, passwordId, newData) => {
  try {
    const passwordRef = doc(db, 'users', userId, 'passwords', passwordId);
    
    await updateDoc(passwordRef, {
      ...newData,
      updatedAt: Timestamp.now()
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error actualizando contraseña:', error);
    return { success: false, error: error.message };
  }
};

// ELIMINAR contraseña
export const deletePassword = async (userId, passwordId) => {
  try {
    const passwordRef = doc(db, 'users', userId, 'passwords', passwordId);
    await deleteDoc(passwordRef);
    return { success: true };
  } catch (error) {
    console.error('Error eliminando contraseña:', error);
    return { success: false, error: error.message };
  }
};

// BUSCAR contraseñas por servicio
export const searchPasswords = async (userId, searchText) => {
  try {
    const passwords = await getPasswords(userId);
    return passwords.filter(password => 
      password.service.toLowerCase().includes(searchText.toLowerCase()) ||
      password.username.toLowerCase().includes(searchText.toLowerCase())
    );
  } catch (error) {
    console.error('Error buscando contraseñas:', error);
    return [];
  }
};