/* eslint-disable react/prop-types */
// import React from "react";

const ProductCard = ({ product, onDelete, onUpdate }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-4 transition-transform transform hover:scale-105">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-40 object-contain rounded-t-lg"
      />

      <div className="mt-4">
        <h3 className="text-lg font-bold text-gray-800">{product.name}</h3>
        <p className="text-gray-600 mt-2">${product.price}</p>
        <p className="text-sm text-gray-500 mt-1">{product.description}</p>
      </div>

      <div className="flex justify-between mt-4">
        <button
          onClick={() => onUpdate(product._id)}
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
        >
          Update
        </button>
        <button
          onClick={() => onDelete(product._id)}
          className="px-4 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
