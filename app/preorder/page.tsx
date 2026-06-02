"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const KERALA_STATES = ["Kerala"];

export default function PreOrderPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isKerala = KERALA_STATES.includes(form.state);
  const courierFee = form.state ? (isKerala ? 70 : 100) : 0;
  const total = 299 + courierFee;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setScreenshot(file);
    const reader = new FileReader();
    reader.onload = () => setScreenshotPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
  ];

  const handleSubmit = async () => {
    setError("");
    if (!form.name || !form.phone || !form.email || !form.address || !form.state || !form.pincode) {
      setError("Please fill all fields.");
      return;
    }
    if (!screenshot) {
      setError("Please upload your payment screenshot.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      formData.append("screenshot", screenshot);
      formData.append("bookPrice", "299");
      formData.append("courierFee", String(courierFee));
      formData.append("total", String(total));

      const res = await fetch("/api/preorder", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      
      router.push("/success");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ backgroundColor: '#FFFFE3', minHeight: '100vh', padding: '3rem 1.5rem 5rem' }}>
      <div style={{ maxWidth: '620px', margin: '0 auto' }}>
        
        {/* Back Link */}
        <a href="/" style={{ 
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          color: '#1a1a0e', textDecoration: 'none', fontSize: '0.85rem',
          marginBottom: '2rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          &larr; Back to Home
        </a>

        {/* Outer Form Box: clean border, no page effect */}
        <div style={{ 
          border: '2px solid #1a1a0e', 
          padding: '2.5rem', 
          backgroundColor: '#FFFFE3',
          borderRadius: '0px'
        }}>
          <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#7a7a5a', marginBottom: '0.5rem', fontWeight: 800 }}>
            Secure Your Copy
          </p>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#1a1a0e', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            Pre-Order Form
          </h1>
          <p style={{ fontSize: '0.95rem', color: '#3a3a2a', marginBottom: '2rem', lineHeight: 1.5 }}>
            Fill in your details, scan the UPI QR code to pay, and upload your payment screenshot.
          </p>

          {/* Form Fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {[
              { label: 'Full Name', name: 'name', type: 'text', placeholder: 'Your full name' },
              { label: 'Phone Number', name: 'phone', type: 'tel', placeholder: '10-digit mobile number' },
              { label: 'Email Address', name: 'email', type: 'email', placeholder: 'your@email.com' },
            ].map(field => (
              <div key={field.name}>
                <label style={{ 
                  display: 'block', fontSize: '0.75rem', fontWeight: 800, 
                  color: '#1a1a0e', marginBottom: '0.5rem', letterSpacing: '0.05em',
                  textTransform: 'uppercase'
                }}>
                  {field.label}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={form[field.name as keyof typeof form]}
                  onChange={handleChange}
                  style={{
                    width: '100%', padding: '0.8rem 1rem',
                    border: '1px solid #1a1a0e', borderRadius: '0px',
                    backgroundColor: '#FFFFE3', color: '#1a1a0e',
                    fontSize: '0.95rem', outline: 'none',
                  }}
                />
              </div>
            ))}

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#1a1a0e', marginBottom: '0.5rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Delivery Address
              </label>
              <textarea
                name="address"
                placeholder="House/flat no, street, area..."
                value={form.address}
                onChange={handleChange}
                rows={3}
                style={{
                  width: '100%', padding: '0.8rem 1rem',
                  border: '1px solid #1a1a0e', borderRadius: '0px',
                  backgroundColor: '#FFFFE3', color: '#1a1a0e',
                  fontSize: '0.95rem', outline: 'none', resize: 'vertical',
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#1a1a0e', marginBottom: '0.5rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>City</label>
                <input
                  type="text" name="city" placeholder="Your city"
                  value={form.city} onChange={handleChange}
                  style={{ width: '100%', padding: '0.8rem 1rem', border: '1px solid #1a1a0e', borderRadius: '0px', backgroundColor: '#FFFFE3', color: '#1a1a0e', fontSize: '0.95rem', outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#1a1a0e', marginBottom: '0.5rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Pincode</label>
                <input
                  type="text" name="pincode" placeholder="6-digit pincode"
                  value={form.pincode} onChange={handleChange}
                  style={{ width: '100%', padding: '0.8rem 1rem', border: '1px solid #1a1a0e', borderRadius: '0px', backgroundColor: '#FFFFE3', color: '#1a1a0e', fontSize: '0.95rem', outline: 'none' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#1a1a0e', marginBottom: '0.5rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>State</label>
              <select
                name="state" value={form.state} onChange={handleChange}
                style={{ width: '100%', padding: '0.8rem 1rem', border: '1px solid #1a1a0e', borderRadius: '0px', backgroundColor: '#FFFFE3', color: '#1a1a0e', fontSize: '0.95rem', outline: 'none' }}
              >
                <option value="">Select your state</option>
                {indianStates.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Price Summary */}
          {form.state && (
            <div style={{ 
              border: '1px solid #1a1a0e', padding: '1.25rem 1.5rem',
              backgroundColor: '#FFFFE3', marginTop: '1.5rem'
            }}>
              <p style={{ fontSize: '0.75rem', color: '#D97706', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 800, marginBottom: '0.8rem' }}>Order Summary</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.95rem', color: '#3a3a2a' }}>Book Price</span>
                <span style={{ fontSize: '0.95rem', color: '#1a1a0e', fontWeight: 700 }}>₹299</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                <span style={{ fontSize: '0.95rem', color: '#3a3a2a' }}>Courier ({isKerala ? 'Kerala' : 'Outside Kerala'})</span>
                <span style={{ fontSize: '0.95rem', color: '#1a1a0e', fontWeight: 700 }}>₹{courierFee}</span>
              </div>
              <div style={{ borderTop: '1px solid #1a1a0e', paddingTop: '0.6rem', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.95rem', color: '#1a1a0e', fontWeight: 800 }}>Total to Pay</span>
                <span style={{ fontSize: '1.25rem', color: '#1D4ED8', fontWeight: 800 }}>₹{total}</span>
              </div>
            </div>
          )}

          {/* QR Code Container */}
          <div style={{ 
            marginTop: '2rem', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            gap: '1rem' 
          }}>
            <p style={{ 
              fontSize: '0.75rem', 
              fontWeight: 800, 
              color: '#1a1a0e', 
              textTransform: 'uppercase', 
              letterSpacing: '0.05em',
              margin: 0
            }}>
              Scan to Pay {form.state ? `₹${total}` : ''}
            </p>
            
            <div style={{ 
              display: 'inline-block', 
              border: '1px solid rgba(26,26,14,0.15)', 
              padding: '0.75rem', 
              backgroundColor: '#ffffff',
              borderRadius: '0px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}>
              <Image 
                src="/qr.png" 
                alt="UPI QR Code" 
                width={180} 
                height={180} 
                style={{ display: 'block' }} 
              />
            </div>

            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <p style={{ fontSize: '0.9rem', color: '#1a1a0e', fontWeight: 700, margin: 0 }}>
                UPI ID: <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>hadimehthash2023@oksbi</span>
              </p>
              <p style={{ fontSize: '0.9rem', color: '#1a1a0e', fontWeight: 700, margin: 0 }}>
                UPI Number: <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>9656324645</span>
              </p>
              <p style={{ fontSize: '0.75rem', color: '#7a7a5a', fontWeight: 600, marginTop: '0.4rem', margin: 0 }}>
                Pay exact amount shown above
              </p>
            </div>
          </div>

          {/* Payment Proof Screenshot Upload */}
          <div style={{ marginTop: '2rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#1a1a0e', marginBottom: '0.5rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Upload Payment Screenshot
            </label>
            <div
              onClick={() => fileRef.current?.click()}
              style={{
                border: '2px dashed #1a1a0e',
                borderRadius: '0px', padding: '1.5rem',
                textAlign: 'center', cursor: 'pointer',
                backgroundColor: screenshotPreview ? '#fdfdf7' : '#FFFFE3',
                transition: 'all 0.2s'
              }}
            >
              {screenshotPreview ? (
                <div>
                  <img src={screenshotPreview} alt="Screenshot" style={{ maxHeight: '150px', borderRadius: '0px', margin: '0 auto', display: 'block', border: '1px solid #1a1a0e' }} />
                  <p style={{ fontSize: '0.85rem', color: '#1D4ED8', marginTop: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>✓ Screenshot Selected</p>
                </div>
              ) : (
                <div>
                  <p style={{ fontSize: '1.5rem', marginBottom: '0.4rem', margin: 0 }}>📸</p>
                  <p style={{ fontSize: '0.9rem', color: '#1a1a0e', fontWeight: 700, margin: '0.4rem 0 0 0' }}>Click to Upload Screenshot</p>
                  <p style={{ fontSize: '0.75rem', color: '#7a7a5a', marginTop: '0.2rem', margin: 0 }}>JPG or PNG files accepted</p>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
          </div>

          {error && (
            <div style={{ 
              marginTop: '1.5rem', padding: '0.8rem 1rem',
              backgroundColor: '#fff0f0', border: '2px solid #cc0000',
              borderRadius: '0px', color: '#cc0000', fontSize: '0.85rem',
              fontWeight: 700
            }}>
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              marginTop: '2rem',
              width: '100%', padding: '1.1rem',
              backgroundColor: loading ? '#555544' : '#1a1a0e',
              color: '#FFFFE3', border: 'none',
              fontSize: '1rem',
              fontWeight: 800, borderRadius: '0px',
              cursor: loading ? 'not-allowed' : 'pointer',
              letterSpacing: '0.08em', textTransform: 'uppercase',
              transition: 'all 0.2s'
            }}
            className="hover-cta"
          >
            {loading ? 'Submitting...' : 'Submit Pre-Order →'}
          </button>

          <p style={{ fontSize: '0.75rem', color: '#7a7a5a', textAlign: 'center', marginTop: '1rem', fontWeight: 600 }}>
            Orders are reviewed and confirmed via email within 24 hours.
          </p>
        </div>
      </div>
    </main>
  );
}
