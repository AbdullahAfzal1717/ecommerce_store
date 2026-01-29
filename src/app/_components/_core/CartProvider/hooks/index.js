import React from "react";
import { CartContext } from "../CartContext";

export function useCart() {
  return React.useContext(CartContext);
}
