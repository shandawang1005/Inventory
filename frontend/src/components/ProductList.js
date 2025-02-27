import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, updateProduct, deleteProduct } from "../store/productSlice";

const ProductList = () => {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (status === "loading") return <p>Loading...</p>;
  if (status === "failed") return <p>Error: {error}</p>;

  const handleUpdateStock = (id, stock) => {
    dispatch(updateProduct({ id, updatedData: { stock: stock + 1 } })); // 库存 +1
  };

  const handleDelete = (id) => {
    dispatch(deleteProduct(id));
  };

  return (
    <div>
      <h2>Product List</h2>
      <ul>
        {items.map((product) => (
          <li key={product._id}>
            {product.name} - ${product.price} (Stock: {product.stock}) 
            <button onClick={() => handleUpdateStock(product._id, product.stock)}>+1 Stock</button>
            <button onClick={() => handleDelete(product._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
