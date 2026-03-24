import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../api/client.js';
import { useAuth } from '../state/AuthContext.jsx';
import { useCart } from '../state/CartContext.jsx';

export default function DashboardPage() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', price: '' });
  const [editingId, setEditingId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const { user } = useAuth();
  const { addToCart: addItemToCart } = useCart();
  const isAdmin = user?.role === 'ROLE_ADMIN';
  const isRegularUser = user?.role === 'ROLE_USER';

  const loadProducts = async () => {
    try {
      const { data } = await api.get('/products');
      setProducts(data);
    } catch (e) {
      const details = e.response?.data;
      toast.error(details?.message || 'Failed to load products');
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const saveProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, price: Number(form.price) };
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
        toast.success('Product updated successfully');
      } else {
        await api.post('/products', payload);
        toast.success('Product added successfully');
      }
      setShowAddPopup(false);
      setForm({ name: '', description: '', price: '' });
      setEditingId(null);
      loadProducts();
    } catch (e1) {
      const details = e1.response?.data;
      toast.error(details?.message || 'Failed to save product');
    }
  };

  const startEdit = (p) => {
    setEditingId(p.id);
    setForm({ name: p.name, description: p.description, price: p.price });
    setShowAddPopup(true);
  };

  const removeProduct = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted successfully');
      loadProducts();
    } catch (e) {
      const details = e.response?.data;
      toast.error(details?.message || 'Failed to delete product');
    }
  };

  const handleAddToCart = (product) => {
    addItemToCart(product);
    toast.success('Added to cart');
  };

  return (
    <section className="card">
      <h2>Product Dashboard</h2>
      <p className="muted">Role: {user?.role}</p>

      {isAdmin && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "3rem" }}>
        <button
          style={{ display: "flex", justifyContent: "flex-end" }}
          className="btn"
          onClick={() => {
            setEditingId(null);
            setForm({ name: '', description: '', price: '' });
            setShowAddPopup(true);
          }}
        >
          Add Product
        </button>
        </div>
      )}

      <div className="list">
        {products.map((p) => (
          <article key={p.id} className="product-item">
            <div>
              <h3>{p.name}</h3>
              <p>{p.description}</p>
              <strong>Rs. {p.price}</strong>
              {p.createdByUsername && <p className="muted small">Added by: {p.createdByUsername}</p>}
            </div>
            <div className="actions">
              {(() => {
                const isOwner = isAdmin && p.createdByUsername === user?.username;
                return (
                  <>
              <button className="btn secondary" onClick={() => setSelectedProduct(p)}>View Details</button>
              {(isRegularUser || (isAdmin && !isOwner)) && (
                <button className="btn" onClick={() => handleAddToCart(p)}>Add to Cart</button>
              )}
              {isOwner && <button className="btn secondary" onClick={() => startEdit(p)}>Edit</button>}
              {isOwner && <button className="btn danger" onClick={() => removeProduct(p.id)}>Delete</button>}
                  </>
                );
              })()}
            </div>
          </article>
        ))}
      </div>

      {showAddPopup && (
        <div className="modal-backdrop" onClick={() => setShowAddPopup(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3 >{editingId ? 'Update Product' : 'Add Product'}</h3>
            <form className="form-grid" onSubmit={saveProduct}>
              <div className="floating-label full">
                <input placeholder=" " value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                <label>Name</label>
              </div>
              <div className="floating-label full">
                <input placeholder=" " value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
                <label>Description</label>
              </div>
              <div className="floating-label full">
                <input placeholder=" " type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
                <label>Price</label>
              </div>
              <div className="button-row">
                <button type="button" className="btn cancel" onClick={() => setShowAddPopup(false)}>Cancel</button>
                <button className="btn" type="submit">{editingId ? 'Update Product' : 'Add Product'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedProduct && (
        <div className="modal-backdrop" onClick={() => setSelectedProduct(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>{selectedProduct.name}</h3>
            <p>{selectedProduct.description}</p>
            <p><strong>Price:</strong> Rs. {selectedProduct.price}</p>
            <div className="button-row">
              <button className="btn cancel" onClick={() => setSelectedProduct(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
