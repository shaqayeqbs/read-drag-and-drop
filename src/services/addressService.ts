import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Address } from "../types/types";

const ADDRESSES_COLLECTION = "addresses";

export const createAddress = async (
  address: Omit<Address, "id" | "createdAt">
): Promise<string> => {
  const docRef = await addDoc(collection(db, ADDRESSES_COLLECTION), {
    ...address,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

export const getUserAddresses = async (userId: string): Promise<Address[]> => {
  const q = query(
    collection(db, ADDRESSES_COLLECTION),
    where("userId", "==", userId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      userId: data.userId,
      title: data.title,
      fullAddress: data.fullAddress,
      city: data.city,
      postalCode: data.postalCode,
      phoneNumber: data.phoneNumber,
      recipientName: data.recipientName,
      isDefault: data.isDefault || false,
      createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
    };
  });
};

export const getAddressById = async (
  addressId: string
): Promise<Address | null> => {
  const docRef = doc(db, ADDRESSES_COLLECTION, addressId);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) {
    return null;
  }
  const data = snapshot.data();
  return {
    id: snapshot.id,
    userId: data.userId,
    title: data.title,
    fullAddress: data.fullAddress,
    city: data.city,
    postalCode: data.postalCode,
    phoneNumber: data.phoneNumber,
    recipientName: data.recipientName,
    isDefault: data.isDefault || false,
    createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
  };
};

export const updateAddress = async (
  addressId: string,
  updates: Partial<Omit<Address, "id" | "userId" | "createdAt">>
): Promise<void> => {
  const docRef = doc(db, ADDRESSES_COLLECTION, addressId);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
};

export const deleteAddress = async (addressId: string): Promise<void> => {
  const docRef = doc(db, ADDRESSES_COLLECTION, addressId);
  await deleteDoc(docRef);
};

export const setDefaultAddress = async (
  userId: string,
  addressId: string
): Promise<void> => {
  const addresses = await getUserAddresses(userId);
  const batch = addresses.map(async (addr) => {
    const docRef = doc(db, ADDRESSES_COLLECTION, addr.id);
    await updateDoc(docRef, { isDefault: addr.id === addressId });
  });
  await Promise.all(batch);
};
