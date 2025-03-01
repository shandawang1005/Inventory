import { useState } from "react";
import { useDispatch } from "react-redux";
import { addProduct } from "../store/productSlice";

const ProductForm = () => {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault();
        const newProduct = { name, price: Number(price), stock: Number(stock) };
        dispatch(addProduct(newProduct)); // 触发 Redux action
        setName("");
        setPrice("");
        setStock("");
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required />
            <input type="number" placeholder="Stock" value={stock} onChange={(e) => setStock(e.target.value)} required />
            <button type="submit">Add Product</button>
        </form>
    );
};

export default ProductForm;
