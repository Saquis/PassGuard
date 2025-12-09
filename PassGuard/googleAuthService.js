import { useEffect } from 'react';
import { auth } from './firebase';
import * as WebBrowser from 'expo-web-browser';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import * as Google from 'expo-auth-session/providers/google';

WebBrowser.maybeCompleteAuthSession();

export const useGoogleAuth = () => {
  // webClientId
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: '722814074268-5tgmvghv68ecvaebn8cfbmh3b5nrakbc.apps.googleusercontent.com',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      
      const credential = GoogleAuthProvider.credential(id_token);
      
      signInWithCredential(auth, credential)
        .then((userCredential) => {
          console.log('Google sign-in successful');
        })
        .catch((error) => {
          console.error('Google sign-in error:', error);
        });
    }
  }, [response]);

  return { promptAsync };
};