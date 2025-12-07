
// AddPasswordScreen.js - Pantalla temporal para agregar contraseñas
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

//Importacion de generador de contraseñas
import { handleGeneratePassword, GoBack } from './passwordGenerator';

const AddPasswordScreen = ({ navigation }) => {
  //Estado de la clave
  const [generatedPassword, setGeneratedPassword] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>GENERADOR DE CONTRASEÑAS SEGURAS</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleGeneratePassword(setGeneratedPassword, navigation)}
      >
        <Text style={styles.buttonText}>Generar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.buttonExit}
        onPress={() => GoBack(navigation)}
      >
        <Text style={styles.buttonText}>Volver</Text>
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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    width: '75%',
    textAlign: 'center',
    marginBottom: 50
  },
  subtitle: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 40,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#34C759',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
    width: '80%',
  },
  buttonExit: {
    backgroundColor: '#FF3B30',
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
  backButton: {
    backgroundColor: '#6c757d',
  },
});

export default AddPasswordScreen;