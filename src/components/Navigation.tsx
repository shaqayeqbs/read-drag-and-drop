import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  LogIn,
  LogOut,
  User,
  Package,
  Menu,
  ShoppingBasket,
  X,
} from "lucide-react";
import { LanguageDropdown } from "./LanguageDropdown";
import { ThemeToggle } from "./ThemeToggle";

interface NavigationProps {
  isLoggedIn: boolean;
  userName?: string;
  onLoginClick: () => void;
  onLogout: () => void;
  onOrdersClick: () => void;
  onProfileClick?: () => void;
  cartItemCount?: number;
  onCartClick?: () => void;
  onMenuClick?: () => void;
  onHomeClick?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  isLoggedIn,
  userName,
  onLoginClick,
  onLogout,
  onOrdersClick,
  onProfileClick,
  cartItemCount = 0,
  onCartClick,
  onMenuClick,
  onHomeClick,
}) => {
  const { t } = useTranslation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <>
      <nav className="bg-white dark:bg-gray-800 p-2 md:p-3 shadow-md mb-6 border-b border-gray-200 dark:border-gray-700">
        <div className="w-full px-2 sm:px-4 py-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center">
              <h1
                className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent font-vazir cursor-pointer hover:opacity-80 transition-opacity"
                onClick={onHomeClick}
              >
                {t("app.title")}
              </h1>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Mobile Menu Button - Near cart button */}
              {/* Mobile Cart Button */}
              {onCartClick && (
                <button
                  onClick={onCartClick}
                  className="relative lg:hidden flex items-center px-2 py-1.5 rounded-lg bg-primary text-white hover:bg-secondary transition-colors font-vazir text-sm"
                >
                  <ShoppingBasket className="w-4 h-4" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                      {cartItemCount}
                    </span>
                  )}
                </button>
              )}{" "}
              {onMenuClick && (
                <button
                  onClick={toggleSidebar}
                  className="lg:hidden flex items-center px-2 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <Menu className="w-4 h-4" />
                </button>
              )}
              <div className="hidden sm:block">
                <ThemeToggle />
              </div>
              <div className="hidden sm:block">
                <LanguageDropdown />
              </div>
              {isLoggedIn ? (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={onOrdersClick}
                    className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-primary text-white hover:bg-secondary transition-colors font-vazir text-sm"
                  >
                    <Package className="w-4 h-4" />
                    <span className="hidden md:inline">{t("nav.orders")}</span>
                  </button>

                  <button
                    onClick={onProfileClick}
                    className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                  >
                    <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 font-vazir hidden md:inline">
                      {userName}
                    </span>
                  </button>

                  <button
                    onClick={onLogout}
                    className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors font-vazir text-sm"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden md:inline">{t("nav.logout")}</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={onLoginClick}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white hover:bg-secondary transition-colors font-vazir text-sm"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline">{t("nav.login")}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${
          isSidebarOpen ? "block" : "hidden"
        }`}
      >
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
          onClick={closeSidebar}
        />

        {/* Sidebar */}
        <div
          className={`fixed left-0 top-0 h-full w-80 max-w-[85vw] bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-bold text-gray-800 dark:text-white font-vazir">
                {t("app.title")}
              </h2>
              <div className="flex items-center gap-2">
                {isLoggedIn && (
                  <button
                    onClick={() => {
                      onLogout();
                      closeSidebar();
                    }}
                    className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-600 dark:text-red-400"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={closeSidebar}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Theme Toggle */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 font-vazir">
                  {t("nav.theme")}
                </span>
                <ThemeToggle />
              </div>

              {/* Language Selector */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 font-vazir">
                  {t("nav.language")}
                </span>
                <LanguageDropdown />
              </div>

              {/* User Actions */}
              {isLoggedIn ? (
                <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 font-vazir">
                      {userName}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      onOrdersClick();
                      closeSidebar();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                  >
                    <Package className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 font-vazir">
                      {t("nav.orders")}
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      onProfileClick?.();
                      closeSidebar();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                  >
                    <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 font-vazir">
                      {t("nav.profile")}
                    </span>
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => {
                      onLoginClick();
                      closeSidebar();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-lg bg-primary text-white hover:bg-secondary transition-colors"
                  >
                    <LogIn className="w-5 h-5" />
                    <span className="text-sm font-medium font-vazir">
                      {t("nav.login")}
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
