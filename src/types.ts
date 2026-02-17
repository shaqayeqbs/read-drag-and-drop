export type FoodCategory =
  | "pizza"
  | "burger"
  | "pasta"
  | "salad"
  | "drink"
  | "dessert"
  | "cafe"
  | "sandwich";

export interface MenuItem {
  id: string;
  name: {
    en: string;
    fa: string;
  };
  price: number;
  category: FoodCategory;
  image: string;
  description: {
    en: string;
    fa: string;
  };
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  address?: string;
  createdAt: Date;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status:
    | "pending"
    | "confirmed"
    | "preparing"
    | "ready"
    | "delivered"
    | "cancelled";
  createdAt: Date;
  deliveryAddress?: string;
}

export interface CategoryInfo {
  id: FoodCategory;
  name: {
    en: string;
    fa: string;
  };
  icon: string;
}

export interface Station {
  id: number;
  name: string;
  city: string;
  lat: number;
  lng: number;
}
