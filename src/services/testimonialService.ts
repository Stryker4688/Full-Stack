// src/services/testimonialService.ts
import api from '../utils/axios';

export interface Testimonial {
    _id: string;
    name: string;
    email: string;
    message: string;
    rating: number;
    isApproved: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export const testimonialService = {
    // دریافت نظرات تایید شده
    getApprovedTestimonials: async (params?: {
        page?: number;
        limit?: number;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    }) => {
        const response = await api.get('/testimonials/approved', { params });
        return response.data;
    },

    // ارسال نظر جدید
    createTestimonial: async (data: {
        name: string;
        email: string;
        message: string;
        rating: number;
    }) => {
        const response = await api.post('/testimonials', data);
        return response.data;
    },

    // آمار نظرات
    getStats: async () => {
        const response = await api.get('/testimonials/stats');
        return response.data;
    },

    // مدیریت ادمین - دریافت تمام نظرات
    getAllTestimonials: async (params?: {
        page?: number;
        limit?: number;
        isApproved?: boolean;
        isActive?: boolean;
    }) => {
        const response = await api.get('/admin/testimonials', { params });
        return response.data;
    },

    // تایید نظر
    approveTestimonial: async (id: string) => {
        const response = await api.patch(`/admin/testimonials/${id}/approve`);
        return response.data;
    },

    // رد نظر
    rejectTestimonial: async (id: string) => {
        const response = await api.patch(`/admin/testimonials/${id}/reject`);
        return response.data;
    },

    // حذف نظر
    deleteTestimonial: async (id: string) => {
        const response = await api.delete(`/admin/testimonials/${id}`);
        return response.data;
    }
};