import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
// Importamos la librería de Google
import { GoogleSignin } from '@react-native-google-signin/google-signin';
// Importamos la librería de Facebook
import { Settings } from 'react-native-fbsdk-next';

import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import HomeScreen from './HomeScreen';
import AddPasswordScreen from './AddPasswordScreen';

const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. CONFIGURACIÓN GLOBAL DE GOOGLE
    GoogleSignin.configure({
      webClientId: "722814074268-5tgmvghv68ecvaebn8cfbmh3b5nrakbc.apps.googleusercontent.com",
      offlineAccess: true,
      forceCodeForRefreshToken: true,
    });

    // 2. INICIALIZAR FACEBOOK SDK
    Settings.initializeSDK();

    // 3. Escuchar cambios de sesión en Firebase
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return null; // O un componente de Loading...
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!user ? (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ title: 'Iniciar Sesión', headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ title: 'Registrarse' }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ title: 'Mis Contraseñas', headerLeft: null }}
            />
            <Stack.Screen
              name="AddPassword"
              component={AddPasswordScreen}
              options={{ title: 'Agregar Contraseña' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}