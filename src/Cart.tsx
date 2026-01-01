import { useNavigate } from "react-router-dom";
import "./App.css";
import { useCart } from "./CartContext";

export function Cart() {
  const navigate = useNavigate();
  const { cart, removeFromCart } = useCart();

  return (
    <div>
      <button onClick={() => navigate(-1)}>Назад</button>
      <h1>Корзина</h1>
      {cart.length === 0 ? (
        <p>Корзина пуста</p>
      ) : (
        <ul className="cart-list">
          {cart.map((movie) => (
            <li
              className="movie-card cart-item"
              key={`${movie.id}-${movie.title}`}
            >
              <span>{movie.title}</span>
              <button
                onClick={() => removeFromCart(movie.id)}
                className="delete-button"
              >
                Удалить
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

