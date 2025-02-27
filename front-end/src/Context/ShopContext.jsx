import React, { createContext, useEffect, useState } from "react";

export const ShopContext = createContext(null);

const getDefaultCart = () => {
    let cart = {};
    for (let index = 0; index < 300; index++) {
        cart[index] = 0;
    }
    return cart;
};

const ShopContextProvider = (props) => {
    const [all_product, setAll_Product] = useState([]);
    const [cartItems, setCartItems] = useState(getDefaultCart());

    useEffect(() => {
        fetch("http://localhost:5000/allproducts")
            .then((response) => response.json())
            .then((data) => setAll_Product(data))
            .catch((error) => console.error("Error fetching products:", error));
             
            if(localStorage.getItem('auth-token')){
                fetch('http://localhost:5000/getcart',{
                    method:'POST',
                    headers:{
                        Accept:'application/form-data',
                        'auth-token':`${localStorage.getItem('auth-token')}`,
                        "Content-Type": "application/json",
                    },
                    body:"",
                }).then((response) => response.json())
                .then((data)=>setCartItems(data));
            }
        }, []);

    const addToCart = (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
        if (localStorage.getItem("auth-token")) {
            fetch("http://localhost:5000/addtocart", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "auth-token": `${localStorage.getItem("auth-token")}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ itemId }), // FIXED typo
            })
                .then((response) => response.json())
                .then((data) => console.log("Cart updated:", data))
                .catch((error) => console.error("Error adding to cart:", error));
        }
    };

    const removeFromCart = (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: Math.max(prev[itemId] - 1, 0) })); // Prevent negative values
        if (localStorage.getItem("auth-token")) {
            fetch("http://localhost:5000/removefromcart", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "auth-token": `${localStorage.getItem("auth-token")}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ itemId }), // FIXED typo
            })
                .then((response) => response.json())
                .then((data) => console.log("Cart updated:", data))
                .catch((error) => console.error("Error removing from cart:", error));
        }
    };

    const getTotalCartAmount = () => {
        return Object.entries(cartItems).reduce((total, [item, quantity]) => {
            if (quantity > 0) {
                const itemInfo = all_product.find((product) => product.id === Number(item));
                return itemInfo ? total + itemInfo.new_price * quantity : total;
            }
            return total;
        }, 0);
    };

    const getTotalCartItems = () => {
        return Object.values(cartItems).reduce((total, quantity) => total + quantity, 0);
    };

    const contextValue = {
        getTotalCartItems,
        getTotalCartAmount,
        all_product,
        cartItems,
        addToCart,
        removeFromCart,
    };

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
