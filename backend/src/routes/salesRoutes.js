const express = require("express");
const { recordSale, getSalesReport, getRecentSales, exportSalesCSV } = require("../controllers/salesController");

const router = express.Router();

router.post("/", recordSale);  // ✅ 记录销售
router.get("/report", getSalesReport);  // ✅ 获取销售报告
router.get("/recent", getRecentSales);
router.get("/export", exportSalesCSV);

module.exports = router;
