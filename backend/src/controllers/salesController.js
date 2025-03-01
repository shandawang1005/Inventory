const Sale = require("../models/Sale");
const Product = require("../models/Product");
const sendSalesUpdate = require("../kafka/producer");

const fs = require("fs");
const path = require("path");
const fastCsv = require("fast-csv");

exports.exportSalesCSV = async (req, res) => {
    try {
        const sales = await Sale.aggregate([
            {
                $lookup: {
                    from: "products",
                    localField: "productId",
                    foreignField: "_id",
                    as: "product",
                },
            },
            { $unwind: "$product" },
            {
                $group: {
                    _id: "$productId",
                    productName: { $first: "$product.name" },
                    totalSold: { $sum: "$quantity" },
                    totalRevenue: { $sum: { $multiply: ["$quantity", "$product.price"] } },
                },
            },
            { $sort: { totalSold: -1 } },
        ]);

        if (!sales.length) {
            return res.status(404).json({ message: "No sales data available" });
        }

        // ✅ 设置 CSV 头部
        res.setHeader("Content-Disposition", "attachment; filename=sales_report.csv");
        res.setHeader("Content-Type", "text/csv");

        // ✅ 写入 CSV 头部
        res.write("Product Name,Total Sold,Total Revenue\n");

        // ✅ 写入 CSV 数据
        sales.forEach((sale) => {
            res.write(`${sale.productName},${sale.totalSold},${sale.totalRevenue.toFixed(2)}\n`);
        });

        res.end(); // ✅ 结束响应
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// ✅ 记录销售，减少库存
exports.recordSale = async (req, res) => {
    try {
        const { productId, productName, quantity } = req.body;

        let product;
        if (productId) {
            product = await Product.findById(productId);
        } else if (productName) {
            product = await Product.findOne({ name: productName });
        }

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (product.stock < quantity) {
            return res.status(400).json({ message: "Not enough stock available" });
        }

        product.stock -= quantity;
        await product.save();

        const sale = new Sale({ productId: product._id, quantity });
        sendSalesUpdate(sale);
        await sale.save();

        res.json({ message: "Sale recorded successfully", remainingStock: product.stock });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ 获取销售报告
exports.getSalesReport = async (req, res) => {
    const { startDate, endDate } = req.query;
    let dataFilter = {}
    if (startDate && endDate) {
        dataFilter.saleDate = {
            $get: new Date(startDate),
            $lte: new Date(endDate).setHours(23, 59, 59, 999)
        }
    }

    try {
        const report = await Sale.aggregate([
            {
                $lookup: {
                    from: "products",
                    localField: "productId",
                    foreignField: "_id",
                    as: "product",
                },
            },
            { $unwind: "$product" }, // ✅ 让 product 不嵌套
            {
                $group: {
                    _id: "$productId",
                    productName: { $first: "$product.name" },
                    totalSold: { $sum: "$quantity" },
                    totalRevenue: { $sum: { $multiply: ["$quantity", "$product.price"] } },
                },
            },
            { $sort: { totalSold: -1 } }, // ✅ 按销量降序排列
        ]);

        res.json(report);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



exports.getRecentSales = async (req, res) => {
    try {
        const sales = await Sale.find()
            .sort({ saleDate: -1 }) // ✅ 按时间降序排列
            .limit(10) // ✅ 只取最近 10 笔
            .populate("productId", "name"); // ✅ 关联 `Product`，只取 `name`

        const formattedSales = sales.map((sale) => ({
            _id: sale._id,
            productName: sale.productId.name,
            quantity: sale.quantity,
            saleDate: sale.saleDate,
        }));

        res.json(formattedSales);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getTodayTotalSales = async (req, res) => {
    try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0); // ✅ 设置为今天的 00:00:00

        console.log("⏳ 查询今日销售，起始时间:", startOfDay); // ✅ Debugging log

        const totalSales = await Sale.aggregate([
            { $match: { saleDate: { $gte: startOfDay } } }, // ✅ 只筛选今天的数据
            {
                $lookup: {
                    from: "products", // ✅ 确保 "products" 拼写正确
                    localField: "productId",
                    foreignField: "_id",
                    as: "product",
                },
            },
            { $unwind: "$product" }, // ✅ 确保产品数据不是数组
            {
                $group: {
                    _id: null,
                    total: { $sum: { $multiply: ["$quantity", "$product.price"] } }, // ✅ 计算销售总额
                },
            },
        ]);

        console.log("📊 今日销售查询结果:", totalSales); // ✅ Debugging log

        res.json({ total: totalSales.length > 0 ? totalSales[0].total : 0 });
    } catch (error) {
        console.error("❌ getTodayTotalSales 出错:", error); // ✅ 打印错误日志
        res.status(500).json({ message: error.message });
    }
};
