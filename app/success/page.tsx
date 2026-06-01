"use client";
import Link from "next/link";

export default function SuccessPage() {
  return (
    <main style={{ backgroundColor: '#FFFFE3', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem' }}>
      <div style={{ maxWidth: '520px', width: '100%' }}>
        <div style={{ border: '2px solid #000000', borderRadius: '0px', padding: '3.5rem 2.5rem', textAlign: 'center', backgroundColor: '#FFFFE3' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1.25rem' }}>📖</div>
          <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#7a7a5a', marginBottom: '0.5rem', fontWeight: 800 }}>
            Order Received
          </p>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#000000', marginBottom: '1.25rem', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
            You&apos;re on the list!
          </h1>
          <p style={{ fontSize: '1rem', lineHeight: 1.7, color: '#2a2a2a', marginBottom: '2rem' }}>
            Your pre-order has been received. We will verify your payment details and send a confirmation email to you shortly.
          </p>

          <div style={{ 
            border: '1px solid #000000', 
            padding: '1.25rem 1.5rem', 
            backgroundColor: '#FFFFE3',
            marginBottom: '2rem',
            textAlign: 'left'
          }}>
            <p style={{ fontSize: '0.95rem', color: '#000000', lineHeight: 1.6, margin: 0, fontWeight: 600 }}>
              📦 Your book will be shipped from Kozhikode in the <strong>2nd week of June</strong>. You will receive your tracking details via email.
            </p>
          </div>

          <blockquote style={{ 
            borderLeft: '4px solid #000000', paddingLeft: '1.25rem',
            textAlign: 'left', marginBottom: '2.5rem',
            fontStyle: 'italic', color: '#000000', fontSize: '1rem', lineHeight: 1.6,
            fontWeight: 600
          }}>
            &ldquo;Progress does not come from waiting. It comes from building.&rdquo;
          </blockquote>

          <Link href="/" style={{
            display: 'inline-block',
            backgroundColor: '#000000',
            color: '#FFFFE3',
            textDecoration: 'none',
            fontSize: '0.9rem',
            fontWeight: 800,
            padding: '0.8rem 2rem',
            borderRadius: '0px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            transition: 'all 0.2s ease'
          }} className="hover-cta">
            &larr; Back to Home
          </Link>
        </div>
        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#7a7a5a', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>— Welcome to the first generation of Creative Constructors —</p>
      </div>
    </main>
  );
}
