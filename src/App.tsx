import { useState, useCallback, useRef, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Routes, Route, useNavigate } from "react-router-dom";
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
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { MenuItemCard } from "./components/MenuItemCard";
import { Cart } from "./components/Cart";
import { CartPage } from "./components/CartPage";
import { CategoryTabs } from "./components/CategoryTabs";
import { Navigation } from "./components/Navigation";
import { MobileSidebar } from "./components/MobileSidebar";
import { AuthModal } from "./components/AuthModal";
import { OrderModal } from "./components/OrderModal";
import { Profile } from "./pages/Profile";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import type { MenuItem, CartItem, FoodCategory, User, Order } from "./types";
import { MENU_ITEMS } from "./data/menuData";

// Mock user data for demo
const MOCK_USERS: User[] = [
  {
    id: "1",
    email: "test@test.com",
    name: "کاربر تست",
    createdAt: new Date(),
  },
];

// Mock orders for demo
const MOCK_ORDERS: Order[] = [
  {
    id: "order_1",
    userId: "1",
    items: [
      {
        ...MENU_ITEMS[0],
        quantity: 2,
      },
      {
        ...MENU_ITEMS[3],
        quantity: 1,
      },
    ],
    total: 715000,
    status: "delivered",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
  },
];

// Page Components
interface HomePageProps {
  t: (key: string) => string;
  activeCategory: FoodCategory | "all";
  setActiveCategory: (category: FoodCategory | "all") => void;
  filteredItems: MenuItem[];
  addToCart: (item: MenuItem) => void;
  cartItems: CartItem[];
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  handleCheckout: () => void;
}

const HomePage: React.FC<HomePageProps> = ({
  t,
  activeCategory,
  setActiveCategory,
  filteredItems,
  addToCart,
  cartItems,
  removeFromCart,
  updateQuantity,
  handleCheckout,
}) => (
  <div className="min-h-screen py-8 px-4 md:px-8 prevent-scroll">
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-4 font-vazir">
          {t("app.title")}
        </h1>
        <p className="text-gray-600 text-lg font-vazir">{t("app.subtitle")}</p>
      </header>

      {/* Category Tabs */}
      <CategoryTabs
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {/* Menu Items Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Menu Items */}
          <div className="lg:col-span-2">
            <SortableContext
              items={filteredItems}
              strategy={rectSortingStrategy}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {filteredItems.map((item) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    onAddToCart={addToCart}
                  />
                ))}
              </div>
            </SortableContext>
          </div>

          {/* Cart - Hidden on mobile */}
          <div className="hidden lg:block lg:col-span-1">
            <Cart
              items={cartItems}
              onRemoveItem={removeFromCart}
              onUpdateQuantity={updateQuantity}
              onCheckout={handleCheckout}
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);

function App() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  // State management
  const [menuItems] = useState<MenuItem[]>(MENU_ITEMS);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<FoodCategory | "all">(
    "all"
  );
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (error) {
        console.error("Failed to parse saved user:", error);
        return null;
      }
    }
    return null;
  });
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const lastAddTime = useRef<number | null>(null);

  // Configure sensors with proper touch support
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 300,
        tolerance: 8,
      },
    })
  );

  // Filter items based on category
  const filteredItems = useMemo(() => {
    if (activeCategory === "all") {
      return menuItems;
    } else {
      return menuItems.filter((item) => item.category === activeCategory);
    }
  }, [activeCategory, menuItems]);

  // Navigation handlers
  const handleHomeClick = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const handleCartClick = useCallback(() => {
    navigate("/cart");
  }, [navigate]);

  const handleProfileClick = useCallback(() => {
    navigate("/profile");
  }, [navigate]);

  const handleOrdersClick = useCallback(() => {
    setIsOrderModalOpen(true);
  }, []);

  // Authentication handlers
  const handleLogin = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      // Get users from localStorage
      const storedUsers = localStorage.getItem("users");
      const users = storedUsers ? JSON.parse(storedUsers) : MOCK_USERS;

      // Find user and verify password
      const user = users.find((u: User) => u.email === email);
      if (user && password === "password") {
        setCurrentUser(user);
        localStorage.setItem("currentUser", JSON.stringify(user));
        return true;
      }
      return false;
    },
    []
  );

  const handleRegister = useCallback(
    async (
      email: string,
      _password: string,
      name: string
    ): Promise<boolean> => {
      // Get existing users from localStorage
      const storedUsers = localStorage.getItem("users");
      const users = storedUsers ? JSON.parse(storedUsers) : MOCK_USERS;

      // Check if user already exists
      if (users.find((u: User) => u.email === email)) {
        return false;
      }

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        email,
        name,
        createdAt: new Date(),
      };

      // Save to localStorage
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("currentUser", JSON.stringify(newUser));

      setCurrentUser(newUser);
      return true;
    },
    []
  );

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    setCartItems([]);
    localStorage.removeItem("currentUser");
    toast.info(t("auth.logout"));
  }, [t]);

  // Drag and drop handlers
  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const addToCart = useCallback(
    (item: MenuItem) => {
      // Allow adding to cart without login
      // Prevent rapid successive calls
      const now = Date.now();
      if (lastAddTime.current && now - lastAddTime.current < 500) {
        return;
      }
      lastAddTime.current = now;

      const existingItem = cartItems.find((i) => i.id === item.id);

      if (existingItem) {
        toast.info(
          t("notifications.quantityIncreased", {
            item: i18n.language === "fa" ? item.name.fa : item.name.en,
          })
        );
        setCartItems((prev) =>
          prev.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          )
        );
      } else {
        toast.success(
          t("notifications.addedToCart", {
            item: i18n.language === "fa" ? item.name.fa : item.name.en,
          })
        );
        setCartItems((prev) => [...prev, { ...item, quantity: 1 }]);
      }
    },
    [cartItems, t, i18n.language]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveId(null);

      if (!over) return;

      // Check if dropping into cart
      if (over.id === "cart-droppable") {
        const item = filteredItems.find((item) => item.id === active.id);
        if (item) {
          addToCart(item);
        }
        return;
      }

      // Reordering is disabled for filtered items
    },
    [filteredItems, addToCart]
  );

  // Cart management
  const removeFromCart = useCallback(
    (id: string) => {
      const itemToRemove = cartItems.find((item) => item.id === id);
      if (itemToRemove) {
        toast.error(
          t("notifications.removedFromCart", {
            item:
              i18n.language === "fa"
                ? itemToRemove.name.fa
                : itemToRemove.name.en,
          })
        );
      }
      setCartItems((prev) => prev.filter((item) => item.id !== id));
    },
    [cartItems, t, i18n.language]
  );

  const updateQuantity = useCallback(
    (id: string, quantity: number) => {
      const currentItem = cartItems.find((item) => item.id === id);
      if (currentItem) {
        if (quantity > currentItem.quantity) {
          toast.info(
            t("notifications.quantityIncreased", {
              item:
                i18n.language === "fa"
                  ? currentItem.name.fa
                  : currentItem.name.en,
            })
          );
        } else if (quantity < currentItem.quantity) {
          toast.info(
            t("notifications.quantityDecreased", {
              item:
                i18n.language === "fa"
                  ? currentItem.name.fa
                  : currentItem.name.en,
            })
          );
        }
      }
      setCartItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
    },
    [cartItems, t, i18n.language]
  );

  // Order management
  const handleCheckout = useCallback(() => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }

    if (cartItems.length === 0) {
      toast.warning(t("notifications.emptyCart"));
      return;
    }

    const total = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const newOrder: Order = {
      id: `order_${Date.now()}`,
      userId: currentUser.id,
      items: [...cartItems],
      total,
      status: "pending",
      createdAt: new Date(),
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCartItems([]);

    toast.success(
      t("notifications.orderPlaced", {
        total: total.toLocaleString("fa-IR"),
      })
    );
  }, [currentUser, cartItems, t]);

  const activeItem = activeId
    ? filteredItems.find((item) => item.id === activeId)
    : null;

  const CartPageComponent = () => (
    <div className="min-h-screen py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <CartPage
          items={cartItems}
          onRemoveItem={removeFromCart}
          onUpdateQuantity={updateQuantity}
          onCheckout={handleCheckout}
          onBack={handleHomeClick}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
      </div>
    </div>
  );

  const ProfilePageComponent = () => (
    <div className="min-h-screen py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {currentUser ? (
          <Profile
            user={currentUser}
            onUpdateProfile={(updates) => {
              setCurrentUser({ ...currentUser, ...updates });
              toast.success(t("profile.updateSuccess"));
            }}
            onChangePassword={async (currentPassword) => {
              // Mock password change
              if (currentPassword === "password") {
                toast.success(t("profile.passwordChanged"));
                return true;
              }
              toast.error(t("profile.passwordError"));
              return false;
            }}
            onRequestPasswordReset={async () => {
              // Mock password reset request
              toast.success(t("profile.resetEmailSent"));
              return true;
            }}
            onLogout={handleLogout}
            onBack={handleHomeClick}
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
              {t("auth.loginRequired")}
            </p>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition-colors font-vazir"
            >
              {t("auth.login")}
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {/* Navigation - Always visible */}
      <Navigation
        isLoggedIn={!!currentUser}
        userName={currentUser?.name}
        onLoginClick={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onOrdersClick={() => setIsOrderModalOpen(true)}
        onProfileClick={handleProfileClick}
        cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={handleCartClick}
        onMenuClick={() => setIsMobileSidebarOpen(true)}
        onHomeClick={handleHomeClick}
      />

      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              t={t}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              filteredItems={filteredItems}
              addToCart={addToCart}
              cartItems={cartItems}
              removeFromCart={removeFromCart}
              updateQuantity={updateQuantity}
              handleCheckout={handleCheckout}
            />
          }
        />
        <Route path="/cart" element={<CartPageComponent />} />
        <Route path="/profile" element={<ProfilePageComponent />} />
      </Routes>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeItem ? (
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden transform rotate-6 scale-110 opacity-90">
            <div className="relative h-52 overflow-hidden">
              <img
                src={activeItem.image}
                alt={
                  i18n.language === "fa"
                    ? activeItem.name.fa
                    : activeItem.name.en
                }
                className="w-full h-full object-cover"
                draggable={false}
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-800 font-vazir">
                {i18n.language === "fa"
                  ? activeItem.name.fa
                  : activeItem.name.en}
              </h3>
            </div>
          </div>
        ) : null}
      </DragOverlay>

      {/* Global Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />

      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        orders={orders.filter((order) => order.userId === currentUser?.id)}
      />

      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
        isLoggedIn={!!currentUser}
        userName={currentUser?.name}
        onLoginClick={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onOrdersClick={handleOrdersClick}
        onProfileClick={handleProfileClick}
        onHomeClick={handleHomeClick}
        onCartClick={handleCartClick}
        cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
      />

      {/* Toast notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={i18n.language === "fa"}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </DndContext>
  );
}

export default App;
