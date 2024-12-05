import { useState, useEffect, useContext } from "react";
import ProductCard from "./ProductCard";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { AuthContext } from "./AuthContext";
import axiosInstance from "../utils/axiosInstance";

const Home = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get('/products');
        setProducts(response.data);
      } catch (error) {
        console.error("Product fetch error:", error);
        if (error.response && error.response.status === 401) {
          navigate("/login");
        }
      }
    };
    if (user) {
      fetchProducts();
    } else {
      navigate("/login");
    }
    fetchProducts();
  }, [navigate, user]);

 

  // Delete handler
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/products/${id}`);
      const updatedProducts = products.filter((product) => product._id !== id);
      setProducts(updatedProducts);
      toast.success("Product deleted successfully!");
    } catch {
      toast.error("Error deleting product");
    }
  };

  // Update handler
  const handleUpdate = (id) => {
    navigate(`/update-product/${id}`);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="bg-gray-100">
        <div className="min-h-screen bg-gray-50 py-10">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Our Products
          </h1>

          <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
              />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
