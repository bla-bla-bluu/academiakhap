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
import { doc, getDoc, onSnapshot, serverTimestamp, setDoc, type Timestamp } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import type { MembershipStatus } from "../lib/membership";
import { DEFAULT_NETWORK_STATUS, type NetworkStatus } from "../lib/network";
import type { HeritageDesignation } from "../lib/researcher";
import type { MarriageStatus } from "../lib/marriage";

export type Role = "admin" | "trustee" | "member" | "scholar";
export type Gender = "male" | "female";

const ROLE_LABELS: Record<Role, string> = {
  admin: "Pardhan",
  trustee: "Panchayati",
  member: "Member",
  scholar: "Scholar",
};

export function roleLabel(role: Role): string {
  return ROLE_LABELS[role];
}

export type Profile = {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  memberId?: string;
  joinedAt?: Timestamp | null;
  membershipStatus?: MembershipStatus;
  renewalDate?: string;
  gotr?: string;
  age?: number;
  village?: string;
  district?: string;
  state?: string;
  eduQualification?: string;
  gender?: Gender;
  detailsCompleted?: boolean;
  profession?: string;
  expertise?: string;
  researchInterests?: string;
  languages?: string;
  bio?: string;
  networkStatus?: NetworkStatus;
  heritageDesignation?: HeritageDesignation | null;
  heritageArea?: string;
  recognitionNote?: string;
  marriageStatus?: MarriageStatus;
  marriageNote?: string;
};

export type ProfileExtras = {
  profession: string;
  expertise: string;
  researchInterests: string;
  languages: string;
  bio: string;
};

export type ProfileDetails = {
  fullName: string;
  gotr: string;
  age: number;
  village: string;
  district: string;
  state: string;
  eduQualification: string;
  gender: Gender;
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
  completeProfile: (details: ProfileDetails) => Promise<{ error: string | null }>;
  updateFullName: (fullName: string) => Promise<{ error: string | null }>;
  updateProfileExtras: (extras: Partial<ProfileExtras>) => Promise<{ error: string | null }>;
  updateNetworkStatus: (status: NetworkStatus) => Promise<{ error: string | null }>;
  updateMarriageStatus: (status: MarriageStatus, note?: string) => Promise<{ error: string | null }>;
  syncPublicProfile: () => Promise<void>;
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

// Mirrors the non-sensitive subset of a profile into publicProfiles/{uid}, the document the
// Member Network directory actually reads from -- profiles/{uid} itself stays locked to the
// owner and admins. Email, phone, age, gotra and exact village never go into this mirror.
// `overrides` carries whatever this particular save is changing, since `current` (the Profile
// already in React state) may not yet reflect a write that's happening in this same call.
async function syncPublicProfileDoc(uid: string, current: Profile | null, overrides: Partial<Profile>) {
  const merged = { ...current, ...overrides };
  await setDoc(
    doc(db, "publicProfiles", uid),
    {
      fullName: merged.fullName ?? null,
      role: merged.role ?? null,
      memberId: merged.memberId ?? null,
      district: merged.district ?? null,
      state: merged.state ?? null,
      profession: merged.profession ?? null,
      expertise: merged.expertise ?? null,
      researchInterests: merged.researchInterests ?? null,
      languages: merged.languages ?? null,
      bio: merged.bio ?? null,
      networkStatus: merged.networkStatus ?? DEFAULT_NETWORK_STATUS,
      heritageDesignation: merged.heritageDesignation ?? null,
      heritageArea: merged.heritageArea ?? null,
      recognitionNote: merged.recognitionNote ?? null,
    },
    { merge: true }
  );
}

// Mirrors just the marriage-networking status (never anything else about the member) into
// marriageProfiles/{uid} -- the collection whose read rule enforces mutual opt-in visibility.
async function syncMarriageProfileDoc(uid: string, status: MarriageStatus, note?: string) {
  await setDoc(doc(db, "marriageProfiles", uid), { status, note: note ?? null }, { merge: true });
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
          setProfile({
            id: snap.id,
            fullName: data.fullName,
            email: data.email,
            role: data.role,
            memberId: data.memberId,
            joinedAt: data.joinedAt ?? null,
            membershipStatus: data.membershipStatus,
            renewalDate: data.renewalDate,
            gotr: data.gotr,
            age: data.age,
            village: data.village,
            district: data.district,
            state: data.state,
            eduQualification: data.eduQualification,
            gender: data.gender,
            detailsCompleted: data.detailsCompleted ?? false,
            profession: data.profession,
            expertise: data.expertise,
            researchInterests: data.researchInterests,
            languages: data.languages,
            bio: data.bio,
            networkStatus: data.networkStatus,
            heritageDesignation: data.heritageDesignation ?? null,
            heritageArea: data.heritageArea,
            recognitionNote: data.recognitionNote,
            marriageStatus: data.marriageStatus,
            marriageNote: data.marriageNote,
          });
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

  const completeProfile = async (details: ProfileDetails) => {
    if (!user) return { error: "Not signed in." };
    try {
      await setDoc(doc(db, "profiles", user.uid), { ...details, detailsCompleted: true }, { merge: true });
      await syncPublicProfileDoc(user.uid, profile, details);
      return { error: null };
    } catch (err: any) {
      return { error: err.message ?? "Could not save your details." };
    }
  };

  const updateFullName = async (fullName: string) => {
    if (!user) return { error: "Not signed in." };
    const trimmed = fullName.trim();
    if (!trimmed) return { error: "Name cannot be empty." };
    try {
      await setDoc(doc(db, "profiles", user.uid), { fullName: trimmed }, { merge: true });
      await syncPublicProfileDoc(user.uid, profile, { fullName: trimmed });
      await updateProfile(user, { displayName: trimmed }).catch(() => {});
      return { error: null };
    } catch (err: any) {
      return { error: err.message ?? "Could not update your name." };
    }
  };

  const updateProfileExtras = async (extras: Partial<ProfileExtras>) => {
    if (!user) return { error: "Not signed in." };
    try {
      await setDoc(doc(db, "profiles", user.uid), extras, { merge: true });
      await syncPublicProfileDoc(user.uid, profile, extras);
      return { error: null };
    } catch (err: any) {
      return { error: err.message ?? "Could not save your details." };
    }
  };

  const updateNetworkStatus = async (status: NetworkStatus) => {
    if (!user) return { error: "Not signed in." };
    try {
      await setDoc(doc(db, "profiles", user.uid), { networkStatus: status }, { merge: true });
      await syncPublicProfileDoc(user.uid, profile, { networkStatus: status });
      return { error: null };
    } catch (err: any) {
      return { error: err.message ?? "Could not update your network status." };
    }
  };

  const updateMarriageStatus = async (status: MarriageStatus, note?: string) => {
    if (!user) return { error: "Not signed in." };
    try {
      await setDoc(doc(db, "profiles", user.uid), { marriageStatus: status, marriageNote: note?.trim() || null }, { merge: true });
      await syncMarriageProfileDoc(user.uid, status, note);
      return { error: null };
    } catch (err: any) {
      return { error: err.message ?? "Could not update your marriage networking preference." };
    }
  };

  // Self-heal, mirroring ensureRegistrationRequest above: lets a profile created before the
  // Member Network existed appear in the directory the first time its owner opens that tab,
  // without needing an admin backfill pass.
  const syncPublicProfile = async () => {
    if (!user || !profile) return;
    await syncPublicProfileDoc(user.uid, profile, {});
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
        completeProfile,
        updateFullName,
        updateProfileExtras,
        updateNetworkStatus,
        updateMarriageStatus,
        syncPublicProfile,
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
