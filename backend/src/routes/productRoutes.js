const express = require('express');
const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');

const router = express.Router();

// 定义 API 路由
router.get('/', getProducts);          // 获取所有商品
router.get('/:id', getProductById);    // 获取单个商品
router.post('/', createProduct);       // 创建商品
router.put('/:id', updateProduct);     // 更新商品
router.delete('/:id', deleteProduct);  // 删除商品

module.exports = router;
