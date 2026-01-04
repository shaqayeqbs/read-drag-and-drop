import React from "react";
import { useTranslation } from "react-i18next";
import {
  Pizza,
  Sandwich,
  Coffee,
  Salad,
  Wine,
  Cake,
  UtensilsCrossed,
} from "lucide-react";
import type { FoodCategory } from "../../../types/types";

interface CategoryTabsProps {
  activeCategory: FoodCategory | "all";
  onCategoryChange: (category: FoodCategory | "all") => void;
}

const categoryIcons: Record<FoodCategory, React.ReactNode> = {
  pizza: <Pizza className="w-5 h-5" />,
  burger: <Sandwich className="w-5 h-5" />,
  pasta: <UtensilsCrossed className="w-5 h-5" />,
  salad: <Salad className="w-5 h-5" />,
  drink: <Wine className="w-5 h-5" />,
  dessert: <Cake className="w-5 h-5" />,
  cafe: <Coffee className="w-5 h-5" />,
  sandwich: <Sandwich className="w-5 h-5" />,
};

const categories: Array<FoodCategory | "all"> = [
  "all",
  "pizza",
  "burger",
  "pasta",
  "salad",
  "drink",
  "dessert",
  "cafe",
  "sandwich",
];

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  activeCategory,
  onCategoryChange,
}) => {
  const { t } = useTranslation();

  return (
    <div className="mb-8">
      <div className="flex overflow-x-auto scrollbar-hide gap-2 pb-2">
        {categories.map((category) => {
          const isActive = activeCategory === category;

          return (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap
                transition-all duration-200 font-medium min-w-fit
                ${
                  isActive
                    ? "bg-primary text-white shadow-md"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-gray-800 dark:hover:text-white"
                }
              `}
            >
              {category !== "all" && categoryIcons[category as FoodCategory]}
              <span className="text-sm font-vazir">
                {t(`categories.${category}`)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
