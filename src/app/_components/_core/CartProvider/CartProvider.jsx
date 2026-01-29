import React, { useState, useEffect, useContext, useRef } from "react";
import { getCookie, setCookie, eraseCookie } from "@jumbo/utilities/cookies";
import { CartContext } from "./CartContext";
import { useAuth } from "../AuthProvider/hooks";

export const CartProvider = ({ children }) => {
  const { authUser, isAuthenticated } = useAuth();


  // Create a unique key based on User ID or 'guest'
  const cartKey =
    isAuthenticated && authUser?.id ? `cart_user_${authUser.id}` : "cart_guest";

  const [cartItems, setCartItems] = useState([]);
  const isInitialMount = useRef(true);

  // 1. EFFECT: Handle Loading and Merging when Auth State changes
  useEffect(() => {
    const userCartData = authUser?.id
      ? getCookie(`cart_user_${authUser.id}`)
      : null;
    const guestCartData = getCookie("cart_guest");

    let itemsToSet = [];

    if (isAuthenticated && authUser?.id) {
      // SCENARIO: User just logged in
      const userItems = userCartData
        ? JSON.parse(decodeURIComponent(userCartData))
        : [];
      const guestItems = guestCartData
        ? JSON.parse(decodeURIComponent(guestCartData))
        : [];

      if (guestItems.length > 0) {
        // MERGE LOGIC: Combine guest items with existing user items
        // We use a Map to prevent duplicate IDs
        const mergedMap = new Map();
        [...userItems, ...guestItems].forEach((item) => {
          if (mergedMap.has(item._id)) {
            const existing = mergedMap.get(item._id);
            mergedMap.set(item._id, {
              ...existing,
              quantityInCart: existing.quantityInCart + item.quantityInCart,
            });
          } else {
            mergedMap.set(item._id, item);
          }
        });
        itemsToSet = Array.from(mergedMap.values());

        // Cleanup: Once merged, guest cart must die
        eraseCookie("cart_guest");
      } else {
        itemsToSet = userItems;
      }
    } else {
      // SCENARIO: Guest User
      itemsToSet = guestCartData
        ? JSON.parse(decodeURIComponent(guestCartData))
        : [];
    }

    setCartItems(itemsToSet);
  }, [isAuthenticated, authUser?._id]);

  // 2. EFFECT: Save to Cookie whenever cartItems change
  useEffect(() => {
    // Avoid saving empty arrays on the very first render before useEffect 1 finishes
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    setCookie(cartKey, encodeURIComponent(JSON.stringify(cartItems)), 7);
  }, [cartItems, cartKey]);

  // --- CART FUNCTIONS (Your original logic, kept intact) ---
  const addToCart = (product, qty = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      if (existing) {
        const newQty = Math.min(
          existing.quantityInCart + qty,
          product.quantity
        );
        return prev.map((item) =>
          item._id === product._id ? { ...item, quantityInCart: newQty } : item
        );
      }
      return [...prev, { ...product, quantityInCart: qty }];
    });
  };

  const updateQuantity = (id, amount, stockLimit) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item._id === id) {
          let newQty = item.quantityInCart + amount;
          if (newQty < 1) newQty = 1;
          if (newQty > stockLimit) newQty = stockLimit;
          return { ...item, quantityInCart: newQty };
        }
        return item;
      })
    );
  };

  const removeItem = (id) =>
    setCartItems((prev) => prev.filter((item) => item._id !== id));

  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantityInCart,
    0
  );
  const count = cartItems.reduce((acc, item) => acc + item.quantityInCart, 0);

  const clearCart = () => {
    setCartItems([]);
    eraseCookie(cartKey);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeItem,
        total,
        count,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
