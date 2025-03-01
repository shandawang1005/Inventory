import { useState } from "react";
import "../styles/Modal.css"
const AddProductModal = ({ onClose, onProductAdded, isOpen }) => {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newProduct = { name, price: parseFloat(price), stock: parseInt(stock) };

        try {
            const response = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newProduct),
            });

            if (!response.ok) throw new Error("Failed to add product");

            onProductAdded(); // ✅ 触发父组件刷新
            onClose(); // ✅ 关闭 modal
        } catch (error) {
            console.error("Error adding product:", error);
        }
    };


    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose()
        }
    }
    if (!isOpen) return null
    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal" >
                <h2>Add Product</h2>
                <form onSubmit={handleSubmit}>
                    <label>Product Name:</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />

                    <label>Price:</label>
                    <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />

                    <label>Stock:</label>
                    <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} required />

                    <button type="submit">Add</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </form>
            </div>
           
        </div>
    );
};

export default AddProductModal;
