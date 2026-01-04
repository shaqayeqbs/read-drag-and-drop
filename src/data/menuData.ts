import type { MenuItem } from "../types/types";

export const MENU_ITEMS: MenuItem[] = [
  // Pizza (10 items)
  {
    id: "1",
    name: {
      en: "Margherita Pizza",
      fa: "پیتزا مارگاریتا",
    },
    price: 195000,
    category: "pizza",
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300&h=200&fit=contain",
    description: {
      en: "Simple and delicious pizza with tomato sauce, basil and mozzarella",
      fa: "پیتزای ساده و خوشمزه با سس گوجه، ریحان و موزارلا",
    },
  },
  {
    id: "2",
    name: {
      en: "Pepperoni Pizza",
      fa: "پیتزا پپرونی",
    },
    price: 245000,
    category: "pizza",
    image:
      "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=300&h=200&fit=contain",
    description: {
      en: "Classic pizza with pepperoni and lots of mozzarella cheese",
      fa: "پیتزای کلاسیک با پپرونی و پنیر موزارلای فراوان",
    },
  },
  {
    id: "3",
    name: {
      en: "BBQ Chicken Pizza",
      fa: "پیتزا مرغ BBQ",
    },
    price: 265000,
    category: "pizza",
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=contain",
    description: {
      en: "Pizza with BBQ chicken, red onions and cilantro",
      fa: "پیتزا با مرغ BBQ، پیاز قرمز و گشنیز",
    },
  },
  {
    id: "4",
    name: {
      en: "Vegetarian Pizza",
      fa: "پیتزا گیاهی",
    },
    price: 225000,
    category: "pizza",
    image:
      "https://images.unsplash.com/photo-1571066811602-716837d681de?w=300&h=200&fit=contain",
    description: {
      en: "Pizza loaded with fresh vegetables and cheese",
      fa: "پیتزا پر از سبزیجات تازه و پنیر",
    },
  },
  {
    id: "5",
    name: {
      en: "Special Pizza",
      fa: "پیتزا مخصوص",
    },
    price: 285000,
    category: "pizza",
    image:
      "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=300&h=200&fit=contain",
    description: {
      en: "Delicious pizza with meat, mushrooms, bell peppers and mozzarella",
      fa: "پیتزای خوشمزه با گوشت، قارچ، فلفل دلمه‌ای و پنیر موزارلا",
    },
  },

  // Burgers (5 items)
  {
    id: "6",
    name: {
      en: "Classic Burger",
      fa: "برگر کلاسیک",
    },
    price: 185000,
    category: "burger",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=contain",
    description: {
      en: "Juicy beef patty with lettuce, tomato, onion and special sauce",
      fa: "کوتلت گوشت آبدار با کاهو، گوجه، پیاز و سس مخصوص",
    },
  },
  {
    id: "7",
    name: {
      en: "Cheese Burger",
      fa: "برگر پنیر",
    },
    price: 205000,
    category: "burger",
    image:
      "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=300&h=200&fit=contain",
    description: {
      en: "Classic burger with melted cheese on top",
      fa: "برگر کلاسیک با پنیر آب شده روی آن",
    },
  },
  {
    id: "8",
    name: {
      en: "Chicken Burger",
      fa: "برگر مرغ",
    },
    price: 175000,
    category: "burger",
    image:
      "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=300&h=200&fit=contain",
    description: {
      en: "Grilled chicken breast with fresh vegetables",
      fa: "سینه مرغ گریل شده با سبزیجات تازه",
    },
  },

  // Pasta (4 items)
  {
    id: "9",
    name: {
      en: "Spaghetti Carbonara",
      fa: "اسپاگتی کاربونارا",
    },
    price: 225000,
    category: "pasta",
    image:
      "https://images.unsplash.com/photo-1551892376-c73ba8b86727?w=300&h=200&fit=contain",
    description: {
      en: "Creamy pasta with bacon, eggs and parmesan cheese",
      fa: "پاستای خامه‌ای با بیکن، تخم مرغ و پنیر پارمزان",
    },
  },
  {
    id: "10",
    name: {
      en: "Penne Arrabbiata",
      fa: "پنه آرابیاتا",
    },
    price: 195000,
    category: "pasta",
    image:
      "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=300&h=200&fit=contain",
    description: {
      en: "Spicy tomato sauce pasta with garlic and chili",
      fa: "پاستای سس گوجه تند با سیر و فلفل چیلی",
    },
  },

  // Salads (3 items)
  {
    id: "11",
    name: {
      en: "Caesar Salad",
      fa: "سالاد سزار",
    },
    price: 145000,
    category: "salad",
    image:
      "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=300&h=200&fit=contain",
    description: {
      en: "Fresh romaine lettuce with caesar dressing and croutons",
      fa: "کاهوی رومی تازه با سس سزار و کراتون",
    },
  },
  {
    id: "12",
    name: {
      en: "Greek Salad",
      fa: "سالاد یونانی",
    },
    price: 165000,
    category: "salad",
    image:
      "https://images.unsplash.com/photo-1551782450-17144efb5723?w=300&h=200&fit=contain",
    description: {
      en: "Traditional Greek salad with feta cheese and olives",
      fa: "سالاد یونانی سنتی با پنیر فتا و زیتون",
    },
  },

  // Drinks (4 items)
  {
    id: "13",
    name: {
      en: "Coca Cola",
      fa: "کوکا کولا",
    },
    price: 25000,
    category: "drink",
    image:
      "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=300&h=200&fit=contain",
    description: {
      en: "Refreshing cola drink",
      fa: "نوشابه کولای خنک کننده",
    },
  },
  {
    id: "14",
    name: {
      en: "Orange Juice",
      fa: "آب پرتقال",
    },
    price: 35000,
    category: "drink",
    image:
      "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=300&h=200&fit=contain",
    description: {
      en: "Fresh squeezed orange juice",
      fa: "آب پرتقال تازه گرفته",
    },
  },

  // Desserts (3 items)
  {
    id: "15",
    name: {
      en: "Chocolate Cake",
      fa: "کیک شکلاتی",
    },
    price: 95000,
    category: "dessert",
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&h=200&fit=contain",
    description: {
      en: "Rich chocolate cake with chocolate frosting",
      fa: "کیک شکلاتی غنی با پوشش شکلاتی",
    },
  },
  {
    id: "16",
    name: {
      en: "Tiramisu",
      fa: "تیرامیسو",
    },
    price: 105000,
    category: "dessert",
    image:
      "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=300&h=200&fit=contain",
    description: {
      en: "Classic Italian dessert with coffee and mascarpone",
      fa: "دسر ایتالیایی کلاسیک با قهوه و ماسکارپونه",
    },
  },

  // Sandwiches (4 items)
  {
    id: "17",
    name: {
      en: "Club Sandwich",
      fa: "ساندویچ کلاب",
    },
    price: 165000,
    category: "sandwich",
    image:
      "https://images.unsplash.com/photo-1553909489-cd5096e95c18?w=300&h=200&fit=contain",
    description: {
      en: "Triple decker sandwich with turkey, bacon, lettuce and tomato",
      fa: "ساندویچ سه طبقه با مرغ، بیکن، کاهو و گوجه",
    },
  },
  {
    id: "18",
    name: {
      en: "Grilled Cheese Panini",
      fa: "پنینی پنیر گریل شده",
    },
    price: 135000,
    category: "sandwich",
    image:
      "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=300&h=200&fit=contain",
    description: {
      en: "Melted cheese between grilled bread slices",
      fa: "پنیر آب شده بین دو برش نان گریل شده",
    },
  },
  {
    id: "19",
    name: {
      en: "Chicken Panini",
      fa: "پنینی مرغ",
    },
    price: 175000,
    category: "sandwich",
    image:
      "https://images.unsplash.com/photo-1559054663-459c5dd6b2e7?w=300&h=200&fit=contain",
    description: {
      en: "Grilled chicken panini with vegetables and cheese",
      fa: "پنینی مرغ گریل شده با سبزیجات و پنیر",
    },
  },
  {
    id: "20",
    name: {
      en: "BLT Sandwich",
      fa: "ساندویچ BLT",
    },
    price: 145000,
    category: "sandwich",
    image:
      "https://images.unsplash.com/photo-1553909489-ec217ac8ef9?w=300&h=200&fit=contain",
    description: {
      en: "Bacon, lettuce and tomato sandwich",
      fa: "ساندویچ بیکن، کاهو و گوجه",
    },
  },

  // Cafe items (3 items)
  {
    id: "21",
    name: {
      en: "Cappuccino",
      fa: "کاپوچینو",
    },
    price: 55000,
    category: "cafe",
    image:
      "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=300&h=200&fit=contain",
    description: {
      en: "Espresso with steamed milk and foam",
      fa: "اسپرسو با شیر بخارپز و کف",
    },
  },
  {
    id: "22",
    name: {
      en: "Latte",
      fa: "لاته",
    },
    price: 60000,
    category: "cafe",
    image:
      "https://images.unsplash.com/photo-1561047029-3000c68339ca?w=300&h=200&fit=contain",
    description: {
      en: "Smooth espresso with steamed milk",
      fa: "اسپرسوی صاف با شیر بخارپز",
    },
  },
  {
    id: "23",
    name: {
      en: "Americano",
      fa: "آمریکانو",
    },
    price: 45000,
    category: "cafe",
    image:
      "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=200&fit=contain",
    description: {
      en: "Espresso diluted with hot water",
      fa: "اسپرسو رقیق شده با آب داغ",
    },
  },
];
