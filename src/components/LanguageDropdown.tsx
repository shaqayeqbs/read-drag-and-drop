import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

interface LanguageDropdownProps {
  className?: string;
}

export const LanguageDropdown: React.FC<LanguageDropdownProps> = ({
  className = "",
}) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: "fa", name: "فارسی", flag: "🇮🇷" },
    { code: "en", name: "English", flag: "🇺🇸" },
  ];

  const currentLanguage =
    languages.find((lang) => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-surface hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-vazir"
      >
        <span className="text-base">{currentLanguage.flag}</span>
        <span className="text-sm font-medium">
          {currentLanguage.code.toUpperCase()}
        </span>
        <ChevronDownIcon
          className={`w-3.5 h-3.5 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-vazir ${
                  i18n.language === language.code
                    ? "bg-primary text-white hover:bg-primary-dark"
                    : ""
                }`}
              >
                <span>{language.flag}</span>
                <span>{language.name}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
