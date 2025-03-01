import { useState } from "react";
import "../styles/ProductList.css"; 

const ProductList = ({ products, onDelete, onEdit }) => {
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  const sortedProducts = [...products].sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortOrder === "asc" ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (field) => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    setSortField(field);
  };

  return (
    <div className="product-table-container">
      <h2>Product List</h2>
      <table className="product-table">
        <thead>
          <tr>
            <th onClick={() => handleSort("name")}>Name</th>
            <th onClick={() => handleSort("price")}>Price ($)</th>
            <th onClick={() => handleSort("stock")}>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedProducts.map((product) => (
            <tr key={product._id}>
              <td>{product.name}</td>
              <td>${product.price}</td>
              <td>{product.stock}</td>
              <td>
                <button className="edit-btn" onClick={() => onEdit(product)}>Edit</button>
                <button className="delete-btn" onClick={() => onDelete(product._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
