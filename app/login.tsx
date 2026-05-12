import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/hooks/use-auth';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ActivityIndicator, Image, StyleSheet, TouchableOpacity } from 'react-native';

export default function LoginScreen() {
  const { signIn, loading, nativeAvailable, errorMessage } = useAuth();
  const colorScheme = useColorScheme();

  return (
    <ThemedView style={styles.container}>
      <Image
        source={require('../assets/images/react-logo.png')}
        style={styles.googleLogo}
      />
      
      <ThemedText type="title" style={styles.title}>
        Welcome to Google Connect
      </ThemedText>
      
      <ThemedText style={styles.subtitle}>
        Sign in with your Google account to get started
      </ThemedText>

      <TouchableOpacity
        style={[
          styles.googleButton,
          {
            backgroundColor: Colors[colorScheme ?? 'light'].tint,
            opacity: loading ? 0.7 : 1,
          },
        ]}
        onPress={signIn}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <ThemedText style={styles.buttonText}>
            Sign in with Google
          </ThemedText>
        )}
      </TouchableOpacity>

      {!nativeAvailable && (
        <ThemedText style={styles.errorText}>
          {errorMessage ?? 'Cần development build để dùng Google Sign-In.'}
        </ThemedText>
      )}

      <ThemedText style={styles.description}>
        Your account information will be displayed securely after signing in.
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  googleLogo: {
    width: 100,
    height: 100,
    marginBottom: 30,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    opacity: 0.7,
  },
  googleButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginBottom: 24,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  description: {
    fontSize: 13,
    textAlign: 'center',
    opacity: 0.6,
    maxWidth: 280,
  },
  errorText: {
    marginBottom: 12,
    fontSize: 13,
    textAlign: 'center',
    color: '#B42318',
    maxWidth: 300,
  },
});
