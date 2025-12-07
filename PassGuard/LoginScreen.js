// LoginScreen.js
import React, { useState } from 'react';
import { 
  View, Text, TextInput, Pressable, StyleSheet, Alert, 
  ActivityIndicator, Image, PermissionsAndroid, Platform 
} from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { auth } from './firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, FacebookAuthProvider, signInWithCredential } from 'firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [facebookLoading, setFacebookLoading] = useState(false);
  const [userImage, setUserImage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }
    if (!emailRegex.test(email.trim())) {
      Alert.alert('Error', 'Ingresa un correo válido');
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

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const { idToken } = userInfo.data || userInfo;
      const googleCredential = GoogleAuthProvider.credential(idToken);
      await signInWithCredential(auth, googleCredential);
    } catch (error) {
      console.error(error);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleFacebookSignIn = async () => {
    setFacebookLoading(true);
    try {
      const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
      if (result.isCancelled) return;

      const data = await AccessToken.getCurrentAccessToken();
      const facebookCredential = FacebookAuthProvider.credential(data.accessToken);
      await signInWithCredential(auth, facebookCredential);
    } catch (error) {
      console.error(error);
      Alert.alert('Error de Facebook', error.message);
    } finally {
      setFacebookLoading(false);
    }
  };

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Permiso de cámara',
          message: 'La app necesita acceso a la cámara',
          buttonNeutral: 'Preguntar luego',
          buttonNegative: 'Cancelar',
          buttonPositive: 'Aceptar',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const selectImage = async () => {
    const cameraPermission = await requestCameraPermission();

    Alert.alert(
      'Seleccionar Imagen',
      'Elige una opción',
      [
        { 
          text: 'Cámara', 
          onPress: async () => {
            if (!cameraPermission) {
              Alert.alert('Permiso denegado', 'No se puede abrir la cámara');
              return;
            }
            launchCamera({ mediaType: 'photo', saveToPhotos: true }, handleImageResult);
          } 
        },
        { text: 'Galería', onPress: () => launchImageLibrary({ mediaType: 'photo' }, handleImageResult) },
        { text: 'Cancelar', style: 'cancel' }
      ]
    );
  };

  const handleImageResult = (response) => {
    if (!response.didCancel && !response.errorCode) {
      const uri = response.assets[0].uri;
      setUserImage(uri);
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      enableOnAndroid={true}
      extraScrollHeight={Platform.OS === 'ios' ? 20 : 0}
      keyboardShouldPersistTaps="handled"
    >
      <Image
        source={require('./assets/itq.png')}
        style={{ width: 50, height: 50, position: 'absolute', top: 20, left: 20 }}
      />

      <Pressable onPress={selectImage} style={{ alignSelf: 'center', marginBottom: 20 }}>
        {userImage ? (
          <Image source={{ uri: userImage }} style={{ width: 90, height: 90, borderRadius: 45 }} />
        ) : (
          <Image source={require('./assets/perfil.jpg')} style={{ width: 90, height: 90, borderRadius: 45 }} />
        )}
      </Pressable>

      <Text style={styles.title}>PassGuard</Text>

      <Text style={styles.inputText}>Ingrese su correo</Text>
      <View style={styles.inputWrapper}>
        <MaterialIcons name="email" size={22} color="#777" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="ejemplo@gmail.com"
          placeholderTextColor="#777"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <Text style={styles.inputText}>Ingrese su contraseña</Text>
      <View style={styles.inputWrapper}>
        <MaterialIcons name="lock" size={22} color="#777" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="#777"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <Pressable onPress={() => setShowPassword(!showPassword)}>
          <FontAwesome
            name={showPassword ? "eye" : "eye-slash"}
            size={22}
            color="#777"
            style={{ marginRight: 10 }}
          />
        </Pressable>
      </View>

      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        onPress={handleLogin}
        disabled={loading || googleLoading || facebookLoading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <FontAwesome name="sign-in" size={18} color="white" style={{ marginRight: 8 }} />
            <Text style={styles.buttonText}>Iniciar Sesión</Text>
          </View>
        )}
      </Pressable>

      <View style={styles.rowButtonsContainer}>
        <Pressable
          style={({ pressed }) => [styles.smallButton, { backgroundColor: '#DB4437' }, pressed && styles.googleButtonPressed]}
          onPress={handleGoogleSignIn}
        >
          {googleLoading ? <ActivityIndicator color="white" /> : <FontAwesome name="google" size={18} color="white" />}
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.smallButton, { backgroundColor: '#1877F2' }, pressed && styles.facebookButtonPressed]}
          onPress={handleFacebookSignIn}
        >
          {facebookLoading ? <ActivityIndicator color="white" /> : <FontAwesome name="facebook" size={18} color="white" />}
        </Pressable>
      </View>

      <Pressable onPress={() => navigation.navigate('Register')} style={styles.registerRow}>
        <MaterialIcons name="person-add" size={18} color="#007AFF" />
        <Text style={styles.link}>¿No tienes cuenta? Regístrate</Text>
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
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: "#fff",
    marginBottom: 20,
  },
  inputText: {
    paddingBottom: 10,
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingLeft: 10,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    padding: 15,
    color: '#000',
  },
  button: {
    backgroundColor: '#707070',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonPressed: {
    backgroundColor: '#0056CC',
  },
  buttonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
  },
  rowButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  smallButton: {
    width: '48%',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  googleButtonPressed: {
    backgroundColor: '#C33C2E',
  },
  facebookButtonPressed: {
    backgroundColor: '#166FE5',
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  link: {
    color: '#007AFF',
    marginLeft: 6,
    marginTop: 8,
    fontSize: 15,
  },
});
