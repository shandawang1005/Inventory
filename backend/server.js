// 引入 Express 框架，用于创建 API 服务器
const express = require('express');
require('./src/models/Product');
require('./src/models/Supplier');
const productRoutes = require('./src/routes/productRoutes');
const salesRoutes = require("./src/routes/salesRoutes");
const dashboardRoutes = require("./src/routes/dashboardRoutes");


const multer = require("multer");
const csvParser = require("csv-parser");
const fs = require("fs");

const upload = multer({ dest: "uploads/" });

// 允许跨域请求的中间件
const cors = require('cors');

// 读取 .env 文件中的环境变量
require('dotenv').config();

// 引入 MongoDB 连接函数
const connectDB = require('./src/config/db');

// 创建 Express 应用实例
const app = express();

app.use(cors());

// 连接 MongoDB 数据库
connectDB();

// 启用 CORS 以允许前端访问 API

// 解析 JSON 格式的请求体
app.use(express.json());

app.use('/api/products', productRoutes);
app.use("/api/sales", salesRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.post("/api/products/upload", upload.single("file"), (req, res) => {
    const products = [];
    fs.createReadStream(req.file.path)
        .pipe(csvParser())
        .on("data", (row) => products.push(row))
        .on("end", async () => {
            await Product.insertMany(products);
            res.json({ message: "CSV uploaded successfully" });
        });
});


// 设置服务器端口号，默认使用 .env 文件中的 PORT，若无则使用 5000
const PORT = process.env.PORT || 5000;

// 启动服务器，监听指定端口
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
