import { useState, useCallback, useRef, useMemo, useEffect } from "react";
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
import { MenuItemCard } from "./components/features/menu/MenuItemCard";
import { Cart } from "./components/features/cart/Cart";
import { CartPage } from "./components/features/cart/CartPage";
import { CategoryTabs } from "./components/features/menu/CategoryTabs";
import { Navigation } from "./components/layout/Navigation";
import { MobileSidebar } from "./components/layout/MobileSidebar";
import { AuthModal } from "./components/ui/AuthModal";
import { OrderModal } from "./components/ui/OrderModal";
import { Profile } from "./pages/Profile";
import MapPage from "./pages/MapPage";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import type {
  MenuItem,
  CartItem,
  FoodCategory,
  User,
  Address,
  Order,
} from "./types/types";
import {
  onAuthChange,
  logoutUser,
  getCurrentUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
  resetPassword,
} from "./services/authService";
import { getMenuItems } from "./services/menuService";
import { createOrder, getUserOrders } from "./services/orderService";
import { getUserAddresses } from "./services/addressService";
import { getUserCart, saveUserCart } from "./services/cartService";
import { useCartStore } from "./state/cartStore";

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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-0">
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
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<FoodCategory | "all">(
    "all",
  );
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isAddressConfirmOpen, setIsAddressConfirmOpen] = useState(false);
  const [pendingOrderAddress, setPendingOrderAddress] =
    useState<Address | null>(null);

  const cartItems = useCartStore((state) => state.cartItems);
  const lastAddTime = useRef<number | null>(null);
  const cartLoaded = useRef(false);

  // Load menu items from Firestore
  useEffect(() => {
    const loadMenuItems = async () => {
      try {
        const items = await getMenuItems();
        setMenuItems(items);
      } catch (error) {
        console.error("Error loading menu items:", error);
        toast.error("Failed to load menu items");
      }
    };
    loadMenuItems();
  }, []);

  // Load cart items from localStorage or DB
  useEffect(() => {
    const loadCart = async () => {
      if (!cartLoaded.current) {
        // First load: from hash if anonymous
        if (!currentUser && window.location.hash) {
          try {
            const hash = decodeURIComponent(window.location.hash.slice(1));
            const parsedCart = JSON.parse(hash);
            console.log("Loaded cart from URL hash:", parsedCart);
            useCartStore.setState({ cartItems: parsedCart });
          } catch (error) {
            console.error("Error parsing cart from hash:", error);
          }
        } else {
          console.log("No saved cart in hash or user logged in");
        }
        cartLoaded.current = true;
      } else if (currentUser) {
        // Subsequent load on login: load from DB if has items
        try {
          const dbCart = await getUserCart(currentUser.id);
          console.log("Loaded cart from DB:", dbCart);
          if (dbCart.length > 0) {
            useCartStore.setState({ cartItems: dbCart });
          } else {
            console.log("DB cart empty, keeping current cart");
          }
        } catch (error) {
          console.error("Error loading cart from DB:", error);
        }
      } else {
        // On logout: reload from hash
        if (window.location.hash) {
          try {
            const hash = decodeURIComponent(window.location.hash.slice(1));
            const parsedCart = JSON.parse(hash);
            console.log("Reloaded cart from hash:", parsedCart);
            useCartStore.setState({ cartItems: parsedCart });
          } catch (error) {
            console.error("Error parsing saved cart:", error);
          }
        } else {
          console.log("No saved cart in hash on logout");
          useCartStore.setState({ cartItems: [] });
        }
      }
    };
    loadCart();
  }, [currentUser]);

  // Save cart items whenever cart changes
  useEffect(() => {
    const saveCart = async () => {
      console.log("Saving cart:", cartItems);
      // Save to URL hash for anonymous users
      window.location.hash = encodeURIComponent(JSON.stringify(cartItems));

      if (currentUser) {
        try {
          await saveUserCart(currentUser.id, cartItems);
          console.log("Saved cart to DB:", cartItems);
        } catch (error) {
          console.error("Error saving cart to DB:", error);
          // localStorage already saved above
        }
      } else {
        console.log("Cart saved to URL hash (anonymous)");
      }
    };
    saveCart();
  }, [cartItems, currentUser]);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        const userProfile = await getUserProfile(firebaseUser.uid);
        if (userProfile) {
          setCurrentUser(userProfile); // Load cart from DB if available
          try {
            const dbCart = await getUserCart(userProfile.id);
            if (dbCart.length > 0) {
              useCartStore.setState({ cartItems: dbCart });
            }
          } catch (error) {
            console.error("Error loading cart from DB:", error);
          }
        }
      } else {
        setCurrentUser(null);
        setOrders([]);
      }
    });
    return () => unsubscribe();
  }, []);

  // Load user orders when user changes
  useEffect(() => {
    const loadOrders = async () => {
      if (currentUser) {
        try {
          const userOrders = await getUserOrders(currentUser.id);
          setOrders(userOrders);
        } catch (error) {
          console.error("Error loading orders:", error);
        }
      }
    };
    loadOrders();
  }, [currentUser]);

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
    }),
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

  const handleLogout = useCallback(async () => {
    try {
      await logoutUser();
      setCurrentUser(null);
      useCartStore.getState().clearCart();
      toast.info(t("auth.logout"));
    } catch (error) {
      console.error("Logout error:", error);
    }
  }, [t]);

  const handleAuthSuccess = useCallback(() => {
    const user = getCurrentUser();
    if (user) {
      getUserProfile(user.uid).then((profile) => {
        if (profile) {
          setCurrentUser(profile);
        }
      });
    }
  }, []);

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
          }),
        );
      } else {
        toast.success(
          t("notifications.addedToCart", {
            item: i18n.language === "fa" ? item.name.fa : item.name.en,
          }),
        );
      }

      useCartStore.getState().addToCart({ ...item, quantity: 1 });
    },
    [cartItems, t, i18n.language],
  );

  const removeFromCart = useCallback(
    (id: string) => {
      const itemToRemove = cartItems.find((item) => item.id === id);
      if (itemToRemove) {
        toast.success(
          t("notifications.removedFromCart", {
            item:
              i18n.language === "fa"
                ? itemToRemove.name.fa
                : itemToRemove.name.en,
          }),
        );
      }
      useCartStore.getState().removeFromCart(id);
    },
    [cartItems, t, i18n.language],
  );

  const updateQuantity = useCallback(
    (id: string, quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(id);
        return;
      }
      useCartStore.getState().updateQuantity(id, quantity);
    },
    [removeFromCart],
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
    [filteredItems, addToCart],
  );

  // Order management
  const handleCheckout = useCallback(async () => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }

    if (cartItems.length === 0) {
      toast.warning(t("notifications.emptyCart"));
      return;
    }

    try {
      // Get user's default address
      const addresses = await getUserAddresses(currentUser.id);
      console.log("User addresses:", addresses);
      const defaultAddress = addresses.find((addr) => addr.isDefault);
      console.log("Default address:", defaultAddress);

      if (!defaultAddress) {
        toast.warning(t("address.selectForOrder"));
        navigate("/profile", { state: { activeTab: "address" } });
        return;
      }

      // Show address confirmation
      setPendingOrderAddress(defaultAddress);
      setIsAddressConfirmOpen(true);
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to prepare order");
    }
  }, [currentUser, cartItems, t, navigate]);

  const handleAddressConfirm = useCallback(async () => {
    if (!pendingOrderAddress || !currentUser) return;

    try {
      const total = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );

      await createOrder({
        userId: currentUser.id,
        items: [...cartItems],
        total,
        status: "pending",
        deliveryAddress: pendingOrderAddress,
      });

      useCartStore.getState().clearCart();
      setIsAddressConfirmOpen(false);
      setPendingOrderAddress(null);
      toast.success(
        t("notifications.orderPlaced", {
          total: total.toLocaleString("fa-IR"),
        }),
      );

      // Reload orders
      if (currentUser) {
        try {
          const userOrders = await getUserOrders(currentUser.id);
          setOrders(userOrders);
        } catch (error) {
          console.error("Error reloading orders:", error);
        }
      }
    } catch (error) {
      console.error("Order placement error:", error);
      toast.error("Failed to place order");
    }
  }, [pendingOrderAddress, currentUser, cartItems, t]);

  const handleAddressChange = useCallback(() => {
    setIsAddressConfirmOpen(false);
    setPendingOrderAddress(null);
    navigate("/profile", { state: { activeTab: "address" } });
  }, [navigate]);

  const activeItem = activeId
    ? filteredItems.find((item) => item.id === activeId)
    : null;

  const CartPageComponent = useCallback(
    () => (
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
    ),
    [
      cartItems,
      removeFromCart,
      updateQuantity,
      handleCheckout,
      handleHomeClick,
      activeCategory,
      setActiveCategory,
    ],
  );

  const ProfilePageComponent = useCallback(
    () => (
      <div className="min-h-screen py-8 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {currentUser ? (
            <Profile
              user={currentUser}
              onUpdateProfile={async (updates) => {
                await updateUserProfile(currentUser.id, updates);
                setCurrentUser({ ...currentUser, ...updates });
              }}
              onChangePassword={async (_currentPassword, newPassword) => {
                try {
                  // Note: Firebase requires re-authentication for password change
                  // For simplicity, we'll just change the password
                  await changePassword(newPassword);
                  return true;
                } catch (error) {
                  console.error("Password change error:", error);
                  return false;
                }
              }}
              onRequestPasswordReset={async (email) => {
                try {
                  await resetPassword(email);
                  return true;
                } catch (error) {
                  console.error("Password reset error:", error);
                  return false;
                }
              }}
              onLogout={handleLogout}
              onBack={handleHomeClick}
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
                Please login to view your profile
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
    ),
    [currentUser, t, handleLogout, handleHomeClick, setIsAuthModalOpen],
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
        onMapClick={() => navigate("/map")}
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
        <Route path="/map" element={<MapPage />} />
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
        onAuthSuccess={handleAuthSuccess}
      />

      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        orders={orders.filter((order) => order.userId === currentUser?.id)}
      />

      {/* Address Confirmation Modal */}
      {isAddressConfirmOpen && pendingOrderAddress && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-surface dark:bg-surface-dark rounded-2xl p-6 w-full max-w-md m-4 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 font-vazir">
              {t("address.confirmDelivery")}
            </h3>
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                {t("address.deliveryTo")}:
              </p>
              <p className="text-gray-800 dark:text-white font-medium">
                {pendingOrderAddress.fullAddress}, {pendingOrderAddress.city}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleAddressChange}
                className="flex-1 px-4 py-2 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {t("address.change")}
              </button>
              <button
                onClick={handleAddressConfirm}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
              >
                {t("common.confirm")}
              </button>
            </div>
          </div>
        </div>
      )}

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
        onMapClick={() => navigate("/map")}
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
