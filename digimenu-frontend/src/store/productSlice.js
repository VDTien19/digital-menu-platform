import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as httpRequest from '~/utils/httpRequest';

export const fetchProducts = createAsyncThunk(
    'product/fetchProducts', 
    async () => {
        const res = await httpRequest.get('menu_items');
        return res;
    }
);

export const addProduct = createAsyncThunk(
    'product/addProduct',
    async (newProduct) => {
        const res = await httpRequest.post('menu_items', newProduct);
        return res;
    }
)

export const updateProduct = createAsyncThunk(
    'product/updateProduct',
    async ({ id, data }) => {
        const res = await httpRequest.put(`menu_items/${id}`, data);
        return res;
    }
);

export const deleteProduct = createAsyncThunk(
    'product/deleteProduct',
    async (id) => {
        await httpRequest.deleted(`menu_items/${id}`);
        return id;
    }
);

// ----- Slice -----
const productSlice = createSlice({
    name: 'product',
    initialState: {
        listProducts: [],
        loading: false,
        error: null,
    },
    extraReducers: (builder) => {
        builder.
            addCase(fetchProducts.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.listProducts = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // add
            .addCase(addProduct.fulfilled, (state, action) => {
                state.listProducts.push(action.payload);
            })
            // update
            .addCase(updateProduct.fulfilled, (state, action) => {
                const index = state.listProducts.findIndex((item) => item.id === action.payload.id);
                if(index > -1) {
                    state.listProducts[index] = action.payload;
                }
            })
            // delete
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.listProducts = state.listProducts.filter(item => item.id !== action.payload);
            })
    }
});

export default productSlice.reducer;