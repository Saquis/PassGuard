
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
        style={styles.button}
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
    width: '80%',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  card: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    width: 60,
    marginLeft: 10,
    textAlign: 'center',
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  label: {
    fontWeight: 'bold',
  },
  passwordText: {
    fontSize: 16,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    marginTop: 5,
  },
  backButton: {
    backgroundColor: '#6c757d',
  },
  logoutButton: {
    backgroundColor: '#dc3545',
  },
});

export default AddPasswordScreen;