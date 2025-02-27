import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// 1️⃣ `createAsyncThunk` 用于处理异步请求，例如从后端 API 获取数据
export const fetchProducts = createAsyncThunk(
  "products/fetch", // 这个是 action 的名称
  async () => {
    const response = await fetch("/api/products"); // 直接请求后端 API
    return response.json(); // 解析 JSON 数据并返回
  }
);

// 2️⃣ `createSlice` 创建 Redux slice，包含 state、reducers 和异步处理逻辑
const productSlice = createSlice({
  name: "products", // slice 的名字，Redux 里会以 `products/` 开头的 action 类型
  initialState: { 
    items: [], // 存储所有产品数据
    status: "idle", // "idle" | "loading" | "succeeded" | "failed"
    error: null // 记录错误信息（如果有）
  },

  // 3️⃣ `reducers` 定义同步 action（这里暂时不需要，后面我们会加）
  reducers: {},

  // 4️⃣ `extraReducers` 监听异步请求的状态变化（类似 `switch-case` 处理不同的 action）
  extraReducers: (builder) => {
    builder
      // 🔹 当 `fetchProducts` 开始执行时，Redux 触发 `pending`，表示正在加载数据
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading"; // 进入加载状态
      })
      
      // 🔹 `fulfilled` 触发时，表示 API 请求成功，数据返回了
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded"; // 变成成功状态
        state.items = action.payload; // 把后端返回的数据存到 Redux store 里
      })

      // 🔹 `rejected` 触发时，表示 API 请求失败，记录错误信息
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed"; // 失败状态
        state.error = action.error.message; // 存储错误信息
      });
  }
});

// 5️⃣ 导出 reducer，`store.js` 需要用到
export default productSlice.reducer;
