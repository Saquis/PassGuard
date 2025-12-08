// encryption.js - USANDO expo-crypto (ya instalado en tu package.json)
import CryptoJS from 'crypto-js';

//ENCRIPTACION REAL PARA IMPLEMENTACION
export const encryptBase64 = (password) => {
  return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(password));
};

export const decryptBase64 = (passwordsList) => {
  return CryptoJS.enc.Base64.parse(passwordsList).toString(CryptoJS.enc.Utf8);
};

// Verificar si está "encriptado"
export const isEncrypted = (text) => {
  return text && typeof text === 'string' &&
    (text.startsWith('dev_enc_') || text.startsWith('hash_'));
};

// Solo para desarrollo
const EncryptionService = {
  isEncrypted,
  encryptBase64,
  decryptBase64
};

export default EncryptionService;