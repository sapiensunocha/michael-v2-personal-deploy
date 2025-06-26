"use client";

import { usePathname } from "next/navigation";
import Translation from "..";

export default function TranslationWrapper() {
  const pathname = usePathname();

  // Hide the translation if the current route is "/map"
  if (pathname === "/map") {
    return null;
  }

  return (
    <div className="fixed md:bottom-8 ms:bottom-[10%] lg:right-6 bottom-[12%] -right-8">
      <Translation />
    </div>
  );
}