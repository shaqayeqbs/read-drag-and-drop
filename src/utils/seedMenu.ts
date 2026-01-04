import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";
import { MENU_ITEMS } from "../data/menuData";

const seedMenu = async () => {
  try {
    console.log("Checking existing menu items...");

    // Check if menu items already exist
    const existingItems = await getDocs(collection(db, "menu"));
    if (!existingItems.empty) {
      console.log("Menu items already exist in Firestore. Skipping seeding.");
      return;
    }

    console.log("Starting menu data seeding...");

    for (const item of MENU_ITEMS) {
      await addDoc(collection(db, "menu"), {
        name: item.name,
        price: item.price,
        category: item.category,
        image: item.image,
        description: item.description,
      });
      console.log(`Added ${item.name.en}`);
    }

    console.log("Menu data seeding completed!");
  } catch (error) {
    console.error("Error seeding menu data:", error);
    console.log("Make sure Firestore is enabled in your Firebase project.");
  }
};

// Run the seed function
seedMenu();
