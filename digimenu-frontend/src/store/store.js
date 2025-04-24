import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import categoryReducer from './categorySlice';
import productReducer from './productSlice';

export const store = configureStore({
    reducer: {
        cart: cartReducer,
        category: categoryReducer,
        product: productReducer,
    }
});