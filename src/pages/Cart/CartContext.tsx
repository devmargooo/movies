import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface IMovie {
  title: string;
  id: number;
}

interface CartContextType {
  cart: IMovie[];
  addToCart: (movie: IMovie) => void;
  removeFromCart: (movieId: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

const CART_STORAGE_KEY = 'cart';

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<IMovie[]>([]);

  // 🔹 инициализация из localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart));
      } catch {
        localStorage.removeItem(CART_STORAGE_KEY);
      }
    }
  }, []);

  const addToCart = (movie: IMovie) => {
    setCart((prev) => {
      const updatedCart = [...prev, movie];
      localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(updatedCart)
      );
      return updatedCart;
    });
  };

  const removeFromCart = (movieId: number) => {
    setCart((prev) => {
      const updatedCart = prev.filter(
        (movie) => movie.id !== movieId
      );
      localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(updatedCart)
      );
      return updatedCart;
    });
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};
