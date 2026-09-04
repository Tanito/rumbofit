export type AuthUser = { uid: string; email: string | null; displayName: string | null };
export type AuthResult = { ok: true; user: AuthUser } | { ok: false; message: string; cancelled?: boolean };
