const express = require("express");
const { getLowStockProducts, getTotalInventoryValue } = require("../controllers/productController");
const { getTodayTotalSales } = require("../controllers/salesController");

const router = express.Router();

router.get("/low-stock", getLowStockProducts);
router.get("/today-total", getTodayTotalSales);
router.get("/inventory-value", getTotalInventoryValue);

module.exports = router;
