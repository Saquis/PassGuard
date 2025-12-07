// HomeScreen.js - Pantalla principal temporal
import { signOut } from 'firebase/auth';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { auth, updatePassword } from './firebase';
import * as Clipboard from 'expo-clipboard';

export default function HomeScreen({ route, navigation }) {

  const { nuevaPassword } = route.params || {};

  // Función para copiar contraseña
  const copyToClipboard = () => {
    Clipboard.setString(nuevaPassword);
    Alert.alert("Copiado", "Contraseña copiada al portapapeles");
  };

  //Funcion para cerrar la sesion
  const logout = async () => {
    try {
      await signOut(auth);
      Alert.alert('Sesión cerrada con éxito')
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <View style={styles.container}>

      {nuevaPassword ? (
        <View style={styles.passwordCard}>
          <Text style={styles.label}>Nueva contraseña generada:</Text>

          <View style={styles.passwordContainer}>
            <Text style={styles.passwordText}>{nuevaPassword}</Text>
          </View>

          <TouchableOpacity
            style={styles.copyButton}
            onPress={copyToClipboard}
          >
            <Text style={styles.copyButtonText}>Copiar contraseña</Text>
          </TouchableOpacity>

          <Text style={styles.warning}>Guarda esta contraseña en un lugar seguro</Text>
        </View>
      ) : (
        <Text style={styles.subtitle}>No hay contraseñas generadas aún</Text>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('AddPassword')}
      >
        <Text style={styles.buttonText}>+ Agregar Contraseña</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#FF3B30' }]}
        onPress={logout}
      >
        <Text style={styles.buttonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#000000',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 40,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
    width: '80%',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultContainer: {
    marginTop: 15,
    padding: 12,
    backgroundColor: '#000000',
    borderRadius: 8,
  },
  copyButton: {
    margin: 20,
    backgroundColor: '#ffffff',
    borderRadius: 10,
  },
  copyButtonText: {
    fontSize: 15,
    padding: 15,
    color: '#000000',
    textAlign: 'center'
  },
  passwordCard: {
    backgroundColor: '#474747',
    margin: 35,
    borderRadius: 10,
    padding: 20
  },
  label: {
    textAlign: 'center',
    fontSize: 18,
    color: '#ffffff'
  },
  passwordText: {
    textAlign: 'center',
    fontSize: 25,
    color: '#ffffff',
    textDecorationLine: 'underline'
  },
  warning: {
    textAlign: 'center',
    fontSize: 18,
    color: '#ffffff'
  }

});