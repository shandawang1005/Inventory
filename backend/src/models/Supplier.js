const mongoose = require('mongoose');

// 定义 Supplier 供应商 Schema
const SupplierSchema = new mongoose.Schema({
  name: { type: String, required: true }, // 供应商名称
  contact: { type: String }, // 联系方式
  phone: { type: String }, // 电话
  address: { type: String }, // 地址
  createdAt: { type: Date, default: Date.now }, // 创建时间
});

// 导出 Supplier 模型
module.exports = mongoose.model('Supplier', SupplierSchema);
