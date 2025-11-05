// src/utils/productAdapter.ts - FIXED
import { CoffeeBean } from '../types';

export const productAdapter = {
    toFrontend: (backendProduct: any): CoffeeBean => ({
        // تبدیل _id به id برای فرانت‌اند
        id: backendProduct._id?.toString() || backendProduct.id,
        _id: backendProduct._id?.toString(),

        // اطلاعات اصلی
        name: backendProduct.name,
        description: backendProduct.description,
        price: backendProduct.price,
        // 🔴 originalPrice حذف شد چون در تایپ CoffeeBean وجود ندارد

        // دسته‌بندی و نوع
        category: backendProduct.category,
        roast: backendProduct.roastLevel,

        // طعم و مزه
        flavorNotes: backendProduct.flavorProfile || [],
        flavorProfile: backendProduct.flavorProfile,
        acidity: "medium", // مقدار پیش‌فرض
        body: "medium", // مقدار پیش‌فرض
        processing: "washed", // مقدار پیش‌فرض

        // منشأ و مشخصات فنی
        origin: backendProduct.origin || 'Unknown',
        weight: backendProduct.weight,
        elevation: 1500, // مقدار پیش‌فرض
        harvest: "2024", // مقدار پیش‌فرض
        varietal: "Arabica", // مقدار پیش‌فرض

        // تصاویر
        image: backendProduct.images?.[0] || '/assets/coffee-placeholder.jpg',
        images: backendProduct.images,

        // موجودی و وضعیت
        stock: backendProduct.stockQuantity || 0,
        stockQuantity: backendProduct.stockQuantity,
        inStock: backendProduct.inStock,

        // ویژگی‌های خاص
        featured: backendProduct.isFeatured || false,
        isFeatured: backendProduct.isFeatured,
        isActive: backendProduct.isActive,

        // امتیاز و رتبه
        rating: 4.5, // مقدار پیش‌فرض
        score: backendProduct.score || 85,

        // روش‌های دم کردن
        brewMethods: backendProduct.brewMethods || ["Pour Over", "French Press", "Espresso"],

        // کلمات کلیدی جستجو
        searchKeywords: backendProduct.searchKeywords
    })
};

export const testimonialAdapter = {
    toFrontend: (backendTestimonial: any) => ({
        id: backendTestimonial._id?.toString(),
        _id: backendTestimonial._id?.toString(),
        name: backendTestimonial.name,
        email: backendTestimonial.email,
        text: backendTestimonial.message, // تبدیل message به text برای فرانت
        message: backendTestimonial.message,
        rating: backendTestimonial.rating,
        verified: backendTestimonial.isApproved, // تبدیل isApproved به verified
        isApproved: backendTestimonial.isApproved,
        featured: false, // مقدار پیش‌فرض
        location: '', // مقدار پیش‌فرض
        img: '/assets/user-placeholder.jpg', // مقدار پیش‌فرض
        date: backendTestimonial.createdAt?.toISOString() || new Date().toISOString(),
        createdAt: backendTestimonial.createdAt
    })
};