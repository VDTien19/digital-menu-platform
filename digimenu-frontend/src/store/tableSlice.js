import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as httpRequest from '~/utils/httpRequest';

export const fetchTable = createAsyncThunk(
    'table/fetchTable',
    async () => {
        const res = await httpRequest.get('tables');
        return res;
    }
)

export const addTable = createAsyncThunk(
    'table/addTable',
    async (newTable) => {
        const res = await httpRequest.post('tables', newTable);
        return res;
    }
);

export const updateTable = createAsyncThunk(
    'table/updateTable',
    async ({ id, data }) => {
        const res = await httpRequest.patch(`tables/${id}`, data);
        return res;
    }
);

export const deleteTable = createAsyncThunk(
    'table/deleteTable',
    async (id) => {
        await httpRequest.deleted(`tables/${id}`);
        return id;
    }
);

// ----- Slice -----
const tableSlice = createSlice({
    name: 'table',
    initialState: {
        listTables: [],
        loading: false,
        error: null,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTable.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchTable.fulfilled, (state, action) => {
                state.loading = false;
                state.listTables = action.payload;
            })
            .addCase(fetchTable.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // add
            .addCase(addTable.fulfilled, (state, action) => {
                state.listTables.push(action.payload);
            })
            // update
            .addCase(updateTable.fulfilled, (state, action) => {
                const index = state.listTables.findIndex((item) => item.id === action.payload.id);
                if (index !== -1) {
                    state.listTables[index] = action.payload;
                }
            })
            // delete
            .addCase(deleteTable.fulfilled, (state, action) => {
                const index = state.listTables.findIndex((item) => item.id === action.payload);
                if (index !== -1) {
                    state.listTables.splice(index, 1);
                }
            });
    },
});

export default tableSlice.reducer;