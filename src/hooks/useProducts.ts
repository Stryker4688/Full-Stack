// src/hooks/useProducts.ts - FIXED
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService, Product } from '../services/productService';
import { productAdapter, testimonialAdapter } from '../utils/productAdapter';

export const useProducts = {
    // محصولات ویژه (صفحه offer)
    useFeaturedProducts: (limit: number = 8) => {
        return useQuery({
            queryKey: ['products', 'featured', limit],
            queryFn: async () => {
                const data = await productService.getFeaturedProducts(limit);
                return {
                    ...data,
                    products: data.products?.map(productAdapter.toFrontend) || []
                };
            },
        });
    },

    // محصولات منو
    useMenuProducts: (params?: {
        page?: number;
        limit?: number;
        category?: string;
        roastLevel?: string;
    }) => {
        return useQuery({
            queryKey: ['products', 'menu', params],
            queryFn: async () => {
                const data = await productService.getMenuProducts(params);
                return {
                    ...data,
                    regularProducts: data.regularProducts?.map(productAdapter.toFrontend) || []
                };
            },
        });
    },

    // بقیه هوک‌ها بدون تغییر...
    useSearchProducts: (query: string, params?: any) => {
        return useQuery({
            queryKey: ['products', 'search', query, params],
            queryFn: async () => {
                const data = await productService.searchProducts(query, params);
                return {
                    ...data,
                    products: data.products?.map(productAdapter.toFrontend) || []
                };
            },
            enabled: !!query,
        });
    },

    usePopularProducts: (limit: number = 6) => {
        return useQuery({
            queryKey: ['products', 'popular', limit],
            queryFn: async () => {
                const data = await productService.getPopularProducts(limit);
                return {
                    ...data,
                    products: data.products?.map(productAdapter.toFrontend) || []
                };
            },
        });
    },

    // بقیه هوک‌ها بدون تغییر...
    useAdminProducts: (params?: any) => {
        return useQuery({
            queryKey: ['products', 'admin', params],
            queryFn: () => productService.getAdminProducts(params),
        });
    },

    useCreateProduct: () => {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: productService.createProduct,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['products'] });
            },
        });
    },

    useUpdateProduct: () => {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: ({ id, data }: { id: string; data: FormData }) =>
                productService.updateProduct(id, data),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['products'] });
            },
        });
    },

    useDeleteProduct: () => {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: productService.deleteProduct,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['products'] });
            },
        });
    }
};