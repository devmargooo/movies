import cn from 'classnames';
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "../../useDebounce";
import { useCart } from "../Cart/CartContext";
import styles from "./HomePage.module.css";

interface IMovie {
    title: string;
    id: number;
    hit: boolean;
  }
  
export function HomePage() {
const [movies, setMovies] = useState<IMovie[]>([]);
const navigate = useNavigate();
const { addToCart } = useCart();

useEffect(() => {
    fetch(`http://localhost:3030/movies`)
    .then((r) => r.json())
    .then((data: IMovie[]) => setMovies(data));
}, []);

const fetchData = useCallback(async (searchQuery: string) => {
    try {
    const response = await fetch(
        `http://localhost:3030/movies?search=${encodeURIComponent(searchQuery)}`
    );
    const result = await response.json();
    setMovies(result);
    } catch (error) {
    console.error("Ошибка поиска:", error);
    }
}, []);

const debouncedFetch = useDebounce(fetchData, 5000);

const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedFetch(e.target.value);
};

return (
    <div className={styles.container}>
        <div className={styles.cartButtonContainer}>
            <button
            onClick={() => navigate("/cart")}
            className={styles.cartButton}
            >
            Корзина
            </button>
        </div>
        <input type="text" onChange={handleSearch} />
        <div>
            {movies.map((movie) => (
            <div
                className={cn(styles.movieCard, styles.movieCardSmall, movie.hit && styles.hit)}
                key={`${movie.id}-${movie.title}`}
                onClick={() => addToCart(movie)}
            >
                {movie.title}
            </div>
            ))}
        </div>
    </div>
);
}