import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { doc, getDoc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";

export type Role = "admin" | "trustee" | "member" | "scholar";

export type Profile = {
  id: string;
  fullName: string;
  email: string;
  role: Role;
};

export type RegistrationStatus = "pending" | "approved" | "rejected" | null;

type AuthState = {
  user: User | null;
  profile: Profile | null;
  registrationStatus: RegistrationStatus;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signInWithGoogle: () => Promise<{ error: string | null }>;
  registerWithEmail: (
    fullName: string,
    email: string,
    password: string
  ) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

// Only file a pending request if this person doesn't already have an approved profile --
// otherwise a returning, already-approved user signing in again would get re-flagged as pending.
async function ensureRegistrationRequest(uid: string, fullName: string, email: string) {
  const profileSnap = await getDoc(doc(db, "profiles", uid));
  if (profileSnap.exists()) return;

  const requestRef = doc(db, "registrationRequests", uid);
  const existingRequest = await getDoc(requestRef);
  if (existingRequest.exists()) return;

  await setDoc(requestRef, {
    fullName,
    email,
    status: "pending",
    requestedAt: serverTimestamp(),
  });
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [registrationStatus, setRegistrationStatus] = useState<RegistrationStatus>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setRegistrationStatus(null);
      setProfileLoading(false);
      return;
    }

    setProfileLoading(true);
    let unsubRequest: (() => void) | undefined;

    const unsubProfile = onSnapshot(
      doc(db, "profiles", user.uid),
      (snap) => {
        if (unsubRequest) {
          unsubRequest();
          unsubRequest = undefined;
        }

        if (snap.exists()) {
          const data = snap.data();
          setProfile({ id: snap.id, fullName: data.fullName, email: data.email, role: data.role });
          setRegistrationStatus(null);
          setProfileLoading(false);
          return;
        }

        setProfile(null);

        // Self-heal: a profile-less, request-less signed-in user means a previous
        // registration attempt's request write failed (e.g. stale rules at the time).
        // ensureRegistrationRequest is a no-op if a request already exists, so this
        // is safe to call on every load.
        ensureRegistrationRequest(
          user.uid,
          user.displayName ?? user.email ?? "Unknown",
          user.email ?? ""
        ).catch(() => {});

        unsubRequest = onSnapshot(
          doc(db, "registrationRequests", user.uid),
          (reqSnap) => {
            setRegistrationStatus(reqSnap.exists() ? (reqSnap.data().status as RegistrationStatus) : null);
            setProfileLoading(false);
          },
          () => {
            setRegistrationStatus(null);
            setProfileLoading(false);
          }
        );
      },
      () => {
        setProfile(null);
        setProfileLoading(false);
      }
    );

    return () => {
      unsubProfile();
      if (unsubRequest) unsubRequest();
    };
  }, [user]);

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { error: null };
    } catch (err: any) {
      return { error: err.message ?? "Could not sign in." };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const credential = await signInWithPopup(auth, new GoogleAuthProvider());
      await ensureRegistrationRequest(
        credential.user.uid,
        credential.user.displayName ?? credential.user.email ?? "Unknown",
        credential.user.email ?? ""
      );
      return { error: null };
    } catch (err: any) {
      return { error: err.message ?? "Could not sign in with Google." };
    }
  };

  const registerWithEmail = async (fullName: string, email: string, password: string) => {
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(credential.user, { displayName: fullName });
      await ensureRegistrationRequest(credential.user.uid, fullName, email);
      return { error: null };
    } catch (err: any) {
      return { error: err.message ?? "Could not create account." };
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        registrationStatus,
        loading: authLoading || profileLoading,
        signIn,
        signInWithGoogle,
        registerWithEmail,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
