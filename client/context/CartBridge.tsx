import { useEffect } from "react";
import { useCart } from "./CartContext";

export default function CartBridge() {
  const { add } = useCart();
  useEffect(() => {
    (window as any).addToCart = add;
    return () => {
      delete (window as any).addToCart;
    };
  }, [add]);
  return null;
}
