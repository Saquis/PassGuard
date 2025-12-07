// AddPasswordScreen.js - Pantalla para agregar contraseñas decorada
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

// Importación de generador de contraseñas
import { handleGeneratePassword, GoBack } from './passwordGenerator';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const AddPasswordScreen = ({ navigation }) => {
  const [generatedPassword, setGeneratedPassword] = useState('');

  return (
    <View style={styles.container}>
      {/* Imagen pequeña en la esquina superior izquierda */}
      <Image
        source={require('./assets/itq.png')}
        style={styles.topLeftImage}
      />

      <Text style={styles.title}>GENERADOR DE CONTRASEÑAS SEGURAS</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => handleGeneratePassword(setGeneratedPassword, navigation)}
      >
        <FontAwesome name="key" size={20} color="white" style={{ marginRight: 10 }} />
        <Text style={styles.buttonText}>Generar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.buttonExit}
        onPress={() => GoBack(navigation)}
      >
        <MaterialIcons name="arrow-back" size={20} color="white" style={{ marginRight: 10 }} />
        <Text style={styles.buttonText}>Volver</Text>
      </TouchableOpacity>

      {generatedPassword ? (
        <View style={styles.passwordCard}>
          <Text style={styles.generatedLabel}>Contraseña Generada:</Text>
          <Text style={styles.generatedPassword}>{generatedPassword}</Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#000000',
  },
  topLeftImage: {
    width: 50,
    height: 50,
    position: 'absolute',
    top: 20,
    left: 20,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#34C759',
    marginBottom: 50,
    textAlign: 'center',
    width: '75%',
  },
  button: {
    backgroundColor: '#34C759',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonExit: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  passwordCard: {
    marginTop: 30,
    padding: 20,
    backgroundColor: '#474747',
    borderRadius: 10,
    alignItems: 'center',
    width: '90%',
  },
  generatedLabel: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  generatedPassword: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
  },
});

export default AddPasswordScreen;
