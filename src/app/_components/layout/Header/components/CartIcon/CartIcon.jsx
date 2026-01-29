import React, { useState } from "react";
import { Badge, IconButton } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useCart } from "@app/_components/_core/CartProvider/hooks";
import CartDrawer from "@app/_components/storefront/cart/CartDrawer";

const CartHeaderIcon = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { count } = useCart();

  return (
    <>
      <IconButton color="inherit" onClick={() => setIsDrawerOpen(true)}>
        <Badge badgeContent={count} color="error">
          <ShoppingCartIcon />
        </Badge>
      </IconButton>
      <CartDrawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
};

export default CartHeaderIcon;
