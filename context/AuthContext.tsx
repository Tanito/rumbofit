import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import * as service from '@/services/firebase';
import type { AuthUser, AuthResult } from '@/types/auth';
type AuthContextValue = { user: AuthUser | null; loading: boolean; signInWithEmail: typeof service.signInWithEmail; registerWithEmail: typeof service.registerWithEmail; signInWithGoogle: typeof service.signInWithGoogle; signInWithApple: typeof service.signInWithApple; signOut: typeof service.signOut };
const Context = createContext<AuthContextValue | undefined>(undefined);
export function AuthProvider({ children }: PropsWithChildren) { const [user, setUser] = useState<AuthUser | null>(null); const [loading, setLoading] = useState(true); useEffect(() => service.observeSession((next) => { setUser(next); setLoading(false); }), []); return <Context.Provider value={useMemo(() => ({ user, loading, signInWithEmail: service.signInWithEmail, registerWithEmail: service.registerWithEmail, signInWithGoogle: service.signInWithGoogle, signInWithApple: service.signInWithApple, signOut: service.signOut }), [user, loading])}>{children}</Context.Provider>; }
export const useAuth = () => { const context = useContext(Context); if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider'); return context; };
