import { useEffect, useState } from "react";

const Sales = () => {
    const [products, setProducts] = useState([]); // ✅ 存储所有产品
    const [selectedProduct, setSelectedProduct] = useState(""); // ✅ 用户选择的产品名
    const [quantity, setQuantity] = useState("");
    const [recentSales, setRecentSales] = useState([]); // ✅ 存储最近 10 条销售记录

    // ✅ 加载产品列表
    useEffect(() => {
        fetch("/api/products")
            .then((res) => res.json())
            .then((data) => setProducts(data));

        fetch("/api/sales/recent") // ✅ 获取最近 10 笔销售
            .then((res) => res.json())
            .then((data) => setRecentSales(data));
    }, []);

    // ✅ 记录销售
    const handleSell = async () => {
        const product = products.find((p) => p.name === selectedProduct);
        if (!product) {
            alert("Product not found");
            return;
        }

        const response = await fetch(`/api/sales`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId: product._id, quantity: Number(quantity) }),
        });

        if (response.ok) {
            // alert("Sale recorded successfully");
            fetch("/api/sales/recent") // ✅ 重新获取最近 10 条销售数据
                .then((res) => res.json())
                .then((data) => setRecentSales(data));
        } else {
            alert("Failed to record sale");
        }
    };

    return (
        <div>
            <h1>Sales</h1>
            <select onChange={(e) => setSelectedProduct(e.target.value)}>
                <option value="">Select Product</option>
                {products.map((product) => (
                    <option key={product._id} value={product.name}>
                        {product.name}
                    </option>
                ))}
            </select>
            <input type="number" placeholder="Quantity" onChange={(e) => setQuantity(e.target.value)} />
            <button onClick={handleSell}>Record Sale</button>

            <h2>Recent Sales</h2>
            <table border="1">
                <thead>
                    <tr>
                        <th>Product Name</th>
                        <th>Quantity Sold</th>
                        <th>Sale Date</th>
                    </tr>
                </thead>
                <tbody>
                    {recentSales.map((sale) => (
                        <tr key={sale._id}>
                            <td>{sale.productName}</td>
                            <td>{sale.quantity}</td>
                            <td>{new Date(sale.saleDate).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Sales;
