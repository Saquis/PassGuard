// HomeScreen.js - Pantalla principal decorada
import { signOut } from 'firebase/auth';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { auth } from './firebase';
import * as Clipboard from 'expo-clipboard';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function HomeScreen({ route, navigation }) {
  const { nuevaPassword } = route.params || {};

  // Función para copiar contraseña
  const copyToClipboard = () => {
    Clipboard.setString(nuevaPassword);
    Alert.alert("Copiado", "Contraseña copiada al portapapeles");
  };

  // Funcion para cerrar la sesion
  const logout = async () => {
    try {
      await signOut(auth);
      Alert.alert('Sesión cerrada con éxito');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Imagen pequeña en la esquina superior izquierda */}
      <Image
        source={require('./assets/itq.png')}
        style={styles.topLeftImage}
      />

      <Text style={styles.title}>Bienvenido a PassGuard</Text>

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
            <FontAwesome name="clipboard" size={18} color="#000" style={{ marginRight: 8 }} />
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
        <FontAwesome name="plus-circle" size={20} color="white" style={{ marginRight: 10 }} />
        <Text style={styles.buttonText}>Agregar Contraseña Segura</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.logoutButton]}
        onPress={logout}
      >
        <MaterialIcons name="logout" size={20} color="white" style={{ marginRight: 10 }} />
        <Text style={styles.buttonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#34C759',
    marginBottom: 30,
    textAlign: 'center',
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
    flexDirection: 'row',
    justifyContent: 'center',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  passwordCard: {
    backgroundColor: '#2C2C2C',
    marginVertical: 20,
    borderRadius: 10,
    padding: 20,
    width: '90%',
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    color: '#ffffff',
    marginBottom: 10,
    textAlign: 'center',
  },
  passwordContainer: {
    backgroundColor: '#474747',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    width: '100%',
  },
  passwordText: {
    fontSize: 24,
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  copyButtonText: {
    fontSize: 16,
    color: '#000000',
    fontWeight: 'bold',
  },
  warning: {
    marginTop: 15,
    fontSize: 16,
    color: '#FFD700',
    textAlign: 'center',
  },
});
