import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useFonts } from 'expo-font';
import { Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { Sora_700Bold } from '@expo-google-fonts/sora';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { colors, fonts } from '@/theme';

function Gate() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  useEffect(() => { if (loading) return; const privateRoute = segments[0] === '(app)'; if (user && !privateRoute) router.replace('/(app)'); if (!user && privateRoute) router.replace('/(auth)/login'); }, [loading, router, segments, user]);
  if (loading) return <View style={{ flex: 1, backgroundColor: colors.warmWhite, alignItems: 'center', justifyContent: 'center', gap: 16 }}><Text style={{ color: colors.deepBlue, fontFamily: fonts.display, fontSize: 28 }}>Rumbo Fit</Text><ActivityIndicator color={colors.orange} /></View>;
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.warmWhite } }} />;
}

export default function RootLayout() { const [loaded] = useFonts({ Inter_400Regular, Inter_600SemiBold, Sora_700Bold }); if (!loaded) return null; return <AuthProvider><Gate /></AuthProvider>; }
