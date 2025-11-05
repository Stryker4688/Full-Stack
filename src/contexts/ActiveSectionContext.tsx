// src/contexts/ActiveSectionContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Section = "home" | "offer" | "menu" | "about" | "testimonial" | "contact";

interface ActiveSectionContextType {
  activeSection: Section;
  setActiveSection: (section: Section) => void;
  scrollToSection: (sectionId: string) => void;
}

const ActiveSectionContext = createContext<
  ActiveSectionContextType | undefined
>(undefined);

export const ActiveSectionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [activeSection, setActiveSection] = useState<Section>("home");

  // تابع برای اسکرول به بخش مورد نظر
  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(sectionId);
    if (element) {
      const elementPosition =
        element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - 80;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      // آپدیت URL و state
      const sectionName = sectionId.replace("#", "") as Section;
      setActiveSection(sectionName);
      window.history.pushState(null, "", sectionId);
    }
  };

  // تشخیص خودکار بخش فعال هنگام اسکرول
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        "home",
        "offer",
        "menu",
        "about",
        "testimonial",
        "contact",
      ];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;

          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section as Section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const value: ActiveSectionContextType = {
    activeSection,
    setActiveSection,
    scrollToSection,
  };

  return (
    <ActiveSectionContext.Provider value={value}>
      {children}
    </ActiveSectionContext.Provider>
  );
};

export const useActiveSection = () => {
  const context = useContext(ActiveSectionContext);
  if (context === undefined) {
    throw new Error(
      "useActiveSection must be used within an ActiveSectionProvider"
    );
  }
  return context;
};
