import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { useTranslation } from "react-i18next";
import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import type { CartItem } from "../../../types/types";

interface CartProps {
  items: CartItem[];
  onRemoveItem: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onCheckout: () => void;
}

export const Cart: React.FC<CartProps> = ({
  items,
  onRemoveItem,
  onUpdateQuantity,
  onCheckout,
}) => {
  const { t, i18n } = useTranslation();
  const { setNodeRef, isOver } = useDroppable({
    id: "cart-droppable",
  });

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div
      ref={setNodeRef}
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 sticky top-6 transition-all duration-300 prevent-scroll select-none touch-callout-none ${
        isOver ? "ring-4 ring-primary ring-opacity-50 scale-105" : ""
      }`}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2 font-vazir">
          <ShoppingCart className="w-8 h-8 text-primary" />
          {t("cart.title")}
        </h2>
        <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-bold font-vazir">
          {totalItems} {t("cart.items")}
        </span>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingCart className="w-24 h-24 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <p className="text-gray-400 dark:text-gray-500 text-lg font-vazir">
            {t("cart.empty")}
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-2 font-vazir">
            {t("cart.emptyDescription")}
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4 max-h-96 overflow-y-auto mb-6 pr-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-gradient-to-r from-blue-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-xl p-4 shadow-md hover:shadow-lg transition-all touch-manipulation"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={i18n.language === "fa" ? item.name.fa : item.name.en}
                    className="w-14 h-14 rounded-lg object-cover"
                    draggable={false}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src =
                        "https://via.placeholder.com/300x200?text=No+Image";
                    }}
                  />
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800 dark:text-white font-vazir">
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
                  <div className="flex items-center gap-2 bg-white dark:bg-gray-600 rounded-lg shadow p-1">
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
                      className="w-8 h-8 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 active:scale-95 transition-all flex items-center justify-center"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-all active:scale-95"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 space-y-3">
            <div className="flex justify-between items-center text-lg">
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
  );
};
