// import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../Styles/shop.css";

export default function CartIcon() {
  const { items } = useCart();
  const count = items.reduce((s, it) => s + (it.qty ?? 0), 0);

  return (
    <Link to="/cart" className="cart-icon" aria-label="Ver carrito">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M3 3h2l1.5 9h11l1.5-6H7"
          stroke="#5a1b2a"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="10" cy="20" r="1.6" fill="#5a1b2a" />
        <circle cx="18" cy="20" r="1.6" fill="#5a1b2a" />
      </svg>
      {count > 0 && (
        <span className="cart-badge" aria-hidden>
          {count}
        </span>
      )}
    </Link>
  );
}
