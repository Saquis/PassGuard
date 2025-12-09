import { Alert } from 'react-native';

// Generar contraseña aleatoria básica
export const generateRandomPassword = (length = 12) => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let password = "";
    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
};

// Función principal para generar contraseña
export const handleGeneratePassword = () => {
    try {
        const length = 12;
        const plainPassword = generateRandomPassword(length);
        return plainPassword;
    } catch (error) {
        console.error("Error generando contraseña:", error);
        return null;
    }
};

// Función para volver atrás
export const GoBack = (navigation) => {
    if (navigation && navigation.goBack) {
        navigation.goBack();
    }
};