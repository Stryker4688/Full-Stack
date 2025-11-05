// src/types/index.ts - COMPLETELY FIXED
export interface User {
    id: string;
    _id?: string; // اضافه شد برای بکند
    email: string;
    name: string;
    role: 'user' | 'admin' | 'super_admin'; // اصلاح شد
    authProvider?: 'local' | 'google';
    emailVerified: boolean;
    isActive?: boolean; // از بکند
    lastLogin?: Date;
}

export interface CoffeeBean {
    id: string; // 🔴 تغییر از number به string
    _id?: string; // اضافه شد برای بکند
    name: string;
    origin: string;
    roast: "light" | "medium" | "dark" | "espresso"; // اصلاح شد
    price: number;
    weight: number;
    description: string;
    flavorNotes: string[];
    flavorProfile?: string[]; // از بکند
    acidity: "low" | "medium" | "high";
    body: "light" | "medium" | "full";
    processing: "washed" | "natural" | "honey";
    elevation: number;
    image: string;
    images?: string[]; // از بکند
    rating: number;
    stock: number;
    stockQuantity?: number; // از بکند
    inStock?: boolean; // از بکند
    featured: boolean;
    isFeatured?: boolean; // از بکند
    isActive?: boolean; // از بکند
    score: number;
    brewMethods: string[];
    harvest: string;
    varietal: string;
    category?: 'coffee_beans' | 'brewing_equipment' | 'accessories' | 'gift_sets'; // از بکند
    searchKeywords?: string[]; // از بکند
}

export interface CartItem {
    id: string; // 🔴 تغییر از number به string
    name: string;
    price: number;
    quantity: number;
    image: string;
    weight?: number;
}

export interface Testimonial {
    id: string; // 🔴 تغییر از number به string
    _id?: string; // اضافه شد برای بکند
    name: string;
    email: string;
    message: string;
    text?: string; // برای تطابق با فرانت
    rating: number;
    isApproved?: boolean; // از بکند
    isActive?: boolean; // از بکند
    verified?: boolean; // برای فرانت
    featured?: boolean; // برای فرانت
    location?: string; // برای فرانت
    img?: string; // برای فرانت
    date?: string; // برای فرانت
    createdAt?: Date; // از بکند
}