import React from "react";
import { useTranslation } from "react-i18next";
import { X, Home, Package, User, ShoppingBag, Map } from "lucide-react";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
  userName?: string;
  onLoginClick: () => void;
  onLogout: () => void;
  onOrdersClick: () => void;
  onProfileClick: () => void;
  onHomeClick: () => void;
  onCartClick: () => void;
  cartItemCount: number;
  onMapClick: () => void;
}

export const MobileSidebar: React.FC<MobileSidebarProps> = ({
  isOpen,
  onClose,
  isLoggedIn,
  userName,
  onLoginClick,
  onLogout,
  onOrdersClick,
  onProfileClick,
  onHomeClick,
  onCartClick,
  cartItemCount,
  onMapClick,
}) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-[10000] lg:hidden"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-xl z-[10001] transform transition-transform duration-300 lg:hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white font-vazir">
            {t("app.title")}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 space-y-2">
          {/* Home */}
          <button
            onClick={() => {
              onHomeClick();
              onClose();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Home className="w-5 h-5" />
            <span className="font-vazir">{t("nav.home")}</span>
          </button>

          {/* Map */}
          <button
            onClick={() => {
              onMapClick();
              onClose();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Map className="w-5 h-5" />
            <span className="font-vazir">{t("nav.map")}</span>
          </button>

          {/* Cart */}
          <button
            onClick={() => {
              onCartClick();
              onClose();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartItemCount}
                </span>
              )}
            </div>
            <span className="font-vazir">{t("cart.title")}</span>
          </button>

          {/* Orders */}
          {isLoggedIn && (
            <button
              onClick={() => {
                onOrdersClick();
                onClose();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Package className="w-5 h-5" />
              <span className="font-vazir">{t("orders.title")}</span>
            </button>
          )}

          {/* Profile */}
          {isLoggedIn && (
            <button
              onClick={() => {
                onProfileClick();
                onClose();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <User className="w-5 h-5" />
              <span className="font-vazir">{t("nav.profile")}</span>
            </button>
          )}

          {/* Auth */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-4">
            {isLoggedIn ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-4 py-2">
                  <User className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300 font-vazir">
                    {userName}
                  </span>
                </div>
                <button
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <span className="font-vazir">{t("auth.logout")}</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onLoginClick();
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-left bg-primary text-white hover:bg-secondary rounded-lg transition-colors"
              >
                <span className="font-vazir">{t("auth.login")}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
