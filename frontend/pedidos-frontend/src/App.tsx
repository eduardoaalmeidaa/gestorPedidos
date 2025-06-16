import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/loginPage/LoginPage";
import ProdutosPage from "./pages/produtosPage/ProdutosPage";
import RegisterPage from "./pages/registerPage/RegisterPage";
import PrivateRoute from "./components/PrivateRoute";
import PedidosPage from "./pages/pedidosPage/PedidosPage";
import ProdutosFormPage from "./pages/produtosFormPage/ProdutosFormPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/produtos"
          element={
            <PrivateRoute>
              <ProdutosPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/cadastrar-produto"
          element={
            <PrivateRoute>
              <ProdutosFormPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/editar-produto/:id"
          element={
            <PrivateRoute>
              <ProdutosFormPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/pedidos"
          element={
            <PrivateRoute>
              <PedidosPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
