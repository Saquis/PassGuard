//import CryptoJS from 'crypto-js';

// Esta clave debería estar en .env y nunca en el código
//const SECRET_KEY = 'clave-secreta-123';

/**
 * Encripta texto usando AES-256
 * 
 *   NOTA EDUCATIVA: 
 * - Firebase Auth YA hashea contraseñas automáticamente
 * - Este código es solo para DEMOSTRAR cómo encriptar datos sensibles
 * - Úsalo para: tarjetas de crédito, API keys, SSN, etc.
 * - NO lo uses para contraseñas si usas Firebase Auth
 */

/*export const encryptPassword = (text) => {
    try {
        if (!text) return "";
        
        // AES genera una IV aleatoria automáticamente
        const ciphertext = CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
        
        console.log(" Encriptación exitosa");
        return ciphertext;
    } catch (error) {
        console.error(" Error de encriptación:", error);
        return null;
    }
};*/

/**
 * Desencripta texto encriptado con AES-256
 */
/*export const decryptPassword = (ciphertext) => {
    try {
        if (!ciphertext) return "";
        
        const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
        const originalText = bytes.toString(CryptoJS.enc.Utf8);
        
        console.log(" Desencriptación exitosa");
        return originalText;
    } catch (error) {
        console.error(" Error de desencriptación:", error);
        return "";
    }
};*/