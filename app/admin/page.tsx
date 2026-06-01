"use client";
import { useState, useEffect, useCallback } from "react";

interface Order {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  book_price: number;
  courier_fee: number;
  total: number;
  screenshot_url: string;
  status: string;
  created_at: string;
}

const ADMIN_EMAIL = "aman@gmail.com";
const ADMIN_PASS = "aman@123";
const ADMIN_SECRET = "creative-constructor-admin-2024";

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginError, setLoginError] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        headers: { 'x-admin-auth': ADMIN_SECRET }
      });
      const data = await res.json();
      if (data.orders) setOrders(data.orders);
    } catch {
      console.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authed) fetchOrders();
  }, [authed, fetchOrders]);

  // Keyboard shortcut: 4343
  useEffect(() => {
    let keys = "";
    const handler = (e: KeyboardEvent) => {
      keys += e.key;
      if (keys.length > 4) keys = keys.slice(-4);
      if (keys === "4343") {
        window.location.href = "/admin";
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleLogin = () => {
    if (loginEmail === ADMIN_EMAIL && loginPass === ADMIN_PASS) {
      setAuthed(true);
      setLoginError("");
    } else {
      setLoginError("Invalid email or password.");
    }
  };

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    try {
      await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'x-admin-auth': ADMIN_SECRET, 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
      if (selectedOrder?.id === id) setSelectedOrder(prev => prev ? { ...prev, status } : null);
    } catch {
      console.error('Failed to update');
    } finally {
      setUpdating(null);
    }
  };

  const filteredOrders = filterStatus === "all" ? orders : orders.filter(o => o.status === filterStatus);

  const statusColor = (s: string) => {
    if (s === 'confirmed') return { bg: '#e8f5e9', color: '#2e7d32', border: '#a5d6a7' };
    if (s === 'shipped') return { bg: '#e3f2fd', color: '#1565c0', border: '#90caf9' };
    if (s === 'pending') return { bg: '#fff8e1', color: '#f57f17', border: '#ffe082' };
    return { bg: '#fce4ec', color: '#c62828', border: '#f48fb1' };
  };

  if (!authed) {
    return (
      <main style={{ backgroundColor: '#FFFFE3', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div className="book-page" style={{ borderRadius: '4px', padding: '2.5rem 2.5rem 2.5rem 3.5rem', maxWidth: '400px', width: '100%' }}>
          <p style={{ fontSize: '0.7rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#8B4513', marginBottom: '0.8rem', fontWeight: 700 }}>
            Restricted Area
          </p>
          <h1 className="display-font" style={{ fontSize: '1.8rem', color: '#1a1a0e', marginBottom: '1.5rem' }}>Admin Login</h1>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#3a3a2a', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</label>
              <input
                type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                placeholder="admin@email.com"
                style={{ width: '100%', padding: '0.7rem 0.9rem', border: '1px solid #c8c89a', borderRadius: '3px', backgroundColor: '#FFFFF0', color: '#1a1a0e', fontSize: '0.95rem', outline: 'none', fontFamily: "'Nunito', sans-serif" }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#3a3a2a', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Password</label>
              <input
                type="password" value={loginPass} onChange={e => setLoginPass(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                placeholder="••••••••"
                style={{ width: '100%', padding: '0.7rem 0.9rem', border: '1px solid #c8c89a', borderRadius: '3px', backgroundColor: '#FFFFF0', color: '#1a1a0e', fontSize: '0.95rem', outline: 'none', fontFamily: "'Nunito', sans-serif" }}
              />
            </div>
            {loginError && <p style={{ color: '#cc0000', fontSize: '0.85rem' }}>{loginError}</p>}
            <button
              onClick={handleLogin}
              style={{ backgroundColor: '#8B4513', color: '#FFFFE3', border: 'none', padding: '0.8rem', fontSize: '1rem', fontFamily: "'Nunito', sans-serif", fontWeight: 700, borderRadius: '3px', cursor: 'pointer' }}
            >
              Login →
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={{ backgroundColor: '#FFFFE3', minHeight: '100vh', padding: '2rem 1rem 4rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <p style={{ fontSize: '0.7rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#8B4513', fontWeight: 700, marginBottom: '0.2rem' }}>Admin Panel</p>
            <h1 className="display-font" style={{ fontSize: '1.8rem', color: '#1a1a0e' }}>Orders Dashboard</h1>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <button onClick={fetchOrders} style={{ backgroundColor: 'transparent', border: '1px solid #c8c89a', padding: '0.5rem 1rem', borderRadius: '3px', cursor: 'pointer', fontSize: '0.85rem', fontFamily: "'Nunito', sans-serif", color: '#3a3a2a', fontWeight: 600 }}>
              ↻ Refresh
            </button>
            <button onClick={() => setAuthed(false)} style={{ backgroundColor: '#8B4513', color: '#FFFFE3', border: 'none', padding: '0.5rem 1rem', borderRadius: '3px', cursor: 'pointer', fontSize: '0.85rem', fontFamily: "'Nunito', sans-serif", fontWeight: 600 }}>
              Logout
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          {[
            { label: 'Total Orders', value: orders.length, color: '#1a1a0e' },
            { label: 'Pending', value: orders.filter(o => o.status === 'pending').length, color: '#f57f17' },
            { label: 'Confirmed', value: orders.filter(o => o.status === 'confirmed').length, color: '#2e7d32' },
            { label: 'Shipped', value: orders.filter(o => o.status === 'shipped').length, color: '#1565c0' },
          ].map(stat => (
            <div key={stat.label} className="book-page" style={{ borderRadius: '4px', padding: '1rem 1.2rem' }}>
              <p style={{ fontSize: '0.7rem', color: '#7a7a5a', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.3rem' }}>{stat.label}</p>
              <p className="display-font" style={{ fontSize: '2rem', color: stat.color, fontWeight: 700 }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          {['all', 'pending', 'confirmed', 'shipped'].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              style={{
                padding: '0.4rem 1rem', borderRadius: '3px', cursor: 'pointer', fontSize: '0.82rem',
                fontFamily: "'Nunito', sans-serif", fontWeight: 600, textTransform: 'capitalize',
                border: filterStatus === s ? '1px solid #8B4513' : '1px solid #c8c89a',
                backgroundColor: filterStatus === s ? '#8B4513' : '#FFFFF0',
                color: filterStatus === s ? '#FFFFE3' : '#3a3a2a',
              }}>
              {s === 'all' ? 'All Orders' : s}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="book-page" style={{ borderRadius: '4px', padding: '3rem', textAlign: 'center' }}>
            <p style={{ color: '#7a7a5a', fontStyle: 'italic' }}>Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="book-page" style={{ borderRadius: '4px', padding: '3rem', textAlign: 'center' }}>
            <p style={{ color: '#7a7a5a', fontStyle: 'italic' }}>No orders found.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {filteredOrders.map(order => {
              const sc = statusColor(order.status);
              return (
                <div key={order.id} className="book-page" style={{ borderRadius: '4px', padding: '1.2rem 1.5rem 1.2rem 2.5rem', cursor: 'pointer' }}
                  onClick={() => setSelectedOrder(order)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: '1rem', color: '#1a1a0e', marginBottom: '0.2rem' }}>{order.name}</p>
                      <p style={{ fontSize: '0.82rem', color: '#7a7a5a' }}>{order.email} · {order.phone}</p>
                      <p style={{ fontSize: '0.82rem', color: '#7a7a5a', marginTop: '0.2rem' }}>{order.city}, {order.state} - {order.pincode}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p className="display-font" style={{ fontSize: '1.3rem', color: '#8B4513', fontWeight: 700 }}>₹{order.total}</p>
                      <span style={{ 
                        fontSize: '0.72rem', padding: '0.2rem 0.6rem', borderRadius: '20px',
                        backgroundColor: sc.bg, color: sc.color, border: `1px solid ${sc.border}`,
                        fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em'
                      }}>
                        {order.status}
                      </span>
                      <p style={{ fontSize: '0.72rem', color: '#aaa', marginTop: '0.3rem' }}>
                        {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '1rem' }}>
          <div className="book-page" style={{ borderRadius: '6px', padding: '2rem', maxWidth: '560px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 className="display-font" style={{ fontSize: '1.4rem', color: '#1a1a0e' }}>Order Details</h2>
              <button onClick={() => setSelectedOrder(null)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#7a7a5a' }}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem' }}>
              {[
                ['Name', selectedOrder.name],
                ['Phone', selectedOrder.phone],
                ['Email', selectedOrder.email],
                ['Address', selectedOrder.address],
                ['City', selectedOrder.city],
                ['State', selectedOrder.state],
                ['Pincode', selectedOrder.pincode],
                ['Book Price', `₹${selectedOrder.book_price}`],
                ['Courier Fee', `₹${selectedOrder.courier_fee}`],
                ['Total', `₹${selectedOrder.total}`],
                ['Ordered On', new Date(selectedOrder.created_at).toLocaleString('en-IN')],
              ].map(([label, value]) => (
                <div key={label} style={{ display: 'flex', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.8rem', color: '#7a7a5a', minWidth: '90px', fontWeight: 600 }}>{label}:</span>
                  <span style={{ fontSize: '0.85rem', color: '#1a1a0e' }}>{value}</span>
                </div>
              ))}
            </div>

            {/* Screenshot */}
            {selectedOrder.screenshot_url && (
              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ fontSize: '0.78rem', fontWeight: 700, color: '#3a3a2a', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Payment Screenshot</p>
                <a href={selectedOrder.screenshot_url} target="_blank" rel="noopener noreferrer">
                  <img src={selectedOrder.screenshot_url} alt="Payment screenshot" style={{ maxWidth: '100%', borderRadius: '4px', border: '1px solid #c8c89a' }} />
                </a>
              </div>
            )}

            {/* Status Update */}
            <div>
              <p style={{ fontSize: '0.78rem', fontWeight: 700, color: '#3a3a2a', marginBottom: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Update Status</p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {['pending', 'confirmed', 'shipped', 'cancelled'].map(s => {
                  const sc = statusColor(s);
                  return (
                    <button key={s} onClick={() => updateStatus(selectedOrder.id, s)}
                      disabled={updating === selectedOrder.id}
                      style={{
                        padding: '0.4rem 0.9rem', borderRadius: '3px', cursor: 'pointer',
                        fontSize: '0.8rem', fontFamily: "'Nunito', sans-serif", fontWeight: 700,
                        textTransform: 'capitalize', transition: 'all 0.15s',
                        border: selectedOrder.status === s ? `2px solid ${sc.color}` : `1px solid ${sc.border}`,
                        backgroundColor: selectedOrder.status === s ? sc.bg : '#FFFFF0',
                        color: sc.color,
                      }}>
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
