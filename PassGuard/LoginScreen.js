// LoginScreen.js - VERSIÓN CON GOOGLE Y FACEBOOK SIGN-IN
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert, ActivityIndicator } from 'react-native';
// 1. IMPORTACIONES FIREBASE
import { auth } from './firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, FacebookAuthProvider, signInWithCredential } from 'firebase/auth';
// 2. IMPORTACIONES GOOGLE NATIVO
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
// 3. IMPORTACIONES FACEBOOK NATIVO
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [facebookLoading, setFacebookLoading] = useState(false);

  // --- Lógica Login Correo/Password ---
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  // --- LÓGICA GOOGLE NATIVO ---
  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const { idToken } = userInfo.data || userInfo;

      if (!idToken) {
        throw new Error('No se pudo obtener el token de Google');
      }

      const googleCredential = GoogleAuthProvider.credential(idToken);
      await signInWithCredential(auth, googleCredential);
      
      console.log("Login con Google exitoso");
      
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('Cancelado por el usuario');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Login en curso');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Error', 'Servicios de Google Play no disponibles');
      } else {
        console.error(error);
        Alert.alert('Error de Google', error.message);
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  // --- NUEVA LÓGICA FACEBOOK NATIVO ---
  const handleFacebookSignIn = async () => {
    setFacebookLoading(true);
    try {
      // 1. Iniciar el flujo de Login de Facebook
      const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

      // 2. Verificar si el usuario canceló
      if (result.isCancelled) {
        console.log('Login cancelado por el usuario');
        return;
      }

      // 3. Obtener el Access Token
      const data = await AccessToken.getCurrentAccessToken();

      if (!data) {
        throw new Error('No se pudo obtener el token de Facebook');
      }

      // 4. Crear credencial para Firebase
      const facebookCredential = FacebookAuthProvider.credential(data.accessToken);

      // 5. Autenticar en Firebase con esa credencial
      await signInWithCredential(auth, facebookCredential);
      
      console.log("Login con Facebook exitoso");
      
    } catch (error) {
      console.error(error);
      Alert.alert('Error de Facebook', error.message);
    } finally {
      setFacebookLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PassGuard</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      {/* BOTÓN LOGIN CORREO */}
      <Pressable 
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed
        ]}
        onPress={handleLogin}
        disabled={loading || googleLoading || facebookLoading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        )}
      </Pressable>

      {/* BOTÓN LOGIN GOOGLE */}
      <Pressable 
        style={({ pressed }) => [
          styles.googleButton,
          pressed && styles.googleButtonPressed
        ]}
        onPress={handleGoogleSignIn}
        disabled={loading || googleLoading || facebookLoading}
      >
        {googleLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.googleButtonText}>Continuar con Google</Text>
        )}
      </Pressable>

      {/* BOTÓN LOGIN FACEBOOK */}
      <Pressable 
        style={({ pressed }) => [
          styles.facebookButton,
          pressed && styles.facebookButtonPressed
        ]}
        onPress={handleFacebookSignIn}
        disabled={loading || googleLoading || facebookLoading}
      >
        {facebookLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.facebookButtonText}>Continuar con Facebook</Text>
        )}
      </Pressable>
      
      <Pressable onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>¿No tienes cuenta? Regístrate</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#000000',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
  },
  input: {
    backgroundColor: 'ffffff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    color: '000000'
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonPressed: {
    backgroundColor: '#0056CC',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // ESTILOS GOOGLE
  googleButton: {
    backgroundColor: '#DB4437',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  googleButtonPressed: {
    backgroundColor: '#C33C2E',
  },
  googleButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // ESTILOS FACEBOOK
  facebookButton: {
    backgroundColor: '#1877F2', // Azul Facebook
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  facebookButtonPressed: {
    backgroundColor: '#166FE5',
  },
  facebookButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    color: '#007AFF',
    textAlign: 'center',
    marginTop: 10,
  },
});