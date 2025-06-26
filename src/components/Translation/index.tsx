"use client";

import { useEffect, useState } from "react";
// import Select from "react-select";
import { getCookie, hasCookie, setCookie } from "cookies-next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: {
      translate: {
        TranslateElement: new (options: object, elementId: string) => void;
      };
    };
  }
}

export default function Translation() {
  const languages = [
    { label: "🇬🇧 English", value: "/auto/en" },
    { label: "🇫🇷 Français", value: "/auto/fr" },
    { label: "🇷🇺 Русский", value: "/auto/ru" },
    { label: "🇵🇱 Polski", value: "/auto/pl" },
    { label: "🇪🇸 Español", value: "/auto/es" },
    { label: "🇨🇳 中文", value: "/auto/zh" },
    { label: "🇸🇦 العربية", value: "/auto/ar" },
    { label: "🇮🇳 हिंदी", value: "/auto/hi" },
    { label: "🇧🇷 Português", value: "/auto/pt" },
    { label: "🇩🇪 Deutsch", value: "/auto/de" },
    { label: "🇯🇵 日本語", value: "/auto/ja" },
    { label: "🇰🇪 Swahili", value: "/auto/sw" },
  ];

  const [selected, setSelected] = useState(() => {
    return hasCookie("googtrans") ? getCookie("googtrans") : "/auto/en";
  });

  const [isHovered, setIsHovered] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "auto",
          includedLanguages: "en,fr,ru,pl,es,zh,ar,hi,pt,de,ja,sw",
          autoDisplay: false,
        },
        "google_translate_element",
      );
    };

    window.googleTranslateElementInit = googleTranslateElementInit;

    const script = document.createElement("script");
    script.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleLanguageChange = (selectedOption: any) => {
    const newLang = selectedOption.value;
    setSelected(newLang);
    setCookie("googtrans", newLang, { path: "/" });

    const googleFrame = document.querySelector(
      ".goog-te-combo",
    ) as HTMLSelectElement;
    if (googleFrame) {
      googleFrame.value = newLang;
      googleFrame.dispatchEvent(new Event("change"));
    }

    window.location.reload();
  };

  return (
    <>
      <div
        className="notranslate block w-[7rem] transition-all duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Select
          onValueChange={(newLang) => handleLanguageChange({ value: newLang })}
        >
          <SelectTrigger className="border border-red-700 p-1 backdrop-blur-sm bg-red-700/5 opacity-40 hover:opacity-100 hover:bg-red-700/30 transition-opacity duration-300 w-fit">
            <SelectValue
              placeholder={languages
                .find((lang) => lang.value === selected)
                ?.label.substring(0, 7)
                .toLocaleUpperCase()}
            ></SelectValue>
          </SelectTrigger>
          <SelectContent className="!w-20">
            {languages.map((lang) => (
              <SelectItem key={lang.value} value={lang.value}>
                {lang.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <style jsx global>{`
        .goog-te-banner-frame.skiptranslate {
          display: none !important;
        }
        body {
          top: 0 !important;
        }
      `}</style>
    </>
  );
}
