import cn from 'classnames';
import { useNavigate } from "react-router-dom";
import styles from "./Cart.module.css";
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
        <ul className={styles.cartList}>
          {cart.map((movie) => (
            <li
              className={cn(styles.movieCard, styles.cartItem)}
              key={`${movie.id}-${movie.title}`}
            >
              <span>{movie.title}</span>
              <button
                onClick={() => removeFromCart(movie.id)}
                className={styles.deleteButton}
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

