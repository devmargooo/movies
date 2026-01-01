import { useCallback, useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import { useDebounce } from "./useDebounce";
import { Cart } from "./Cart";

interface IMovie {
  title: string;
  id: number;
}

function HomePage() {
  const [movies, setMovies] = useState<IMovie[]>([]);
  const navigate = useNavigate();

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
    <>
      <div style={{ position: "relative", width: "100%" }}>
        <button
          onClick={() => navigate("/cart")}
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            padding: "8px 16px",
            cursor: "pointer",
          }}
        >
          Корзина
        </button>
      </div>
      <input type="text" onChange={handleSearch} />
      <div>
        {movies.map((movie) => (
          <pre key={`${movie.id}-${movie.title}`}>{movie.title}</pre>
        ))}
      </div>
    </>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/cart" element={<Cart />} />
    </Routes>
  );
}

export default App;
