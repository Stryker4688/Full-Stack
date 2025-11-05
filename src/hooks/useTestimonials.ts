// src/hooks/useTestimonials.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { testimonialService, Testimonial } from '../services/testimonialService';

export const useTestimonials = {
    // نظرات تایید شده
    useApprovedTestimonials: (params?: any) => {
        return useQuery({
            queryKey: ['testimonials', 'approved', params],
            queryFn: () => testimonialService.getApprovedTestimonials(params),
        });
    },

    // ارسال نظر جدید
    useCreateTestimonial: () => {
        const queryClient = useQueryClient();

        return useMutation({
            mutationFn: testimonialService.createTestimonial,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['testimonials'] });
            },
        });
    },

    // آمار نظرات
    useTestimonialStats: () => {
        return useQuery({
            queryKey: ['testimonials', 'stats'],
            queryFn: testimonialService.getStats,
        });
    },

    // مدیریت ادمین - تمام نظرات
    useAllTestimonials: (params?: any) => {
        return useQuery({
            queryKey: ['testimonials', 'admin', params],
            queryFn: () => testimonialService.getAllTestimonials(params),
        });
    },

    // تایید نظر
    useApproveTestimonial: () => {
        const queryClient = useQueryClient();

        return useMutation({
            mutationFn: testimonialService.approveTestimonial,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['testimonials'] });
            },
        });
    },

    // رد نظر
    useRejectTestimonial: () => {
        const queryClient = useQueryClient();

        return useMutation({
            mutationFn: testimonialService.rejectTestimonial,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['testimonials'] });
            },
        });
    },

    // حذف نظر
    useDeleteTestimonial: () => {
        const queryClient = useQueryClient();

        return useMutation({
            mutationFn: testimonialService.deleteTestimonial,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['testimonials'] });
            },
        });
    }
};