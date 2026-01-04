import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "./firebase";
import { MENU_ITEMS } from "../data/menuData";
import type { MenuItem } from "../types/types";

const MENU_COLLECTION = "menu";

export const getMenuItems = async (): Promise<MenuItem[]> => {
  try {
    const snapshot = await getDocs(collection(db, MENU_COLLECTION));
    if (!snapshot.empty) {
      return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          price: data.price,
          category: data.category,
          image: data.image,
          description: data.description,
        };
      });
    }
  } catch (error) {
    console.warn(
      "Failed to fetch from Firestore, falling back to local data:",
      error
    );
  }

  // Fallback to local data
  return MENU_ITEMS;
};

export const getMenuItemsByCategory = async (
  category: string
): Promise<MenuItem[]> => {
  try {
    const q = query(
      collection(db, MENU_COLLECTION),
      where("category", "==", category),
      orderBy("name.en")
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          price: data.price,
          category: data.category,
          image: data.image,
          description: data.description,
        };
      });
    }
  } catch (error) {
    console.warn(
      "Failed to fetch from Firestore, falling back to local data:",
      error
    );
  }

  // Fallback to local data
  return MENU_ITEMS.filter((item) => item.category === category);
};
