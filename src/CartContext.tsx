import { createContext, useContext, useState, ReactNode } from "react";

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

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<IMovie[]>([]);

  const addToCart = (movie: IMovie) => {
    setCart((prev) => [...prev, movie]);
  };

  const removeFromCart = (movieId: number) => {
    setCart((prev) => prev.filter((movie) => movie.id !== movieId));
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

