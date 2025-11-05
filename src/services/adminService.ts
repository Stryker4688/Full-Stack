// src/services/adminService.ts
import api from '../utils/axios';

export interface Admin {
    _id: string;
    name: string;
    email: string;
    role: 'admin' | 'super_admin';
    isActive: boolean;
    createdAt: string;
}

export const adminService = {
    // ایجاد ادمین جدید
    createAdmin: async (data: {
        name: string;
        email: string;
        password: string;
    }) => {
        const response = await api.post('/admin/admins', data);
        return response.data;
    },

    // دریافت لیست ادمین‌ها
    getAdmins: async (params?: {
        page?: number;
        limit?: number;
    }) => {
        const response = await api.get('/admin/admins', { params });
        return response.data;
    },

    // حذف ادمین
    deleteAdmin: async (id: string) => {
        const response = await api.delete(`/admin/admins/${id}`);
        return response.data;
    },

    // تغییر وضعیت ادمین
    toggleAdminStatus: async (id: string) => {
        const response = await api.patch(`/admin/admins/${id}/status`);
        return response.data;
    }
};