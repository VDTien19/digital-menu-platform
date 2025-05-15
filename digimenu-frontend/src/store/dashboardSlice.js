import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const dashboardApi = createApi({
    reducerPath: 'dashboardApi',
    baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL }),
    endpoints: (builder) => ({
        getRevenue: builder.query({
            query: ({ from, to }) => `/stats/revenue?from=${from}&to=${to}`,
        }),
        getTopProducts: builder.query({
            query: () => `/topProducts`,
        })
    }),
});

export const { useGetRevenueQuery, useGetTopProductsQuery } = dashboardApi;