import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const SalesReport = () => {
    const [salesData, setSalesData] = useState([]); // ✅ 保存销售数据
    const [startDate, setStartDate] = useState(""); // ✅ 选择的开始日期
    const [endDate, setEndDate] = useState(""); // ✅ 选择的结束日期

    // ✅ 组件首次加载时，获取所有 Sales Report
    useEffect(() => {
        console.log("📢 初次加载 SalesReport 页面");
        fetchSales(); // ✅ 初次渲染时获取所有销售数据
        const socket = new WebSocket("ws://localhost:5001");

        socket.onmessage = (event) => {
            const newSale = JSON.parse(event.data);
            console.log("📥 Received new sale:", newSale);
            setSalesData((prev) => [...prev, newSale]); // ✅ 实时更新 `Sales Report`
        };

        return () => socket.close(); // 组件卸载时关闭 WebSocket 连接
    }, []);

    const fetchSales = () => {
        let url = "/api/sales/report"; // 默认获取所有数据
        if (startDate && endDate) {
            url += `?startDate=${startDate}&endDate=${endDate}`; // 仅当选择了日期时，才加上参数
        }

        console.log(`🔍 Fetching sales data from: ${url}`);

        fetch(url)
            .then((res) => {
                console.log("📨 API Response:", res);
                return res.json();
            })
            .then((data) => {
                console.log("✅ Received Sales Data:", data);
                setSalesData(data); // ✅ 更新销售数据
            })
            .catch((error) => console.error("❌ Error fetching sales data:", error));
    };

    return (
        <div>
            <h1>Sales Report</h1>

            <label>Start Date:</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />

            <label>End Date:</label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />

            {/* ✅ 点击 Filter 触发 fetchSales()，更新 salesData */}
            <button onClick={fetchSales}>Filter</button>

            <h2>Sales Chart</h2>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="productName" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="totalRevenue" fill="#8884d8" name="Total Revenue ($)" />
                </BarChart>
            </ResponsiveContainer>
            <h2>Sales Data</h2>

            <table border="1">
                <thead>
                    <tr>
                        <th>Product Name</th>
                        <th>Total Sold</th>
                        <th>Total Revenue ($)</th>
                    </tr>
                </thead>
                <tbody>
                    {salesData.length > 0 ? (
                        salesData.map((sale) => (
                            <tr key={sale._id}>
                                <td>{sale.productName}</td>
                                <td>{sale.totalSold}</td>
                                <td>${sale.totalRevenue.toFixed(2)}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3">⚠️ No sales data available.</td>
                        </tr>
                    )}
                </tbody>
            </table>

        </div>
    );
};

export default SalesReport;
