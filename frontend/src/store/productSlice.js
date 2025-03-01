import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ✅ 添加错误处理，确保 `fetch` 正确返回数据
export const fetchProducts = createAsyncThunk("products/fetch", async () => {
    const response = await fetch("/api/products");

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.json();
});

export const addProduct = createAsyncThunk("products/add", async (newProduct) => {
    const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
    });
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.json();
});

export const deleteProduct = createAsyncThunk("products/delete", async (id) => {
    const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return id; // ✅ 返回删除的产品 ID
});

export const updateProduct = createAsyncThunk("products/update", async (updatedProduct) => {
    const response = await fetch(`/api/products/${updatedProduct._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProduct),
    });

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.json();
});


const productSlice = createSlice({
    name: "products",
    initialState: { products: [], status: "idle", error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.products = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })
            .addCase(addProduct.fulfilled, (state, action) => {
                state.products.push(action.payload); // ✅ 添加新产品到 Redux Store
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.products = state.products.filter((product) => product._id !== action.payload);
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                const index = state.products.findIndex((p) => p._id === action.payload._id);
                if (index !== -1) {
                    state.products[index] = action.payload;
                }
            })
        //[1,2,3,4,5]
        // i = 0 
        //arr[0]= actionpayload


        // { user : 123 , location : {address:xxx St,{state:CA, country :US }}}
    },
})

export default productSlice.reducer;



