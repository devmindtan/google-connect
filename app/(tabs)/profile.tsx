import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/hooks/use-auth';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Image, StyleSheet, View } from 'react-native';

export default function ProfileScreen() {
  const { user } = useAuth();
  const colorScheme = useColorScheme();

  if (!user) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Account Information
      </ThemedText>

      {/* Profile Picture */}
      {user.photo && (
        <Image
          source={{ uri: user.photo }}
          style={styles.profileImage}
        />
      )}

      {/* User Information Card */}
      <View style={[styles.infoCard, { borderColor: Colors[colorScheme ?? 'light'].tint }]}>
        {/* Name */}
        <View style={styles.infoRow}>
          <ThemedText style={styles.label}>Full Name</ThemedText>
          <ThemedText style={styles.value}>{user.name}</ThemedText>
        </View>

        <View style={styles.divider} />

        {/* Email */}
        <View style={styles.infoRow}>
          <ThemedText style={styles.label}>Email</ThemedText>
          <ThemedText style={styles.value}>{user.email}</ThemedText>
        </View>

        {/* Given Name */}
        {user.givenName && (
          <>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <ThemedText style={styles.label}>First Name</ThemedText>
              <ThemedText style={styles.value}>{user.givenName}</ThemedText>
            </View>
          </>
        )}

        {/* Family Name */}
        {user.familyName && (
          <>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <ThemedText style={styles.label}>Last Name</ThemedText>
              <ThemedText style={styles.value}>{user.familyName}</ThemedText>
            </View>
          </>
        )}

        {/* User ID */}
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <ThemedText style={styles.label}>User ID</ThemedText>
          <ThemedText style={[styles.value, styles.userId]}>{user.id}</ThemedText>
        </View>
      </View>
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
  title: {
    marginBottom: 24,
    textAlign: 'center',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 24,
    borderWidth: 3,
    borderColor: '#E0E0E0',
  },
  infoCard: {
    width: '100%',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 24,
  },
  infoRow: {
    paddingVertical: 12,
  },
  label: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 4,
    fontWeight: '600',
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
  },
  userId: {
    fontSize: 13,
    opacity: 0.7,
    fontFamily: 'monospace',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    opacity: 0.2,
  },
});
