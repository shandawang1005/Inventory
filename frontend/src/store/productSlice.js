import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// 示例：异步 action（如果有的话）
export const fetchProducts = createAsyncThunk("products/fetch", async () => {
    const response = await fetch("http://localhost:5000/api/products");
    return await response.json();
});

const productSlice = createSlice({
    name: "products",
    initialState: {
        items: [],
        status: null,
    },
    reducers: {
        addProduct: (state, action) => {
            state.items.push(action.payload);
        },
        updateProduct: (state, action) => {
            const index = state.items.findIndex((p) => p.id === action.payload.id);
            if (index !== -1) {
                state.items[index] = action.payload;
            }
        },
        deleteProduct: (state, action) => {
            state.items = state.items.filter((p) => p.id !== action.payload);
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchProducts.fulfilled, (state, action) => {
            state.items = action.payload;
        });
    },
});

// 确保正确导出 reducers
export const { addProduct, updateProduct, deleteProduct } = productSlice.actions;

// 确保正确导出 reducer
export default productSlice.reducer;
