// src/services/productService.ts
import api from '../utils/axios';

export interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    category: 'coffee_beans' | 'brewing_equipment' | 'accessories' | 'gift_sets';
    roastLevel: 'light' | 'medium' | 'dark' | 'espresso';
    flavorProfile: string[];
    origin?: string;
    weight: number;
    inStock: boolean;
    stockQuantity: number;
    isFeatured: boolean;
    isActive: boolean;
    images: string[];
    searchKeywords: string[];
    createdAt: string;
    updatedAt: string;
}

export const productService = {
    // برای صفحه home - بخش offer
    getFeaturedProducts: async (limit: number = 8) => {
        const response = await api.get(`/home/offer?limit=${limit}`);
        return response.data;
    },

    // برای صفحه home - بخش menu
    getMenuProducts: async (params?: {
        page?: number;
        limit?: number;
        category?: string;
        roastLevel?: string;
    }) => {
        const response = await api.get('/home/menu', { params });
        return response.data;
    },

    // جستجو در منو
    searchProducts: async (query: string, params?: {
        page?: number;
        limit?: number;
        category?: string;
        roastLevel?: string;
    }) => {
        const response = await api.get('/home/menu/search', {
            params: { q: query, ...params }
        });
        return response.data;
    },

    // محصولات پرطرفدار
    getPopularProducts: async (limit: number = 6) => {
        const response = await api.get(`/home/menu/popular?limit=${limit}`);
        return response.data;
    },

    // دریافت تمام محصولات (برای ادمین)
    getAdminProducts: async (params?: {
        page?: number;
        limit?: number;
        isActive?: boolean;
        isFeatured?: boolean;
    }) => {
        const response = await api.get('/admin/products', { params });
        return response.data;
    },

    // ایجاد محصول جدید
    createProduct: async (productData: FormData) => {
        const response = await api.post('/admin/products', productData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    // به‌روزرسانی محصول
    updateProduct: async (id: string, productData: FormData) => {
        const response = await api.put(`/admin/products/${id}`, productData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    // حذف محصول
    deleteProduct: async (id: string) => {
        const response = await api.delete(`/admin/products/${id}`);
        return response.data;
    }
};