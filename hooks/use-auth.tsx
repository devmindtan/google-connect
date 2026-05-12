import React, { createContext, useContext, useEffect, useState } from 'react';
import { TurboModuleRegistry } from 'react-native';

type GoogleSigninModule = typeof import('@react-native-google-signin/google-signin');

let googleSigninModule: GoogleSigninModule | null = null;

function hasNativeGoogleSignin() {
  return TurboModuleRegistry.get('RNGoogleSignin') != null;
}

async function loadGoogleSignin(): Promise<GoogleSigninModule | null> {
  if (!hasNativeGoogleSignin()) {
    return null;
  }

  if (!googleSigninModule) {
    googleSigninModule = await import('@react-native-google-signin/google-signin');
  }

  return googleSigninModule;
}

export interface GoogleUser {
  id: string;
  name: string;
  email: string;
  photo: string;
  familyName?: string;
  givenName?: string;
}

interface AuthContextType {
  user: GoogleUser | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  isSignedIn: boolean;
  nativeAvailable: boolean;
  errorMessage: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<GoogleUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [nativeAvailable, setNativeAvailable] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const initialize = async () => {
      const googleSignin = await loadGoogleSignin();

      if (!googleSignin) {
        setNativeAvailable(false);
        setErrorMessage(
          'RNGoogleSignin không có trong binary hiện tại. Hãy chạy app bằng development build hoặc prebuild, không dùng Expo Go.'
        );
        setLoading(false);
        return;
      }

      const { GoogleSignin } = googleSignin;

      GoogleSignin.configure({
        webClientId: '636698450036-jpjqji0i6ie10930qmtfr0aqn36q12me.apps.googleusercontent.com',
        iosClientId: '636698450036-jpjqji0i6ie10930qmtfr0aqn36q12me.apps.googleusercontent.com',
        offlineAccess: false,
        forceCodeForRefreshToken: false,
      });

      await checkCurrentUser(GoogleSignin);
      setNativeAvailable(true);
      setErrorMessage(null);
      setLoading(false);
    };

    initialize();
  }, []);

  const checkCurrentUser = async (GoogleSignin: GoogleSigninModule['GoogleSignin']) => {
    try {
      const currentUser = GoogleSignin.getCurrentUser();
      if (currentUser) {
        setUser({
          id: currentUser.user.id,
          name: currentUser.user.name ?? '',
          email: currentUser.user.email,
          photo: currentUser.user.photo ?? '',
          familyName: currentUser.user.familyName ?? undefined,
          givenName: currentUser.user.givenName ?? undefined,
        });
        setIsSignedIn(true);
      }
    } catch (error) {
      console.error('Error checking current user:', error);
    }
  };

  const signIn = async () => {
    try {
      setLoading(true);
      const googleSignin = await loadGoogleSignin();
      if (!googleSignin) {
        setNativeAvailable(false);
        setErrorMessage('Cần development build để dùng Google Sign-In.');
        return;
      }

      const { GoogleSignin } = googleSignin;

      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      if (userInfo.type !== 'success') {
        setErrorMessage('Người dùng đã hủy đăng nhập Google.');
        return;
      }

      setUser({
        id: userInfo.data.user.id,
        name: userInfo.data.user.name ?? '',
        email: userInfo.data.user.email,
        photo: userInfo.data.user.photo ?? '',
        familyName: userInfo.data.user.familyName ?? undefined,
        givenName: userInfo.data.user.givenName ?? undefined,
      });
      setIsSignedIn(true);
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage('Không thể đăng nhập Google trong môi trường hiện tại.');
      console.error('Unknown error:', error);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const googleSignin = await loadGoogleSignin();
      if (!googleSignin) {
        setNativeAvailable(false);
        setErrorMessage('Cần development build để dùng Google Sign-In.');
        return;
      }

      const { GoogleSignin } = googleSignin;
      await GoogleSignin.signOut();
      setUser(null);
      setIsSignedIn(false);
      setErrorMessage(null);
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, signIn, signOut, isSignedIn, nativeAvailable, errorMessage }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
