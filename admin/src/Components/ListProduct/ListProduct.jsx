import React, { useState, useEffect } from 'react';
import './ListProduct.css';
import cross_icon from '../../assets/cross_icon.png';

export const ListProduct = () => {
  const [allProducts, setAllProducts] = useState([]);

  const fetchInfo = async () => {
    try {
      const res = await fetch('http://localhost:5000/allproducts');
      const data = await res.json();
      setAllProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  const remove_product = async (id, index) => {
    try {
      const res = await fetch('http://localhost:5000/removeproduct', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId: id }),
      });
  
      const result = await res.json();
  
      if (res.ok && result.success) { // Ensure the backend successfully processed the request
        const updatedProducts = allProducts.filter((_, i) => i !== index);
        setAllProducts(updatedProducts);
      } else {
        console.error('Error removing product:', result.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Failed to remove product:', error);
    }
  };
  

  const handleRemove = (index) => {
    const updatedProducts = allProducts.filter((_, i) => i !== index);
    setAllProducts(updatedProducts);
  };

  return (
    <div className='list-product'>
      <h1>All Products List</h1>
      <div className="listproduct-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Remove</p>
      </div>
      <div className="listproduct-allproduct">
        <hr />
        {allProducts.map((product, index) => (
          <><div key={index} className="listproduct-format-main listproduct-format">
            <img src={product.image} alt={product.name} className="listproduct-product-icon" />
            <p>{product.name}</p>
            <p>${product.old_price}</p>
            <p>${product.new_price}</p>
            <p>{product.category}</p>
            <img 
  onClick={() => remove_product(product.id, index)} 
  className="listproduct-remove-icon" 
  src={cross_icon} 
  alt="Remove" 
  style={{ cursor: 'pointer' }} />

          </div>
        <hr /></>
          
        ))}
      </div>
    </div>
  );
};
