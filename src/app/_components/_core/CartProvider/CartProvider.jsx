import React, { useState, useEffect, useContext, useRef } from "react";
import { getCookie, setCookie, eraseCookie } from "@jumbo/utilities/cookies";
import { CartContext } from "./CartContext";
import { useAuth } from "../AuthProvider/hooks";
import { toast } from "@app/_components/_core/MessageProvider";

export const CartProvider = ({ children }) => {
  const { authUser, isAuthenticated } = useAuth();

  const cartKey =
    isAuthenticated && authUser?.id ? `cart_user_${authUser.id}` : "cart_guest";

  const [cartItems, setCartItems] = useState([]);
  const isInitialMount = useRef(true);

  useEffect(() => {
    const userCartData = authUser?.id
      ? getCookie(`cart_user_${authUser.id}`)
      : null;
    const guestCartData = getCookie("cart_guest");

    let itemsToSet = [];

    if (isAuthenticated && authUser?.id) {
      const userItems = userCartData
        ? JSON.parse(decodeURIComponent(userCartData))
        : [];
      const guestItems = guestCartData
        ? JSON.parse(decodeURIComponent(guestCartData))
        : [];

      if (guestItems.length > 0) {
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
        eraseCookie("cart_guest");
        toast.info("Guest cart merged with your account!");
      } else {
        itemsToSet = userItems;
      }
    } else {
      itemsToSet = guestCartData
        ? JSON.parse(decodeURIComponent(guestCartData))
        : [];
    }

    setCartItems(itemsToSet);
  }, [isAuthenticated, authUser?._id]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    setCookie(cartKey, encodeURIComponent(JSON.stringify(cartItems)), 7);
  }, [cartItems, cartKey]);

  const addToCart = (product, qty = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      if (existing) {
        const newQty = Math.min(
          existing.quantityInCart + qty,
          product.quantity
        );
        toast.info(`Updated quantity for ${product.title}`);
        return prev.map((item) =>
          item._id === product._id ? { ...item, quantityInCart: newQty } : item
        );
      }
      toast.success(`${product.title} added to cart`);
      return [...prev, { ...product, quantityInCart: qty }];
    });
  };

  const updateQuantity = (id, amount, stockLimit) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item._id === id) {
          let newQty = item.quantityInCart + amount;
          if (newQty < 1) newQty = 1;
          if (newQty > stockLimit) {
            newQty = stockLimit;
            toast.warning("Maximum stock reached");
          }
          return { ...item, quantityInCart: newQty };
        }
        return item;
      })
    );
  };

  const removeItem = (id) => {
    setCartItems((prev) => {
      const filtered = prev.filter((item) => item._id !== id);
      toast.error("Item removed from cart");
      return filtered;
    });
  };

  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantityInCart,
    0
  );
  const count = cartItems.reduce((acc, item) => acc + item.quantityInCart, 0);

  const clearCart = () => {
    setCartItems([]);
    eraseCookie(cartKey);
    toast.warning("Cart cleared");
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
