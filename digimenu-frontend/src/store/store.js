import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import categoryReducer from './categorySlice';

export const store = configureStore({
    reducer: {
        cart: cartReducer,
        category: categoryReducer,
    }
});