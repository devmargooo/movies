import { Route, Routes } from "react-router-dom";
import "./App.css";
import { Cart } from "./pages/Cart/Cart";
import { HomePage } from './pages/Home/HomePage';
import { Profile } from './pages/Profile/Profile';


function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}

export default App;
