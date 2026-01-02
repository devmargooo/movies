import cn from 'classnames';
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "../../useDebounce";
import { useCart } from "../Cart/CartContext";
import styles from "./HomePage.module.css";

interface IMovie {
    title: string;
    id: number;
    hit: boolean;
  }
  
const MAX_CACHE_SIZE = 10;

export function HomePage() {
const [movies, setMovies] = useState<IMovie[]>([]);
const [hoveredMovieId, setHoveredMovieId] = useState<number | null>(null);
const [posterUrl, setPosterUrl] = useState<string | null>(null);
const posterCache = useRef<Map<number, string>>(new Map());
const navigate = useNavigate();
const { addToCart } = useCart();

useEffect(() => {
    fetch(`http://localhost:3030/movies`)
    .then((r) => r.json())
    .then((data: IMovie[]) => setMovies(data));
}, []);

// Очистка кеша при размонтировании компонента
useEffect(() => {
    return () => {
        posterCache.current.forEach((url) => {
            URL.revokeObjectURL(url);
        });
        posterCache.current.clear();
    };
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

const getPosterUrl = async (movieId: number): Promise<string | null> => {
    // Проверяем кеш
    if (posterCache.current.has(movieId)) {
        return posterCache.current.get(movieId)!;
    }

    // Если кеш полон, удаляем самое старое изображение
    if (posterCache.current.size >= MAX_CACHE_SIZE) {
        const firstKey = posterCache.current.keys().next().value;
        if (firstKey !== undefined) {
            const oldUrl = posterCache.current.get(firstKey);
            if (oldUrl) {
                URL.revokeObjectURL(oldUrl);
            }
            posterCache.current.delete(firstKey);
        }
    }

    // Загружаем новое изображение
    try {
        const response = await fetch(`http://localhost:3030/movie/${movieId}/poster`);
        if (response.ok) {
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            posterCache.current.set(movieId, url);
            return url;
        }
    } catch (error) {
        console.error("Ошибка загрузки постера:", error);
    }
    return null;
};

const handleMovieMouseEnter = useCallback(async (movieId: number) => {
    setHoveredMovieId(movieId);
    const url = await getPosterUrl(movieId);
    if (url) {
        setPosterUrl(url);
    }
}, []);

const handleMovieMouseLeave = useCallback(() => {
    setHoveredMovieId(null);
}, []);

return (
    <div className={styles.container}>
        <header className={styles.header}>
            <div className={styles.headerSpacer}></div>
            <div className={styles.searchContainer}>
                <input 
                    type="text" 
                    onChange={handleSearch}
                    placeholder="Поиск фильмов..."
                    className={styles.searchInput}
                />
            </div>
            <button
                onClick={() => navigate("/cart")}
                className={styles.cartButton}
            >
                Корзина
            </button>
        </header>
        <button
            onClick={() => navigate("/profile")}
            className={styles.profileButton}
            aria-label="Профиль"
        >
            <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
            </svg>
        </button>
        <div className={styles.contentWrapper}>
            <div className={styles.posterContainer}>
                {hoveredMovieId && posterUrl && (
                    <img 
                        src={posterUrl}
                        alt="Постер фильма"
                        className={styles.poster}
                    />
                )}
            </div>
            <div className={styles.moviesList}>
                {movies.map((movie) => (
                <div
                    className={cn(styles.movieCard, styles.movieCardSmall, movie.hit && styles.hit)}
                    key={`${movie.id}-${movie.title}`}
                    onClick={() => addToCart(movie)}
                    onMouseEnter={() => handleMovieMouseEnter(movie.id)}
                    onMouseLeave={handleMovieMouseLeave}
                >
                    {movie.title}
                </div>
                ))}
            </div>
        </div>
    </div>
);
}