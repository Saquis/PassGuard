import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { getAuth, updatePassword } from 'firebase/auth';
// import { encryptPassword } from './encryption.js';

// Almacenamiento local simulado
/*let savedEncryptedPassword = null;

export function setSavedEncryptedPassword(encryptedValue) {
    savedEncryptedPassword = encryptedValue;
    console.log("STORAGE: Se guardó el valor encriptado:", savedEncryptedPassword);
}

export function getSavedEncryptedPassword() {
    console.log("STORAGE: Se recuperó el valor encriptado:", savedEncryptedPassword);
    return savedEncryptedPassword;
}
*/
// Generador de contraseñas
export const generateRandomPassword = (length = 12) => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let password = "";
    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
};

const handleUpdatePasswordInFirebase = (generatedPassword, navigation) => {
    const auth = getAuth();
    const user = auth.currentUser;

    // Validar si hay usuario logeado
    if (!user) {
        Alert.alert("Error", "No hay usuario logueado.");
        return;
    }

    updatePassword(user, generatedPassword)
        .then(() => {
            // Éxito: Navegar a Home con la contraseña
            Alert.alert(
                "¡Éxito!",
                "Contraseña actualizada. Ahora podrás copiarla.",
                [
                    {
                        text: "OK",
                        onPress: () => {
                            navigation.navigate('Home', {
                                nuevaPassword: generatedPassword
                            });
                        }
                    }
                ]
            );
        })
        .catch((error) => {
            console.error("Error:", error);
            if (error.code === 'auth/requires-recent-login') {
                Alert.alert("Error", "Debes iniciar sesión recientemente para cambiar la contraseña.");
            } else {
                Alert.alert("Error", error.message);
            }
        });
};

export const handleGeneratePassword = (setGeneratedPassword, navigation) => {
    // const [passwordLength, setPasswordLength] = useState('16');
    // const [generatedPassword, setGeneratedPassword] = useState('');
    // const [storedEncryptedPassword, setStoredEncryptedPassword] = useState('');

    try {
        const length = parseInt(10);

        // Generar contraseña
        const plainPassword = generateRandomPassword(length);
        setGeneratedPassword(plainPassword);
        // Mostrar alerta de confirmación
        Alert.alert(
            "Contraseña generada",
            `Nueva contraseña: ${plainPassword}\n\n¿Usar esta contraseña?`,
            [
                {
                    text: "No",
                    onPress: () => setGeneratedPassword(''),
                    style: "cancel"
                },
                {
                    text: "Sí",
                    onPress: () => handleUpdatePasswordInFirebase(plainPassword, navigation)
                }
            ]
        );
    } catch (error) {
        Alert.alert("Error", "No se pudo generar la contraseña");
        console.log(error);


        // Encriptar
        /*const encrypted = encryptPassword(plainPassword);

        if (encrypted) {
            // Guardar
            setSavedEncryptedPassword(encrypted);
            setStoredEncryptedPassword(getSavedEncryptedPassword());
            Alert.alert("Éxito", "Contraseña generada y guardada");
        } else {
            Alert.alert("Error", "No se pudo encriptar");
        }*/
    }
};

export const GoBack = (navigation) => {
    navigation.navigate('Home');
};