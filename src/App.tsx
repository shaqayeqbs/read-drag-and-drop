import { useState, useCallback, useRef } from "react";
import {
  DndContext,
  TouchSensor,
  MouseSensor,
  useSensor,
  useSensors,
  DragOverlay,
  closestCenter,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { MenuItemCard } from "./components/MenuItemCard";
import { Cart } from "./components/Cart";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import type { MenuItem, CartItem } from "./types";

// Sample menu items inspired by pizza.ir
const INITIAL_MENU_ITEMS: MenuItem[] = [
  {
    id: "1",
    name: "پیتزا مخصوص",
    price: 285000,
    category: "pizza",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop",
    description: "پیتزای خوشمزه با گوشت، قارچ، فلفل دلمه‌ای و پنیر موزارلا",
  },
  {
    id: "2",
    name: "پیتزا پپرونی",
    price: 245000,
    category: "pizza",
    image:
      "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop",
    description: "پیتزای کلاسیک با پپرونی و پنیر موزارلای فراوان",
  },
  {
    id: "3",
    name: "پیتزا مارگاریتا",
    price: 195000,
    category: "pizza",
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop",
    description: "پیتزای ساده و خوشمزه با سس گوجه، ریحان و موزارلا",
  },
  {
    id: "4",
    name: "برگر مخصوص",
    price: 165000,
    category: "burger",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
    description: "برگر دو طبقه با گوشت، پنیر، خیارشور و سس مخصوص",
  },
  {
    id: "5",
    name: "پاستا آلفردو",
    price: 145000,
    category: "pasta",
    image:
      "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop",
    description: "پاستا خامه‌ای با مرغ و پنیر پارمزان",
  },
  {
    id: "6",
    name: "سالاد سزار",
    price: 95000,
    category: "salad",
    image:
      "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop",
    description: "سالاد تازه با مرغ گریل، کاهو، پنیر پارمزان و سس سزار",
  },
];

function App() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const lastAddTime = useRef<number | null>(null);

  // Configure sensors with proper touch support
  // This is CRITICAL for mobile/tablet functionality
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8, // 8px of movement required before drag starts
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200, // 200ms delay to distinguish from scrolling
        tolerance: 8, // Allow 8px of movement during the delay
      },
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const addToCart = useCallback(
    (item: MenuItem) => {
      // Prevent rapid successive calls
      const now = Date.now();
      if (lastAddTime.current && now - lastAddTime.current < 500) {
        return;
      }
      lastAddTime.current = now;

      const existingItem = cartItems.find((i) => i.id === item.id);

      if (existingItem) {
        toast.info(`تعداد ${item.name} افزایش یافت!`);
        setCartItems((prev) =>
          prev.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          )
        );
      } else {
        toast.success(`${item.name} به سبد خرید اضافه شد!`);
        setCartItems((prev) => [...prev, { ...item, quantity: 1 }]);
      }
    },
    [cartItems]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveId(null);

      if (!over) return;

      // Check if dropping into cart
      if (over.id === "cart-droppable") {
        const item = menuItems.find((item) => item.id === active.id);
        if (item) {
          addToCart(item);
        }
        return;
      }

      // Handle reordering within menu items
      if (active.id !== over.id) {
        setMenuItems((items) => {
          const oldIndex = items.findIndex((item) => item.id === active.id);
          const newIndex = items.findIndex((item) => item.id === over.id);
          return arrayMove(items, oldIndex, newIndex);
        });
      }
    },
    [menuItems, addToCart]
  );

  const removeFromCart = useCallback(
    (id: string) => {
      const itemToRemove = cartItems.find((item) => item.id === id);
      if (itemToRemove) {
        toast.error(`${itemToRemove.name} از سبد خرید حذف شد!`);
      }
      setCartItems((prev) => prev.filter((item) => item.id !== id));
    },
    [cartItems]
  );

  const updateQuantity = useCallback(
    (id: string, quantity: number) => {
      const currentItem = cartItems.find((item) => item.id === id);
      if (currentItem) {
        if (quantity > currentItem.quantity) {
          toast.info(`تعداد ${currentItem.name} افزایش یافت!`);
        } else if (quantity < currentItem.quantity) {
          toast.info(`تعداد ${currentItem.name} کاهش یافت!`);
        }
      }
      setCartItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
    },
    [cartItems]
  );

  const activeItem = activeId
    ? menuItems.find((item) => item.id === activeId)
    : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="min-h-screen py-8 px-4 md:px-8 prevent-scroll">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="text-center mb-12">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent mb-4">
              رستوران آنلاین
            </h1>
            <p className="text-gray-600 text-lg">
              محصولات را بکشید و در سبد خرید رها کنید 🍕
            </p>
            <div className="mt-4 inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              با انگشت بکشید یا کلیک کنید
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Menu Items */}
            <div className="lg:col-span-2">
              <SortableContext items={menuItems} strategy={rectSortingStrategy}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {menuItems.map((item) => (
                    <MenuItemCard
                      key={item.id}
                      item={item}
                      onAddToCart={addToCart}
                    />
                  ))}
                </div>
              </SortableContext>
            </div>

            {/* Cart */}
            <div className="lg:col-span-1">
              <Cart
                items={cartItems}
                onRemoveItem={removeFromCart}
                onUpdateQuantity={updateQuantity}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Drag Overlay for smooth dragging experience */}
      <DragOverlay>
        {activeItem ? (
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden transform rotate-6 scale-110 opacity-90">
            <div className="relative h-48 overflow-hidden">
              <img
                src={activeItem.image}
                alt={activeItem.name}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-bold text-gray-800">
                {activeItem.name}
              </h3>
            </div>
          </div>
        ) : null}
      </DragOverlay>

      {/* Toast notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={true}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </DndContext>
  );
}

export default App;
