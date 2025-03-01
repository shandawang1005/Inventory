const Product = require("../models/Product");

// ✅ 获取所有商品
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ 获取单个商品
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ 创建商品
exports.createProduct = async (req, res) => {
    try {
        console.log("Received body:", req.body); // ✅ 打印接收到的数据

        const { name, description, price, stock, supplier, attributes } = req.body;

        const newProduct = new Product({
            name,
            description,
            price,
            stock,
            supplier,
            attributes,
        });

        const savedProduct = await newProduct.save();
        console.log("Saved product:", savedProduct); // ✅ 打印存入 MongoDB 的数据

        res.status(201).json(savedProduct);
    } catch (error) {
        console.error("Error saving product:", error); // ✅ 打印错误信息
        res.status(400).json({ message: error.message });
    }
};




// ✅ 更新商品

exports.updateProduct = async (req, res) => {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  
      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      res.json(updatedProduct);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
// ✅ 删除商品
exports.deleteProduct = async (req, res) => {
    try {
      const deletedProduct = await Product.findByIdAndDelete(req.params.id);
  
      if (!deletedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // 获取低库存产品（库存 ≤ 5）
exports.getLowStockProducts = async (req, res) => {
    try {
      const lowStockProducts = await Product.find({ stock: { $lte: 5 } });
      res.json(lowStockProducts);
    } catch (error) {
      res.status(500).json({ message: error.message });
    } 
  };
  
  // 计算所有库存的总价值
  exports.getTotalInventoryValue = async (req, res) => {
    try {
      const result = await Product.aggregate([
        { $group: { _id: null, totalValue: { $sum: { $multiply: ["$price", "$stock"] } } } },
      ]);
      res.json({ totalValue: result.length ? result[0].totalValue : 0 });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };