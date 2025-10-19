import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../state/CartContext';
import { useAuth } from '../state/AuthContext';
import { AiFillDelete } from 'react-icons/ai';
import carGif from '../images/car.gif';
import '../styles/cart.css';

export default function Cart() {
  const { cart, dispatch } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const total = cart.reduce((acc, i) => acc + i.price * i.qty, 0); // 🔹 precio en dólares

  const [animate, setAnimate] = useState(false);
  const [checkoutAnim, setCheckoutAnim] = useState(false);

  useEffect(() => {
    if (cart.length > 0) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 500);
      return () => clearTimeout(timer);
    }
  }, [cart]);

  const handleCheckout = () => {
    setCheckoutAnim(true);
    setTimeout(() => {
      navigate('/checkout');
    }, 1000);
  };

  return (
    <div className={`cart-container ${animate ? 'shake' : ''}`}>
      <img src={carGif} alt="Carrito" className="cart-icon" />
      <h2>Carrito</h2>
      {cart.length === 0 && <p>Tu carrito está vacío.</p>}
      {cart.map(i => (
        <div
          key={i.productId}
          className={`cart-item ${checkoutAnim ? 'checkout-animate' : ''}`}
        >
          <div className="name">{i.name}</div>
          <img src={i.image} className='img' alt={i.name} />
          <input
            type="number"
            min={1}
            value={i.qty}
            onChange={e =>
              dispatch({ type: 'SET_QTY', id: i.productId, qty: Number(e.target.value) })
            }
          />
          <div className="price">${(i.price * i.qty).toFixed(2)}</div>
          <button onClick={() => dispatch({ type: 'REMOVE', id: i.productId })}>
            Vaciar <AiFillDelete />
          </button>
        </div>
      ))}
      <h3>Total: ${total.toFixed(2)}</h3>
      {cart.length > 0 && user && (
        <button className="checkout-btn" onClick={handleCheckout}>
          Proceder al pago
        </button>
      )}
      {!user && cart.length > 0 && (
        <p className="login-msg">Debes iniciar sesión para proceder al pago.</p>
      )}
    </div>
  );
}
