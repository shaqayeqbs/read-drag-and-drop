import React from "react";
import { useTranslation } from "react-i18next";
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from "lucide-react";
import type { CartItem, FoodCategory } from "../types";
import { CategoryTabs } from "./CategoryTabs";

interface CartPageProps {
  items: CartItem[];
  onRemoveItem: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onCheckout: () => void;
  onBack: () => void;
  activeCategory?: FoodCategory | "all";
  onCategoryChange?: (category: FoodCategory | "all") => void;
}

export const CartPage: React.FC<CartPageProps> = ({
  items,
  onRemoveItem,
  onUpdateQuantity,
  onCheckout,
  onBack,
  activeCategory = "all",
  onCategoryChange,
}) => {
  const { t, i18n } = useTranslation();

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-vazir">{t("common.back")}</span>
          </button>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2 font-vazir">
            <ShoppingBag className="w-6 h-6 text-primary" />
            {t("cart.title")}
          </h1>
          <div className="w-16"></div> {/* Spacer for centering */}
        </div>
      </div>

      {/* Category Tabs */}
      {onCategoryChange && (
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4">
            <CategoryTabs
              activeCategory={activeCategory}
              onCategoryChange={onCategoryChange}
            />
          </div>
        </div>
      )}

      <div className="p-4">
        {items.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="w-24 h-24 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-400 dark:text-gray-500 text-lg font-vazir">
              {t("cart.empty")}
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-2 font-vazir">
              {t("cart.emptyDescription")}
            </p>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={i18n.language === "fa" ? item.name.fa : item.name.en}
                      className="w-16 h-16 rounded-lg object-cover"
                      draggable={false}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src =
                          "https://via.placeholder.com/300x200?text=No+Image";
                      }}
                    />
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800 dark:text-white font-vazir text-lg">
                        {i18n.language === "fa" ? item.name.fa : item.name.en}
                      </h4>
                      <p className="text-primary font-bold text-sm font-vazir">
                        {i18n.language === "fa"
                          ? item.price.toLocaleString("fa-IR")
                          : item.price.toLocaleString("en-US")}{" "}
                        {t("menu.toman")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg shadow p-1">
                      <button
                        onClick={() =>
                          onUpdateQuantity(item.id, item.quantity + 1)
                        }
                        className="w-10 h-10 bg-primary text-white rounded-lg font-bold hover:bg-opacity-80 active:scale-95 transition-all flex items-center justify-center"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center font-bold text-gray-800 dark:text-white font-vazir">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => {
                          if (item.quantity > 1) {
                            onUpdateQuantity(item.id, item.quantity - 1);
                          } else {
                            onRemoveItem(item.id);
                          }
                        }}
                        className="w-10 h-10 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-bold hover:bg-gray-300 dark:hover:bg-gray-500 active:scale-95 transition-all flex items-center justify-center"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all active:scale-95"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Total and Checkout */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg sticky bottom-4">
              <div className="flex justify-between items-center text-lg mb-4">
                <span className="text-gray-600 dark:text-gray-300 font-vazir">
                  {t("cart.total")}
                </span>
                <span className="font-bold text-2xl text-primary font-vazir">
                  {i18n.language === "fa"
                    ? total.toLocaleString("fa-IR")
                    : total.toLocaleString("en-US")}{" "}
                  {t("menu.toman")}
                </span>
              </div>

              <button
                onClick={onCheckout}
                className="w-full bg-gradient-to-r from-success to-green-600 text-white font-bold py-4 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 active:scale-95 font-vazir"
              >
                {t("cart.checkout")}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
