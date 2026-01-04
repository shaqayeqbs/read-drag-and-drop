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
  phoneNumber?: string;
  defaultAddressId?: string;
  createdAt: Date;
}

export interface Address {
  id: string;
  userId: string;
  title: string;
  fullAddress: string;
  city: string;
  postalCode?: string;
  phoneNumber: string;
  recipientName: string;
  isDefault: boolean;
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
  deliveryAddress: Address;
  notes?: string;
  estimatedDeliveryTime?: Date;
}

export interface CategoryInfo {
  id: FoodCategory;
  name: {
    en: string;
    fa: string;
  };
  icon: string;
}
