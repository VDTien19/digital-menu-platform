import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as httpRequest from '~/utils/httpRequest';

export const fetchCategories = createAsyncThunk(
    'category/featchCategories',
    async () => {
        const res = await httpRequest.get('/menu_categories');
        return res;
    }
);

export const addCategory = createAsyncThunk(
    'category/addCategory',
    async (newCategory) => {
        const res = await httpRequest.post('/menu_categories', newCategory);
        return res;
    }
);

export const updateCategory = createAsyncThunk(
    'category/updateCategory',
    async ({ id, data }) => {
        const res = await httpRequest.patch(`/menu_categories/${id}`, data);
        return res;
    }
);

export const deleteCategory = createAsyncThunk(
    'category/deleteCategory',
    async (id) => {
        httpRequest.deleted(`/menu_categories/${id}`);
        return id;
    }
);

// ----- Slice -----
const categorySlice = createSlice({
    name: 'category',
    initialState: {
        list: [],
        loading: false,
        error: null,
        filters: {
            name: '',
            type: ''
        },
    },
    reducers: {
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearFilters: (state) => {
            state.filters = { name: '', type: '' };
        }
    },
    extraReducers: (builder) => {
        builder.
            // fetch
            addCase(fetchCategories.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // add
            .addCase(addCategory.fulfilled, (state, action) => {
                state.list.push(action.payload);
            })
            // update
            .addCase(updateCategory.fulfilled, (state, action) => {
                const index = state.list.findIndex(item => item.id === action.payload.id);
                if (index > -1) {
                    state.list[index] = action.payload;
                }
            })
            // deleted
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.list = state.list.filter(item => item.id !== action.payload);
            })
    } 
});

export const { setFilters, clearFilters } = categorySlice.actions;
export default categorySlice.reducer;