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

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Stop details modal from opening when clicking delete card button
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    try {
      const res = await fetch('/api/orders', {
        method: 'DELETE',
        headers: { 
          'x-admin-auth': ADMIN_SECRET,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        setOrders(prev => prev.filter(o => o.id !== id));
        if (selectedOrder?.id === id) setSelectedOrder(null);
      } else {
        alert("Failed to delete order.");
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert("Failed to delete order.");
    }
  };

  const filteredOrders = filterStatus === "all" ? orders : orders.filter(o => o.status === filterStatus);

  const statusColor = (s: string) => {
    if (s === 'confirmed') return { bg: '#e8f5e9', color: '#2e7d32', border: '#1a1a0e' };
    if (s === 'shipped') return { bg: '#e3f2fd', color: '#1565c0', border: '#1a1a0e' };
    if (s === 'pending') return { bg: '#fff8e1', color: '#f57f17', border: '#1a1a0e' };
    return { bg: '#fce4ec', color: '#c62828', border: '#1a1a0e' };
  };

  if (!authed) {
    return (
      <main style={{ backgroundColor: '#FFFFE3', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ border: '2px solid #1a1a0e', padding: '2.5rem', maxWidth: '400px', width: '100%', backgroundColor: '#FFFFE3', borderRadius: '0px' }}>
          <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#7a7a5a', marginBottom: '0.5rem', fontWeight: 800 }}>
            Restricted Area
          </p>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1a1a0e', marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>Admin Login</h1>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#1a1a0e', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</label>
              <input
                type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                placeholder="admin@email.com"
                style={{ width: '100%', padding: '0.8rem 1rem', border: '1px solid #1a1a0e', borderRadius: '0px', backgroundColor: '#FFFFE3', color: '#1a1a0e', fontSize: '0.95rem', outline: 'none' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#1a1a0e', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Password</label>
              <input
                type="password" value={loginPass} onChange={e => setLoginPass(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                placeholder="••••••••"
                style={{ width: '100%', padding: '0.8rem 1rem', border: '1px solid #1a1a0e', borderRadius: '0px', backgroundColor: '#FFFFE3', color: '#1a1a0e', fontSize: '0.95rem', outline: 'none' }}
              />
            </div>
            {loginError && <p style={{ color: '#cc0000', fontSize: '0.85rem', fontWeight: 700 }}>{loginError}</p>}
            <button
              onClick={handleLogin}
              style={{ backgroundColor: '#1a1a0e', color: '#FFFFE3', border: 'none', padding: '0.9rem', fontSize: '1rem', fontWeight: 800, borderRadius: '0px', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em' }}
              className="hover-cta"
            >
              Login &rarr;
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={{ backgroundColor: '#FFFFE3', minHeight: '100vh', padding: '3rem 1.5rem 5rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#7a7a5a', fontWeight: 800, marginBottom: '0.3rem' }}>Admin Panel</p>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#1a1a0e', letterSpacing: '-0.02em', margin: 0 }}>Orders Dashboard</h1>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <button onClick={fetchOrders} style={{ backgroundColor: 'transparent', border: '2px solid #1a1a0e', padding: '0.6rem 1.2rem', borderRadius: '0px', cursor: 'pointer', fontSize: '0.85rem', color: '#1a1a0e', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              ↻ Refresh
            </button>
            <button onClick={() => setAuthed(false)} style={{ backgroundColor: '#1a1a0e', color: '#FFFFE3', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '0px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }} className="hover-cta">
              Logout
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
          {[
            { label: 'Total Orders', value: orders.length, color: '#1a1a0e' },
            { label: 'Pending', value: orders.filter(o => o.status === 'pending').length, color: '#f57f17' },
            { label: 'Confirmed', value: orders.filter(o => o.status === 'confirmed').length, color: '#2e7d32' },
            { label: 'Shipped', value: orders.filter(o => o.status === 'shipped').length, color: '#1565c0' },
          ].map(stat => (
            <div key={stat.label} style={{ border: '2px solid #1a1a0e', padding: '1.5rem', backgroundColor: '#FFFFE3', borderRadius: '0px' }}>
              <p style={{ fontSize: '0.75rem', color: '#7a7a5a', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, marginBottom: '0.5rem', margin: 0 }}>{stat.label}</p>
              <p style={{ fontSize: '2.2rem', color: stat.color, fontWeight: 800, margin: 0, lineHeight: 1 }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filter Buttons */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {['all', 'pending', 'confirmed', 'shipped'].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              style={{
                padding: '0.5rem 1.2rem', borderRadius: '0px', cursor: 'pointer', fontSize: '0.85rem',
                fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em',
                border: '2px solid #1a1a0e',
                backgroundColor: filterStatus === s ? '#1a1a0e' : 'transparent',
                color: filterStatus === s ? '#FFFFE3' : '#1a1a0e',
                transition: 'all 0.15s ease'
              }}
              className={filterStatus !== s ? "hover-cta" : ""}
            >
              {s === 'all' ? 'All Orders' : s}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {loading ? (
          <div style={{ border: '2px solid #1a1a0e', padding: '4rem', textAlign: 'center', backgroundColor: '#FFFFE3' }}>
            <p style={{ color: '#7a7a5a', fontStyle: 'italic', margin: 0 }}>Loading orders from Supabase...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div style={{ border: '2px solid #1a1a0e', padding: '4rem', textAlign: 'center', backgroundColor: '#FFFFE3' }}>
            <p style={{ color: '#7a7a5a', fontStyle: 'italic', margin: 0 }}>No orders found.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredOrders.map(order => {
              const sc = statusColor(order.status);
              return (
                <div key={order.id} style={{ border: '2px solid #1a1a0e', padding: '1.5rem', cursor: 'pointer', backgroundColor: '#FFFFE3', transition: 'transform 0.15s' }}
                  onClick={() => setSelectedOrder(order)}
                  className="hover-card"
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <p style={{ fontWeight: 800, fontSize: '1.1rem', color: '#1a1a0e', margin: '0 0 0.4rem 0' }}>{order.name}</p>
                      <p style={{ fontSize: '0.85rem', color: '#3a3a2a', margin: 0 }}>{order.email} &bull; {order.phone}</p>
                      <p style={{ fontSize: '0.85rem', color: '#7a7a5a', marginTop: '0.3rem', margin: 0 }}>{order.city}, {order.state} - {order.pincode}</p>
                    </div>
                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem' }}>
                      <p style={{ fontSize: '1.4rem', color: '#1a1a0e', fontWeight: 800, margin: 0 }}>₹{order.total}</p>
                      <span style={{ 
                        fontSize: '0.72rem', padding: '0.3rem 0.8rem', borderRadius: '0px',
                        backgroundColor: sc.bg, color: '#1a1a0e', border: `1px solid ${sc.border}`,
                        fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em'
                      }}>
                        {order.status}
                      </span>
                      <p style={{ fontSize: '0.75rem', color: '#7a7a5a', margin: '0 0 0.4rem 0' }}>
                        {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                      <button
                        onClick={(e) => handleDelete(order.id, e)}
                        style={{
                          backgroundColor: '#cc0000',
                          color: '#FFFFE3',
                          border: 'none',
                          padding: '0.4rem 0.8rem',
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          cursor: 'pointer',
                        }}
                      >
                        Delete
                      </button>
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
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(26,26,14,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '1rem', backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: '#FFFFE3', border: '2px solid #1a1a0e', borderRadius: '0px', padding: '2.5rem', maxWidth: '560px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1a1a0e', letterSpacing: '-0.02em', margin: 0 }}>Order Details</h2>
              <button onClick={() => setSelectedOrder(null)} style={{ background: 'none', border: 'none', fontSize: '1.8rem', cursor: 'pointer', color: '#1a1a0e', fontWeight: 'bold', padding: 0 }}>&times;</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
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
                ['Total Paid', `₹${selectedOrder.total}`],
                ['Ordered On', new Date(selectedOrder.created_at).toLocaleString('en-IN')],
              ].map(([label, value]) => (
                <div key={label} style={{ display: 'flex', borderBottom: '1px solid rgba(26,26,14,0.06)', paddingBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.82rem', color: '#7a7a5a', minWidth: '110px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.02em' }}>{label}:</span>
                  <span style={{ fontSize: '0.9rem', color: '#1a1a0e', fontWeight: 600 }}>{value}</span>
                </div>
              ))}
            </div>

            {/* Screenshot */}
            {selectedOrder.screenshot_url && (
              <div style={{ marginBottom: '2rem' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#1a1a0e', marginBottom: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Payment Screenshot</p>
                <a href={selectedOrder.screenshot_url} target="_blank" rel="noopener noreferrer">
                  <img src={selectedOrder.screenshot_url} alt="Payment screenshot" style={{ maxWidth: '100%', borderRadius: '0px', border: '2px solid #1a1a0e' }} />
                </a>
              </div>
            )}

            {/* Status Update & Delete */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem', borderTop: '2px solid #1a1a0e', paddingTop: '1.5rem' }}>
              <div>
                <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#1a1a0e', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Update Status</p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {['pending', 'confirmed', 'shipped', 'cancelled'].map(s => {
                    const sc = statusColor(s);
                    return (
                      <button key={s} onClick={() => updateStatus(selectedOrder.id, s)}
                        disabled={updating === selectedOrder.id}
                        style={{
                          padding: '0.5rem 1rem', borderRadius: '0px', cursor: 'pointer',
                          fontSize: '0.8rem', fontWeight: 800,
                          textTransform: 'uppercase', letterSpacing: '0.05em', transition: 'all 0.15s',
                          border: selectedOrder.status === s ? '2px solid #1a1a0e' : `1px solid rgba(26,26,14,0.25)`,
                          backgroundColor: selectedOrder.status === s ? sc.bg : 'transparent',
                          color: '#1a1a0e',
                        }}
                        className={selectedOrder.status !== s ? "hover-cta" : ""}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>
              
              <button
                onClick={(e) => handleDelete(selectedOrder.id, e)}
                style={{
                  backgroundColor: '#cc0000',
                  color: '#FFFFE3',
                  border: 'none',
                  padding: '0.6rem 1.2rem',
                  borderRadius: '0px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
                className="hover-cta"
              >
                Delete Order
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
