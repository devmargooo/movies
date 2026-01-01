import { useNavigate } from "react-router-dom";
import "./App.css";

export function Cart() {
  const navigate = useNavigate();

  return (
    <div>
      <button onClick={() => navigate(-1)}>Назад</button>
      <h1>Корзина</h1>
      <p>Здесь будет содержимое корзины</p>
    </div>
  );
}

