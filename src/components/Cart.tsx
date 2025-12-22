import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { toast } from "react-toastify";
import type { CartItem } from "../types";

interface CartProps {
  items: CartItem[];
  onRemoveItem: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

export const Cart: React.FC<CartProps> = ({
  items,
  onRemoveItem,
  onUpdateQuantity,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: "cart-droppable",
  });

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div
      ref={setNodeRef}
      className={`bg-white rounded-3xl shadow-2xl p-6 sticky top-6 transition-all duration-300 prevent-scroll select-none touch-callout-none ${
        isOver ? "ring-4 ring-primary ring-opacity-50 scale-105" : ""
      }`}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <svg
            className="w-8 h-8 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          سبد خرید
        </h2>
        <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-bold">
          {items.reduce((sum, item) => sum + item.quantity, 0)} مورد
        </span>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <svg
            className="w-24 h-24 mx-auto text-gray-300 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          <p className="text-gray-400 text-lg">سبد خرید خالی است</p>
          <p className="text-gray-400 text-sm mt-2">
            محصولات را بکشید و اینجا رها کنید
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4 max-h-96 overflow-y-auto mb-6 pr-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-gradient-to-r from-orange-50 to-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all touch-manipulation"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover"
                    draggable={false}
                  />
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800">{item.name}</h4>
                    <p className="text-primary font-bold text-sm">
                      {item.price.toLocaleString("fa-IR")} تومان
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2 bg-white rounded-lg shadow p-1">
                    <button
                      onClick={() =>
                        onUpdateQuantity(item.id, item.quantity + 1)
                      }
                      className="w-8 h-8 bg-primary text-white rounded-lg font-bold hover:bg-opacity-80 active:scale-95 transition-all"
                    >
                      +
                    </button>
                    <span className="w-8 text-center font-bold text-gray-800">
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
                      className="w-8 h-8 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 active:scale-95 transition-all"
                    >
                      −
                    </button>
                  </div>

                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-all active:scale-95"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 space-y-3">
            <div className="flex justify-between items-center text-lg">
              <span className="text-gray-600">جمع کل:</span>
              <span className="font-bold text-2xl text-primary">
                {total.toLocaleString("fa-IR")} تومان
              </span>
            </div>

            <button
              onClick={() => {
                if (items.length === 0) {
                  toast.warning("سبد خرید خالی است!");
                  return;
                }
                toast.success(
                  `سفارش شما با مبلغ ${total.toLocaleString(
                    "fa-IR"
                  )} تومان ثبت شد!`
                );
              }}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-4 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 active:scale-95"
            >
              تکمیل سفارش
            </button>
          </div>
        </>
      )}
    </div>
  );
};
