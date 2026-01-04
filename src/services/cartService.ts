import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import type { CartItem } from "../types/types";

const CARTS_COLLECTION = "carts";

export const saveUserCart = async (
  userId: string,
  cartItems: CartItem[]
): Promise<void> => {
  const cartRef = doc(db, CARTS_COLLECTION, userId);
  await setDoc(cartRef, {
    items: cartItems,
    updatedAt: serverTimestamp(),
  });
};

export const getUserCart = async (userId: string): Promise<CartItem[]> => {
  const cartRef = doc(db, CARTS_COLLECTION, userId);
  const cartSnap = await getDoc(cartRef);
  if (cartSnap.exists()) {
    const data = cartSnap.data();
    return data.items || [];
  }
  return [];
};
