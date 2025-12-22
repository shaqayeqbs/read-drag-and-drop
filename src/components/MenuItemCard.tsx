import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { MenuItem } from "../types";

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  onAddToCart,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    setActivatorNodeRef,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-200 touch-manipulation ${
        isDragging
          ? "opacity-50 scale-105 shadow-2xl z-50"
          : "hover:shadow-xl hover:scale-102"
      }`}
    >
      <div
        ref={setActivatorNodeRef}
        {...listeners}
        className="cursor-grab active:cursor-grabbing"
      >
        <div className="relative h-48 overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
            draggable={false}
          />
          <div className="absolute top-3 right-3 bg-primary text-white px-3 py-1 rounded-full font-bold text-sm shadow-lg">
            {item.price.toLocaleString("fa-IR")} تومان
          </div>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{item.name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {item.description}
        </p>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(item);
          }}
          className="w-full bg-gradient-to-r from-primary to-accent text-white font-bold py-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 active:scale-95 cursor-pointer"
        >
          افزودن به سبد
        </button>
      </div>
    </div>
  );
};
