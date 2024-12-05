import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa"; 
import { AuthContext } from "./AuthContext";
import Cookies from "js-cookie";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove('authToken'); 
    setUser(null); 
    navigate("/login");
  };

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-blue-600 shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link className="text-2xl font-bold text-white" to="/">
          Home
        </Link>
        <button
          className="block lg:hidden text-gray-600 focus:outline-none"
          onClick={toggleNavbar}
        >
          {isOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
        </button>
        <div className="hidden lg:flex lg:items-center lg:space-x-4">
          <Link className="text-white text-1xl font-semibold hover:text-gray-300  " to="/add-product">
            Add Product
          </Link>
        </div>
      </div>
      {isOpen && (
        <div className="lg:hidden bg-white shadow-md">
          <Link className="block text-gray-600 items-center justify-center hover:text-blue-600 py-2 px-4" to="/add-product">
            Add Product
          </Link>
        </div>
      )}
      <div>
      <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;