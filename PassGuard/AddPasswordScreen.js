// AddPasswordScreen.js - VERSIÓN CORREGIDA
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  Alert
} from 'react-native';
import { auth } from './firebase';
import { addPassword } from './passwordService';
import { encryptBase64, encryptPassword } from './encryption';
import { handleGeneratePassword } from './passwordGenerator';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const AddPasswordScreen = ({ navigation, route }) => {
  const [service, setService] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = () => {
    const generated = handleGeneratePassword(); // Sin parámetros
    if (generated) {
      setPassword(generated);
      // Opcional: mostrar confirmación
      Alert.alert(
        "Contraseña generada",
        `Se generó: ${generated}`,
        [{ text: "OK" }]
      );
    }
  };

  const handleSave = async () => {
    if (!service.trim() || !username.trim() || !password.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        Alert.alert('Error', 'Usuario no autenticado');
        return;
      }

      // 1. Obtener contraseña maestra 
      // ESTO ES TEMPORAL
      // const masterPassword = 'contraseñaMaestraUsuario';

      // 2. Encriptar la contraseña (con AWAIT)
      // const encryptedPassword = await encryptPassword(password, masterPassword);
      const encryptedPassword = encryptBase64(password)

      if (!encryptedPassword) {
        Alert.alert('Error', 'No se pudo encriptar la contraseña');
        return;
      }

      // 3. Preparar datos para guardar
      const passwordData = {
        service: service.trim(),
        username: username.trim(),
        encryptedPassword: encryptedPassword
      };

      // 4. Guardar en Firestore
      const result = await addPassword(userId, passwordData);

      if (result.success) {
        Alert.alert('Éxito', 'Contraseña guardada correctamente');
        // Limpiar formulario
        setService('');
        setUsername('');
        setPassword('');
        // Navegar de vuelta
        navigation.goBack();
      } else {
        Alert.alert('Error', result.error || 'Error al guardar');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('./assets/itq.png')}
        style={styles.topLeftImage}
      />

      <Text style={styles.title}>Agregar Nueva Contraseña</Text>

      {/* Campo Servicio */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Servicio/Aplicación</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Gmail, Facebook, Netflix"
          value={service}
          onChangeText={setService}
          placeholderTextColor="#888"
        />
      </View>

      {/* Campo Usuario/Email */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Usuario/Email</Text>
        <TextInput
          style={styles.input}
          placeholder="usuario@gmail.com"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholderTextColor="#888"
        />
      </View>

      {/* Campo Contraseña con botón Generar */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Contraseña</Text>
        <View style={styles.passwordRow}>
          <TextInput
            style={[styles.input, styles.passwordInput]}
            placeholder="Escribe o genera una contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#888"
          />
          <TouchableOpacity
            style={styles.generateButton}
            onPress={handleGenerate}
          >
            <FontAwesome name="key" size={16} color="white" />
            <Text style={styles.generateButtonText}>Generar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Botón Guardar */}
      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSave}
        disabled={loading}
      >
        <FontAwesome name="save" size={20} color="white" style={{ marginRight: 10 }} />
        <Text style={styles.saveButtonText}>
          {loading ? 'Guardando...' : 'Guardar Contraseña'}
        </Text>
      </TouchableOpacity>

      {/* Botón Volver */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={handleGoBack}
      >
        <MaterialIcons name="arrow-back" size={20} color="white" style={{ marginRight: 10 }} />
        <Text style={styles.backButtonText}>Volver</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#34C759',
    textAlign: 'center',
    marginTop: 60,
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#1C1C1C',
    color: '#fff',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
    fontSize: 16,
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    marginRight: 10,
  },
  generateButton: {
    backgroundColor: '#34C759',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 8,
    minWidth: 100,
    justifyContent: 'center',
  },
  generateButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 5,
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 15,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#FF3B30',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 8,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddPasswordScreen;