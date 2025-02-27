const mongoose = require('mongoose');

// 定义 Product 商品 Schema
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true }, // 商品名称
  category: { type: String, required: true }, // 商品类别
  description: { type: String }, // 商品描述
  price: { type: Number, required: true }, // 商品单价
  stock: { type: Number, required: true, default: 0 }, // 库存数量
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' }, // 供应商 ID
  attributes: { type: Object }, // 动态属性（如尺寸、颜色）
  createdAt: { type: Date, default: Date.now }, // 创建时间
  updatedAt: { type: Date, default: Date.now }, // 更新时间
});

// 导出 Product 模型
module.exports = mongoose.model('Product', ProductSchema);
