import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, deleteProduct, updateProduct } from "../store/productSlice";
import ProductList from "../components/ProductList";
import ProductEditModal from "../components/ProductEditModal";
import ProductUpload from "../components/Productupload";
import AddProductModal from "../components/AddProductModal"

const Products = () => {
    const dispatch = useDispatch();
    const { products, status, error } = useSelector((state) => state.products);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showAddProductModal, setShowAddProductModal] = useState(false)

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            dispatch(deleteProduct(id));
        }
    };

    const handleEdit = (product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleSave = (updatedProduct) => {
        dispatch(updateProduct(updatedProduct));
        setIsModalOpen(false);
    };

    const handleUpload = async (formData) => {
        const response = await fetch("/api/products/upload", {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
            dispatch(fetchProducts()); // 重新加载产品数据
        }
    };


    return (
        <div>
            <h1>Products</h1>
            <button onClick={() => setShowAddProductModal(true)}>Add Product</button>
            {showAddProductModal && (
                <AddProductModal
                    onClose={() => setShowAddProductModal(false)}
                    onProductAdded={() => dispatch(fetchProducts())} // ✅ 添加产品后刷新数据
                    isOpen
                />
            )}
            {status === "loading" && <p>Loading...</p>}
            {status === "failed" && <p>Error: {error}</p>}
            {status === "succeeded" && <ProductList products={products} onDelete={handleDelete} onEdit={handleEdit} />}
            <ProductEditModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} product={selectedProduct} onSave={handleSave} />
            <ProductUpload onUpload={handleUpload} />;
        </div>
    );
};

export default Products;
