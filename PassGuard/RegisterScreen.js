import React, { useState } from 'react';
import { 
  View, Text, TextInput, Pressable, StyleSheet, Alert, Image, Platform 
} from 'react-native';
import { auth } from './firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Ingresa un correo válido (debe incluir @ y un dominio válido)');
      return;
    }
    if (!passwordRegex.test(password)) {
      Alert.alert(
        'Error',
        'La contraseña debe contener:\n- Una mayúscula\n- Una minúscula\n- Un número\n- Un carácter especial (!@#$%^&*()_+)\n- Mínimo 8 caracteres'
      );
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
    setLoading(false);
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      enableOnAndroid={true}
      extraScrollHeight={Platform.OS === 'ios' ? 20 : 0}
      keyboardShouldPersistTaps="handled"
    >
      {/* Imagen pequeña en la esquina superior izquierda */}
      <Image
        source={require('./assets/itq.png')}
        style={{ width: 50, height: 50, position: 'absolute', top: 20, left: 20 }}
      />

      <Text style={styles.title}> Registrarse</Text>

      {/* Correo */}
      <Text style={styles.inputText}>Ingrese su correo</Text>
      <View style={styles.inputWrapper}>
        <FontAwesome name="envelope" size={18} color="#777" style={{ marginRight: 10 }} />
        <TextInput
          style={styles.input}
          placeholder="ejemplo@gmail.com"
          placeholderTextColor="#000"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      {/* Contraseña */}
      <Text style={styles.inputText}>Ingrese su contraseña</Text>
      <View style={styles.inputWrapper}>
        <FontAwesome name="lock" size={18} color="#777" style={{ marginRight: 10 }} />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="#000"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <Pressable onPress={() => setShowPassword(!showPassword)}>
          <FontAwesome
            name={showPassword ? "eye" : "eye-slash"}
            size={18}
            color="#777"
            style={{ marginRight: 10 }}
          />
        </Pressable>
      </View>

      {/* Confirmar Contraseña */}
      <Text style={styles.inputText}>Repita su contraseña</Text>
      <View style={styles.inputWrapper}>
        <FontAwesome name="lock" size={18} color="#777" style={{ marginRight: 10 }} />
        <TextInput
          style={styles.input}
          placeholder="Confirmar Contraseña"
          placeholderTextColor="#000"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirmPassword}
        />
        <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
          <FontAwesome
            name={showConfirmPassword ? "eye" : "eye-slash"}
            size={18}
            color="#777"
            style={{ marginRight: 10 }}
          />
        </Pressable>
      </View>

      {/* Botón Crear Cuenta */}
      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <Text style={styles.buttonText}>Creando cuenta...</Text>
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <FontAwesome name="user-plus" size={18} color="white" style={{ marginRight: 8 }} />
            <Text style={styles.buttonText}>Crear Cuenta</Text>
          </View>
        )}
      </Pressable>

      {/* Link para ir a Login */}
      <Pressable onPress={() => navigation.navigate('Login')} style={styles.registerRow}>
        <FontAwesome name="sign-in" size={16} color="#007AFF" style={{ marginRight: 6 }} />
        <Text style={styles.link}>¿Ya tienes cuenta? Inicia Sesión</Text>
      </Pressable>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#000000',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
    color: '#fff',
  },
  inputText: {
    marginBottom: 10,
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 15,
    paddingLeft: 10,
  },
  input: {
    flex: 1,
    padding: 15,
    color: '#000',
  },
  button: {
    backgroundColor: '#34C759',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 15,
  },
  buttonPressed: {
    backgroundColor: '#2AA44F',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    color: '#007AFF',
    fontSize: 15,
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
});
