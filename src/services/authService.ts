import type { User as FirebaseUser } from "firebase/auth";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updatePassword,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "./firebase";
import type { User } from "../types/types";

export const loginUser = async (
  email: string,
  password: string
): Promise<FirebaseUser> => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredential.user;
};

export const registerUser = async (
  email: string,
  password: string,
  name: string
): Promise<FirebaseUser> => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = userCredential.user;

  await updateProfile(user, { displayName: name });

  await setDoc(doc(db, "users", user.uid), {
    email: user.email,
    name: name,
    createdAt: serverTimestamp(),
  });

  return user;
};

export const logoutUser = async (): Promise<void> => {
  await signOut(auth);
};

export const resetPassword = async (email: string): Promise<void> => {
  await sendPasswordResetEmail(auth, email);
};

export const changePassword = async (newPassword: string): Promise<void> => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("No user logged in");
  }
  await updatePassword(user, newPassword);
};

export const getUserProfile = async (userId: string): Promise<User | null> => {
  const userDoc = await getDoc(doc(db, "users", userId));
  if (!userDoc.exists()) {
    return null;
  }
  const data = userDoc.data();
  return {
    id: userDoc.id,
    email: data.email,
    name: data.name,
    phoneNumber: data.phoneNumber,
    defaultAddressId: data.defaultAddressId,
    createdAt: data.createdAt?.toDate(),
  };
};

export const updateUserProfile = async (
  userId: string,
  updates: Partial<User>
): Promise<void> => {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
};

export const onAuthChange = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export const getCurrentUser = (): FirebaseUser | null => {
  return auth.currentUser;
};
