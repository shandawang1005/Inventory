import { useEffect, useState } from "react";

const Dashboard = () => {
    const [lowStockProducts, setLowStockProducts] = useState([]);
    const [totalSales, setTotalSales] = useState(0);
    const [totalInventoryValue, setTotalInventoryValue] = useState(0);

    useEffect(() => {
        // 获取低库存产品
        fetch("/api/dashboard/low-stock")
            .then((res) => res.json())
            .then((data) => setLowStockProducts(data));

        // 获取今日销售总额
        fetch("/api/dashboard/today-total")
            .then((res) => res.json())
            .then((data) => {
                console.log("💰 Today's Sales Total:", data); // ✅ Debugging log
                setTotalSales(data.total || 0)
            });

        // 获取总库存价值
        fetch("/api/dashboard/inventory-value")
            .then((res) => res.json())
            .then((data) => setTotalInventoryValue(data.totalValue || 0));
    }, []);

    return (
        <div>
            <h1>Dashboard</h1>

            <h2>📉 Low Stock Products (≤ 5)</h2>
            <ul>
                {lowStockProducts.length > 0 ? (
                    lowStockProducts.map((product) => (
                        <li key={product._id}>
                            {product.name} - {product.stock} left
                        </li>
                    ))
                ) : (
                    <p>All products are sufficiently stocked.</p>
                )}
            </ul>

            <h2>💰 Today's Sales Total</h2>
            <p>${totalSales.toFixed(2)}</p>

            <h2>📦 Total Inventory Value</h2>
            <p>${totalInventoryValue.toFixed(2)}</p>
        </div>
    );
};

export default Dashboard;
