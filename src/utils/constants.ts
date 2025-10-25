// utils/constants.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

export const COFFEE_ROASTS = ['light', 'medium', 'medium-dark', 'dark', 'espresso'] as const;

export const PROCESSING_METHODS = ['washed', 'natural', 'honey'] as const;

export const TASTE_PROFILES = [
    {
        value: "fruity-bright",
        label: "Fruity & Bright",
        description: "Light roasts with citrus, berry, and floral notes",
        icon: "🍋",
        bestFor: "Pour Over, Aeropress, Cold Brew"
    },
    {
        value: "chocolate-nutty",
        label: "Chocolate & Nutty",
        description: "Medium roasts with chocolate, caramel, and nut flavors",
        icon: "🍫",
        bestFor: "Espresso, Drip, French Press"
    },
    {
        value: "earthy-spicy",
        label: "Earthy & Spicy",
        description: "Dark roasts with earthy, spicy, and bold flavors",
        icon: "🌰",
        bestFor: "French Press, Moka Pot, Cold Brew"
    }
];