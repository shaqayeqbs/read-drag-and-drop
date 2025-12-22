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
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const combinedStyle: React.CSSProperties = {
    ...style,
    touchAction: "none", // Critical for iOS - prevents browser scroll handling
    WebkitTouchCallout: "none" as const,
    WebkitUserSelect: "none" as const,
  };

  return (
    <div
      ref={setNodeRef}
      style={combinedStyle}
      {...attributes}
      {...listeners}
      className={`bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-200 cursor-grab active:cursor-grabbing ${
        isDragging
          ? "opacity-50 scale-105 shadow-2xl z-50"
          : "hover:shadow-xl hover:scale-102"
      }`}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover pointer-events-none"
          draggable={false}
        />
        <div className="absolute top-3 right-3 bg-primary text-white px-3 py-1 rounded-full font-bold text-sm shadow-lg">
          {item.price.toLocaleString("fa-IR")} تومان
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{item.name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {item.description}
        </p>

        <button
          onPointerDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
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
