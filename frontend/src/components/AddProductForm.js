import { useState } from "react";
import { useDispatch } from "react-redux";
import { addProduct } from "../store/productSlice";

const AddProductForm = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addProduct({ ...formData, price: Number(formData.price), stock: Number(formData.stock) }));
    setFormData({ name: "", category: "", price: "", stock: "" }); // 清空表单
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add Product</h3>
      <input type="text" name="name" placeholder="Product Name" value={formData.name} onChange={handleChange} required />
      <input type="text" name="category" placeholder="Category" value={formData.category} onChange={handleChange} required />
      <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} required />
      <input type="number" name="stock" placeholder="Stock" value={formData.stock} onChange={handleChange} required />
      <button type="submit">Add Product</button>
    </form>
  );
};

export default AddProductForm;
