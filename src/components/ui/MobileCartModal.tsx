import React from "react";
import { useTranslation } from "react-i18next";
import { X, ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import type { CartItem } from "../../types/types";

interface MobileCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemoveItem: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onCheckout: () => void;
}

export const MobileCartModal: React.FC<MobileCartModalProps> = ({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onUpdateQuantity,
  onCheckout,
}) => {
  const { t, i18n } = useTranslation();

  if (!isOpen) return null;

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-[10000] flex items-end"
      style={{ isolation: "isolate" }}
    >
      <div
        className="bg-background w-full max-h-[80vh] rounded-t-3xl shadow-2xl overflow-hidden relative z-[10001]"
        style={{ isolation: "isolate", WebkitTransform: "translate3d(0,0,0)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-primary" />
            <span className="font-bold text-lg font-vazir">
              {t("cart.title")}
            </span>
            <span className="bg-primary text-white px-2 py-1 rounded-full text-xs font-bold">
              {totalItems}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 max-h-[50vh]">
          {items.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 font-vazir">{t("cart.empty")}</p>
              <p className="text-gray-400 text-sm mt-2 font-vazir">
                {t("cart.emptyDescription")}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-surface rounded-xl p-3 shadow-sm border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={i18n.language === "fa" ? item.name.fa : item.name.en}
                      className="w-12 h-12 rounded-lg object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src =
                          "https://via.placeholder.com/300x200?text=No+Image";
                      }}
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm font-vazir">
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

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg shadow p-1">
                      <button
                        onClick={() =>
                          onUpdateQuantity(item.id, item.quantity + 1)
                        }
                        className="w-8 h-8 bg-primary text-white rounded-lg font-bold hover:bg-opacity-80 active:scale-95 transition-all flex items-center justify-center"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-bold text-gray-800 dark:text-white font-vazir">
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
                        className="w-8 h-8 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-bold hover:bg-gray-300 dark:hover:bg-gray-500 active:scale-95 transition-all flex items-center justify-center"
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
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400 font-vazir">
                {t("cart.total")}
              </span>
              <span className="font-bold text-xl text-primary font-vazir">
                {i18n.language === "fa"
                  ? total.toLocaleString("fa-IR")
                  : total.toLocaleString("en-US")}{" "}
                {t("menu.toman")}
              </span>
            </div>

            <button
              onClick={() => {
                onCheckout();
                onClose();
              }}
              className="w-full bg-gradient-to-r from-success to-green-600 text-white font-bold py-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 active:scale-95 font-vazir"
            >
              {t("cart.checkout")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
