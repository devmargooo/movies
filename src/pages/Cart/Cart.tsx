import cn from 'classnames';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../hooks/useToast";
import styles from "./Cart.module.css";
import { useCart } from "./CartContext";

const MOVIE_PRICE = 10;

export function Cart() {
  const navigate = useNavigate();
  const { cart, removeFromCart } = useCart();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const { showToast, ToastComponent } = useToast();
  
  const discountPercent = cart.length;
  const priceBeforeDiscount = cart.length * MOVIE_PRICE;
  const discountAmount = (priceBeforeDiscount * discountPercent) / 100;
  const finalPrice = priceBeforeDiscount - discountAmount;

  const handlePurchase = async () => {
    if (cart.length === 0) return;
    
    setIsPurchasing(true);
    const ids = cart.map(movie => movie.id);

    try {
      const response = await fetch('http://localhost:3030/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ids,
          amount: finalPrice,
        }),
      });

      if (response.ok) {
        // Очистить корзину после успешной покупки
        cart.forEach(movie => removeFromCart(movie.id));
        showToast('Покупка успешно завершена!', 'success');
      } else {
        const error = await response.json().catch(() => ({ message: 'Неизвестная ошибка' }));
        showToast(`Ошибка покупки: ${error.message || 'Неизвестная ошибка'}`, 'error');
      }
    } catch (error) {
      console.error('Ошибка покупки:', error);
      showToast('Произошла ошибка при оформлении покупки', 'error');
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <div>
      {ToastComponent}
      <button onClick={() => navigate(-1)}>Назад</button>
      <h1>Корзина</h1>
      {cart.length === 0 ? (
        <p>Корзина пуста</p>
      ) : (
        <>
          <ul className={styles.cartList}>
            {cart.map((movie) => (
              <li
                className={cn(styles.movieCard, styles.cartItem)}
                key={`${movie.id}-${movie.title}`}
              >
                <div className={styles.movieInfo}>
                  <span>{movie.title}</span>
                  <span className={styles.moviePrice}>${MOVIE_PRICE}</span>
                </div>
                <button
                  onClick={() => removeFromCart(movie.id)}
                  className={styles.deleteButton}
                >
                  Удалить
                </button>
              </li>
            ))}
          </ul>
          <div className={styles.total}>
            <div className={styles.priceRow}>
              <span>Цена до скидки:</span>
              <span>${priceBeforeDiscount.toFixed(2)}</span>
            </div>
            {discountPercent > 0 && (
              <>
                <div className={styles.priceRow}>
                  <span>Скидка ({discountPercent}%):</span>
                  <span className={styles.discount}>-${discountAmount.toFixed(2)}</span>
                </div>
              </>
            )}
            <div className={styles.priceRow}>
              <strong>Итого:</strong>
              <strong>${finalPrice.toFixed(2)}</strong>
            </div>
          </div>
          <button
            onClick={handlePurchase}
            disabled={isPurchasing}
            className={styles.purchaseButton}
          >
            {isPurchasing ? 'Оформление...' : 'Купить'}
          </button>
        </>
      )}
    </div>
  );
}

