import React from 'react';
import { Link, Navigate, Route, Routes } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './state/AuthContext.jsx';
import { CartProvider, useCart } from './state/CartContext.jsx';
import LoginPage from './views/LoginPage.jsx';
import RegisterPage from './views/RegisterPage.jsx';
import DashboardPage from './views/DashboardPage.jsx';
import ProfilePage from './views/ProfilePage.jsx';
import shoppingCartIcon from './assets/shopping-cart.png';

function ProtectedRoute({ children }) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

function Header({ onOpenCart }) {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  return (
    <header className="topbar">
      <h1>Ecommerce</h1>
      <nav>
        {user && <Link to="/dashboard">Dashboard</Link>}
        {user && <Link to="/profile">Profile</Link>}
        {user && (
          <button className="btn secondary nav-icon-btn" title="Cart" aria-label="Cart" onClick={onOpenCart}>
            <img src={shoppingCartIcon} alt="Cart" className="nav-icon-image" />
            {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
          </button>
        )}
        {!user && <Link to="/login">Login</Link>}
        {!user && <Link to="/register">Register</Link>}
        {user && <button className="btn" onClick={handleLogout}>Logout</button>}
      </nav>
    </header>
  );
}

function AppRoutes() {
  const { token } = useAuth();
  const { cart, total, updateQty, removeFromCart, clearCart } = useCart();
  const [showCartModal, setShowCartModal] = React.useState(false);

  return (
    <>
      <Header onOpenCart={() => setShowCartModal(true)} />
      <main className="container">
        <Routes>
          <Route path="/" element={<Navigate to={token ? '/dashboard' : '/login'} replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        </Routes>
      </main>

      {showCartModal && (
        <div className="modal-backdrop" onClick={() => setShowCartModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Your Cart</h3>
            {cart.length === 0 ? (
              <p className="muted">No items in cart.</p>
            ) : (
              <>
                <div className="cart-list">
                  {cart.map((item) => (
                    <div key={item.id} className="cart-item">
                      <div>
                        <strong>{item.name}</strong>
                        <p className="muted">Rs. {item.price}</p>
                      </div>
                      <div className="qty-controls">
                        <button className="btn secondary" onClick={() => updateQty(item.id, item.qty - 1)}>-</button>
                        <span>{item.qty}</span>
                        <button className="btn secondary" onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
                        <button className="btn danger" onClick={() => removeFromCart(item.id)}>Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
                <p><strong>Total: Rs. {total}</strong></p>
                <button className="btn secondary" onClick={clearCart}>Clear Cart</button>
              </>
            )}
            <button className="btn" onClick={() => setShowCartModal(false)}>Close</button>
          </div>
        </div>
      )}

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppRoutes />
      </CartProvider>
    </AuthProvider>
  );
}
