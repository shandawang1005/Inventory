import { useState, useEffect } from "react";
import "../styles/Modal.css"

const ProductEditModal = ({ isOpen, onClose, product, onSave }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price);
      setStock(product.stock);
    }
  }, [product]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...product, name, price: Number(price), stock: Number(stock) });
  };

  // ✅ 监听灰色背景区域的点击
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal">
        <h2>Edit Product</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
          <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} required />
          <button type="submit">Save</button>
          <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default ProductEditModal;
