// encryption.js - USANDO expo-crypto (ya instalado en tu package.json)
import * as Crypto from 'expo-crypto';

// Encriptación SIMULADA para desarrollo (no es segura para producción)
export const encryptPassword = async (plainText, masterPassword) => {
  try {
    if (!plainText || !masterPassword) {
      console.error('Encryption: Faltan parámetros');
      return null;
    }

    // Para desarrollo: guardar en texto plano con prefijo
    // EN PRODUCCIÓN: Usar librería de encriptación real
    return `dev_enc_${plainText}_${masterPassword.substring(0, 3)}`;
    
    // Alternativa: usar hash (no reversible pero mejor que texto plano)
    // const digest = await Crypto.digestStringAsync(
    //   Crypto.CryptoDigestAlgorithm.SHA256,
    //   plainText + masterPassword
    // );
    // return `hash_${digest}`;
  } catch (error) {
    console.error('Error en encryptPassword:', error);
    return null;
  }
};

// Desencriptación SIMULADA
export const decryptPassword = async (encryptedText, masterPassword) => {
  try {
    if (!encryptedText || !masterPassword) {
      console.error('Decryption: Faltan parámetros');
      return null;
    }

    // Para desarrollo: extraer del texto simulado
    if (encryptedText.startsWith('dev_enc_')) {
      const parts = encryptedText.split('_');
      if (parts.length >= 4) {
        return parts[2]; // Retornar la contraseña original
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error en decryptPassword:', error);
    return null;
  }
};

// Verificar si está "encriptado"
export const isEncrypted = (text) => {
  return text && typeof text === 'string' && 
         (text.startsWith('dev_enc_') || text.startsWith('hash_'));
};

// Solo para desarrollo
const EncryptionService = {
  encryptPassword,
  decryptPassword,
  isEncrypted
};

export default EncryptionService;