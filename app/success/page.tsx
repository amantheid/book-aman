"use client";
import Link from "next/link";

export default function SuccessPage() {
  return (
    <main style={{ backgroundColor: '#FFFFE3', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '520px', width: '100%' }}>
        <div className="book-page" style={{ borderRadius: '4px', padding: '3rem 3rem 3rem 4rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📖</div>
          <p style={{ fontSize: '0.7rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#8B4513', marginBottom: '0.8rem', fontWeight: 700 }}>
            Order Received
          </p>
          <h1 className="display-font" style={{ fontSize: '1.8rem', color: '#1a1a0e', marginBottom: '1rem' }}>
            You&apos;re on the list!
          </h1>
          <p style={{ fontSize: '0.95rem', lineHeight: 1.8, color: '#3a3a2a', marginBottom: '1.5rem' }}>
            Your pre-order has been received. We will verify your payment and send a confirmation to your email shortly.
          </p>

          <div style={{ 
            border: '1px solid #c8c89a', borderRadius: '4px', 
            padding: '1rem', backgroundColor: '#FFFFF0',
            marginBottom: '2rem'
          }}>
            <p style={{ fontSize: '0.85rem', color: '#5a3a1a', lineHeight: 1.7 }}>
              📦 Your book will be shipped from Kozhikode in the <strong>2nd week of June</strong>. You will receive your tracking details via email.
            </p>
          </div>

          <blockquote style={{ 
            borderLeft: '3px solid #8B4513', paddingLeft: '1rem',
            textAlign: 'left', marginBottom: '2rem',
            fontStyle: 'italic', color: '#5a3a1a', fontSize: '0.95rem', lineHeight: 1.7
          }}>
            &ldquo;Progress does not come from waiting. It comes from building.&rdquo;
          </blockquote>

          <Link href="/" style={{
            display: 'inline-block',
            color: '#8B4513', textDecoration: 'none',
            fontSize: '0.9rem', fontFamily: "'Nunito', sans-serif",
            fontWeight: 700, border: '1px solid #8B4513',
            padding: '0.6rem 1.5rem', borderRadius: '3px'
          }}>
            ← Back to Home
          </Link>
        </div>
        <p className="page-number" style={{ textAlign: 'center', marginTop: '1rem', color: '#7a7a5a' }}>— Welcome to the first generation of Creative Constructors —</p>
      </div>
    </main>
  );
}
