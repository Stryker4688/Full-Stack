// utils/helpers.ts
export const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (password.length < 6) errors.push("At least 6 characters");
    if (!/(?=.*[a-z])/.test(password)) errors.push("One lowercase letter");
    if (!/(?=.*[A-Z])/.test(password)) errors.push("One uppercase letter");
    if (!/(?=.*\d)/.test(password)) errors.push("One number");

    return { isValid: errors.length === 0, errors };
};

export const formatPrice = (price: number): string => {
    return `$${price.toFixed(2)}`;
};

export const getStockStatus = (stock: number, popularity: string) => {
    if (stock === 0) return { status: "Out of Stock", color: "red" };
    if (stock < 5) return { status: "Very Low", color: "red" };
    if (stock < 10 && popularity === "high") return { status: "Low Stock", color: "orange" };
    if (stock < 15) return { status: "Selling Fast", color: "yellow" };
    return { status: "In Stock", color: "green" };
};