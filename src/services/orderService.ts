import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Order } from "../types/types";

const ORDERS_COLLECTION = "orders";

export const createOrder = async (
  order: Omit<Order, "id" | "createdAt">
): Promise<string> => {
  const docRef = await addDoc(collection(db, ORDERS_COLLECTION), {
    ...order,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

export const getUserOrders = async (userId: string): Promise<Order[]> => {
  const q = query(
    collection(db, ORDERS_COLLECTION),
    where("userId", "==", userId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      userId: data.userId,
      items: data.items,
      total: data.total,
      status: data.status,
      deliveryAddress: data.deliveryAddress,
      notes: data.notes,
      estimatedDeliveryTime: data.estimatedDeliveryTime
        ? (data.estimatedDeliveryTime as Timestamp).toDate()
        : undefined,
      createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
    };
  });
};

export const getOrderById = async (orderId: string): Promise<Order | null> => {
  const docRef = doc(db, ORDERS_COLLECTION, orderId);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) {
    return null;
  }
  const data = snapshot.data();
  return {
    id: snapshot.id,
    userId: data.userId,
    items: data.items,
    total: data.total,
    status: data.status,
    deliveryAddress: data.deliveryAddress,
    notes: data.notes,
    estimatedDeliveryTime: data.estimatedDeliveryTime
      ? (data.estimatedDeliveryTime as Timestamp).toDate()
      : undefined,
    createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
  };
};

export const updateOrderStatus = async (
  orderId: string,
  status: Order["status"]
): Promise<void> => {
  const docRef = doc(db, ORDERS_COLLECTION, orderId);
  await updateDoc(docRef, {
    status,
    updatedAt: serverTimestamp(),
  });
};
