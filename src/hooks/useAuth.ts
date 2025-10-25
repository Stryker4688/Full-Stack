// src/hooks/useAuth.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../utils/axios';
import { LoginFormData, RegisterFormData } from '../schemas/auth.schema';

export const useLogin = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (credentials: LoginFormData) => {
            const response = await api.post('/auth/login', credentials);
            return response.data;
        },
        onSuccess: (data) => {
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            queryClient.setQueryData(['user'], data.user);
        },
    });
};

export const useRegister = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (userData: RegisterFormData) => {
            const response = await api.post('/auth/register', userData);
            return response.data;
        },
        onSuccess: (data) => {
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            queryClient.setQueryData(['user'], data.user);
        },
    });
};

export const useUser = () => {
    return useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            const response = await api.get('/auth/verify');
            return response.data;
        },
        enabled: !!localStorage.getItem('authToken'),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useLogout = () => {
    const queryClient = useQueryClient();

    return () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        queryClient.clear();
    };
};