// src/types/index.ts
export interface User {
    id: string;
    email: string;
    name: string;
    role: 'user' | 'admin';
}

export interface CoffeeBean {
    id: number;
    name: string;
    origin: string;
    roast: "light" | "medium" | "medium-dark" | "dark" | "espresso";
    price: number;
    weight: number;
    description: string;
    flavorNotes: string[];
    acidity: "low" | "medium" | "high";
    body: "light" | "medium" | "full";
    processing: "washed" | "natural" | "honey";
    elevation: number;
    image: string;
    rating: number;
    stock: number;
    featured: boolean;
    score: number;
    brewMethods: string[];
    harvest: string;
    varietal: string;
}

export interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
    weight?: number;
}