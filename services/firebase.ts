import auth from '@react-native-firebase/auth';
import { Platform } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import * as AppleAuthentication from 'expo-apple-authentication';
import type { AuthResult, AuthUser } from '@/types/auth';

const hasFirebaseConfig = Boolean(process.env.EXPO_PUBLIC_FIREBASE_API_KEY && process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID);
const mapUser = (user: { uid: string; email: string | null | undefined; displayName: string | null | undefined }): AuthUser => ({ uid: user.uid, email: user.email ?? null, displayName: user.displayName ?? null });
const firebaseMessage = (error: unknown) => {
  const code = String((error as { code?: string })?.code ?? '');
  const messages: Record<string, string> = {
    'auth/invalid-credential': 'El email o la contraseña no son correctos.', 'auth/user-not-found': 'No encontramos una cuenta con ese email.',
    'auth/wrong-password': 'El email o la contraseña no son correctos.', 'auth/email-already-in-use': 'Ya existe una cuenta con ese email.',
    'auth/weak-password': 'Elegí una contraseña más segura.', 'auth/invalid-email': 'Ingresá un email válido.',
    'auth/network-request-failed': 'Revisá tu conexión e intentá nuevamente.', 'auth/account-exists-with-different-credential': 'Ese email ya está vinculado a otro método de acceso.'
  };
  return messages[code] ?? (hasFirebaseConfig ? 'No pudimos completar la operación. Intentá nuevamente.' : 'Firebase todavía no está configurado. Revisá el README.');
};
const unavailable = (): AuthResult => ({ ok: false, message: 'Firebase todavía no está configurado. Completá el archivo .env y agregá los archivos nativos indicados en el README.' });

export const observeSession = (callback: (user: AuthUser | null) => void) => {
  if (!hasFirebaseConfig) { callback(null); return () => undefined; }
  try { return auth().onAuthStateChanged((user) => callback(user ? mapUser(user) : null)); } catch { callback(null); return () => undefined; }
};
export async function signInWithEmail(email: string, password: string): Promise<AuthResult> {
  if (!hasFirebaseConfig) return unavailable();
  try { const result = await auth().signInWithEmailAndPassword(email, password); return { ok: true, user: mapUser(result.user) }; } catch (error) { return { ok: false, message: firebaseMessage(error) }; }
}
export async function registerWithEmail(name: string, email: string, password: string): Promise<AuthResult> {
  if (!hasFirebaseConfig) return unavailable();
  try { const result = await auth().createUserWithEmailAndPassword(email, password); await result.user.updateProfile({ displayName: name }); await result.user.sendEmailVerification(); return { ok: true, user: mapUser(result.user) }; } catch (error) { return { ok: false, message: firebaseMessage(error) }; }
}
export async function signInWithGoogle(): Promise<AuthResult> {
  if (!hasFirebaseConfig || !process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID) return unavailable();
  try { await GoogleSignin.hasPlayServices(); const result = await GoogleSignin.signIn(); const idToken = result.data?.idToken; if (!idToken) return { ok: false, message: 'Google no devolvió una credencial válida.' }; const credential = auth.GoogleAuthProvider.credential(idToken); const user = await auth().signInWithCredential(credential); return { ok: true, user: mapUser(user.user) }; } catch (error) { const code = String((error as { code?: string })?.code ?? ''); return { ok: false, message: firebaseMessage(error), cancelled: code.includes('CANCEL') }; }
}
export async function signInWithApple(): Promise<AuthResult> {
  if (Platform.OS !== 'ios' || !hasFirebaseConfig) return unavailable();
  try { const credential = await AppleAuthentication.signInAsync({ requestedScopes: [AppleAuthentication.AppleAuthenticationScope.FULL_NAME, AppleAuthentication.AppleAuthenticationScope.EMAIL] }); if (!credential.identityToken) return { ok: false, message: 'Apple no devolvió una credencial válida.' }; const provider = auth.AppleAuthProvider; const firebaseCredential = provider.credential(credential.identityToken); const user = await auth().signInWithCredential(firebaseCredential); return { ok: true, user: mapUser(user.user) }; } catch (error) { const code = String((error as { code?: string })?.code ?? ''); return { ok: false, message: code === 'ERR_REQUEST_CANCELED' ? 'cancelled' : firebaseMessage(error), cancelled: code === 'ERR_REQUEST_CANCELED' }; }
}
export async function signOut() { if (hasFirebaseConfig) await auth().signOut(); }
