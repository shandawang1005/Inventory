// 引入 mongoose 库来连接 MongoDB
const mongoose = require('mongoose');
require('dotenv').config(); // 读取 .env 文件中的环境变量

// 连接 MongoDB 的函数
const connectDB = async () => {
  try {
    // 使用 MONGO_URI 连接 MongoDB 数据库
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // 如果连接成功，打印数据库主机地址
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // 如果连接失败，打印错误信息并退出进程
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// 导出 connectDB 函数，在 server.js 中调用
module.exports = connectDB;
