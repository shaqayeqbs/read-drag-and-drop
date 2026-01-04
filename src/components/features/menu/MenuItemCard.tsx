import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useTranslation } from "react-i18next";
import type { MenuItem } from "../../../types/types";

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  onAddToCart,
}) => {
  const { t, i18n } = useTranslation();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

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
    WebkitUserSelect: "none" as const,
    userSelect: "none" as const,
  };

  const getCategoryPlaceholder = (category: string) => {
    const placeholders = {
      pizza: "🍕",
      burger: "🍔",
      pasta: "🍝",
      salad: "🥗",
      drink: "🥤",
      dessert: "🍰",
      cafe: "☕",
      sandwich: "🥪",
    };
    return placeholders[category as keyof typeof placeholders] || "🍽️";
  };

  const getFallbackImage = (category: string) => {
    const fallbacks = {
      pizza:
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&h=200&fit=crop",
      burger:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop",
      pasta:
        "https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=300&h=200&fit=crop",
      salad:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop",
      drink:
        "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=300&h=200&fit=crop",
      dessert:
        "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=300&h=200&fit=crop",
      cafe: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&h=200&fit=crop",
      sandwich:
        "https://images.unsplash.com/photo-1481070414801-51fd732d7184?w=300&h=200&fit=crop",
    };
    return (
      fallbacks[category as keyof typeof fallbacks] ||
      "https://via.placeholder.com/300x200?text=No+Image"
    );
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={combinedStyle}
      {...attributes}
      {...listeners}
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition-all duration-200 cursor-grab active:cursor-grabbing w-full max-w-sm mx-auto ${
        isDragging
          ? "opacity-50 scale-105 shadow-2xl z-50"
          : "hover:shadow-xl hover:scale-[1.02]"
      }`}
    >
      <div className="relative aspect-auto overflow-hidden  ">
        {item.image && !imageError ? (
          <>
            <img
              src={item.image}
              alt={i18n.language === "fa" ? item.name.fa : item.name.en}
              className={`w-full h-[300px]  pointer-events-none transition-opacity duration-300 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              draggable={false}
              onLoad={handleImageLoad}
              onError={(e) => {
                // Try fallback image first
                const target = e.target as HTMLImageElement;
                if (target && target.src !== getFallbackImage(item.category)) {
                  target.src = getFallbackImage(item.category);
                } else {
                  handleImageError();
                }
              }}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-600">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-600">
            <div className="text-center">
              <div className="text-4xl mb-2">
                {getCategoryPlaceholder(item.category)}
              </div>
              <span className="text-gray-500 dark:text-gray-400 text-sm font-vazir">
                {t("menu.noImage")}
              </span>
            </div>
          </div>
        )}
        <div className="absolute top-3 right-3 bg-primary text-white px-3 py-1 rounded-full font-bold text-sm shadow-lg font-vazir">
          {i18n.language === "fa"
            ? item.price.toLocaleString("fa-IR")
            : item.price.toLocaleString("en-US")}{" "}
          {t("menu.toman")}
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2 font-vazir">
          {i18n.language === "fa" ? item.name.fa : item.name.en}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2 font-vazir">
          {i18n.language === "fa" ? item.description.fa : item.description.en}
        </p>

        <button
          onPointerDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(item);
          }}
          className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 active:scale-95 cursor-pointer font-vazir"
        >
          {t("menu.addToCart")}
        </button>
      </div>
    </div>
  );
};
