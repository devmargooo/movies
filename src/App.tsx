import { Route, Routes } from "react-router-dom";
import "./App.css";
import { Cart } from "./pages/Cart/Cart";
import { HomePage } from './pages/Home/HomePage';


function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/cart" element={<Cart />} />
    </Routes>
  );
}

export default App;
