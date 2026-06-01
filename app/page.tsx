"use client";
import { useState } from "react";
import Link from "next/link";

const faqs = [
  {
    q: "When will I receive my book?",
    a: "The first edition ships in the 2nd week of June. You will receive a confirmation email once your payment is verified."
  },
  {
    q: "What is the price?",
    a: "The book is ₹299. Courier charges are extra — ₹70 within Kerala and ₹100 outside Kerala."
  },
  {
    q: "How do I pay?",
    a: "Scan the UPI QR code shown on the order page and pay the exact total. Then upload your payment screenshot on the same page."
  },
  {
    q: "How will I know my order is confirmed?",
    a: "Once we verify your payment screenshot manually, a confirmation email will be sent to you."
  },
  {
    q: "How many copies are available?",
    a: "Only 100 copies in the first edition. Several are already reserved. Once sold out, the next batch may take time to arrive."
  },
  {
    q: "Who is this book for?",
    a: "Students, young entrepreneurs, creators, and dreamers — anyone who feels they are meant for something bigger."
  },
  {
    q: "Can I cancel my order?",
    a: "Since this is a limited first edition pre-order, cancellations are not possible once payment is made."
  },
  {
    q: "Is this book only available online?",
    a: "Yes, the first edition is exclusively available through this website as a pre-order."
  },
  {
    q: "What language is the book in?",
    a: "The book is written in English."
  },
  {
    q: "Who is the author?",
    a: "Aman Muhammed — a 16-year-old student entrepreneur from Kerala who believes age should never limit ambition."
  }
];

export default function Home() {
  const [showOrder, setShowOrder] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <main style={{ backgroundColor: '#FFFFE3', minHeight: '100vh', color: '#1a1a0e' }}>
      {/* Navigation / Header */}
      <header style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2.5rem 1.5rem 0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ fontWeight: 800, fontSize: '0.95rem', letterSpacing: '0.1em', color: '#1a1a0e' }}>
          AMAN MUHAMMED
        </div>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', color: '#7a7a5a', textTransform: 'uppercase' }}>
          First Edition &middot; 100 Copies
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ overflow: 'hidden' }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '4rem 1.5rem 6rem 1.5rem',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.25fr) minmax(0, 1fr)',
          gap: '4rem',
          alignItems: 'center',
        }} className="hero-grid">
          
          {/* Left Column: Typography & CTA */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }} className="hero-text">
            {/* Author / Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <p style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                color: '#7a7a5a',
                margin: 0
              }}>
                Aman Muhammed
              </p>
              <p style={{
                fontSize: '0.7rem',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: '#a0a07a',
                margin: 0
              }}>
                Founder &bull; Student &bull; Entrepreneur
              </p>
            </div>

            {/* Title & Tagline */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h1 style={{
                fontSize: 'clamp(2.2rem, 4.5vw, 3.8rem)',
                lineHeight: 1.05,
                fontWeight: 800,
                letterSpacing: '-0.03em',
                color: '#1a1a0e',
                margin: 0,
              }}>
                The 21 Days <br className="desktop-only" />
                That Built a <br />
                <span style={{ color: '#D97706' }}>CREATIVE</span> <br />
                <span style={{ color: '#1D4ED8' }}>CONSTRUCTOR</span>
              </h1>
              
              <p style={{
                fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                lineHeight: 1.4,
                fontWeight: 500,
                color: '#3a3a2a',
                margin: 0,
                maxWidth: '480px'
              }}>
                How a 15-Year-Old Built Skills, Systems and Momentum From Zero
              </p>
            </div>

            {/* Price & CTA */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }} className="cta-container">
              <button
                onClick={() => setShowOrder(true)}
                style={{
                  backgroundColor: '#1a1a0e',
                  color: '#FFFFE3',
                  border: 'none',
                  padding: '1.2rem 2.2rem',
                  fontSize: '1rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  transition: 'all 0.2s ease',
                  borderRadius: '0px',
                  width: '100%',
                  maxWidth: '340px',
                  textAlign: 'center'
                }}
                className="hover-cta"
              >
                Pre-Order Now &mdash; ₹299
              </button>
              <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center', color: '#7a7a5a', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                <span>₹299 Only</span>
                <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#c8c89a' }} />
                <span>Kerala: +₹70 Delivery</span>
                <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#c8c89a' }} />
                <span>Rest of India: +₹100</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Book Mockup */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
          }} className="hero-image-container">
            <div style={{
              width: '100%',
              maxWidth: '500px',
              position: 'relative',
              transition: 'transform 0.3s ease',
            }} className="book-mockup-wrapper">
              <img
                src="/book-mockup.jpg"
                alt="The 21 Days That Built a Creative Constructor"
                fetchPriority="high"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  transform: 'scale(1.06)',
                  mixBlendMode: 'multiply',
                }}
              />
            </div>
          </div>

        </div>
      </section>

      {/* Book Goals Section */}
      <section style={{ backgroundColor: '#FFFFE3', borderTop: '1px solid rgba(26,26,14,0.08)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '6rem 1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }} className="features-grid">
            <div>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#1a1a0e', margin: '0 0 1.5rem 0' }}>
                What happens when you decide to <span style={{ color: '#D97706', fontStyle: 'italic' }}>build</span>?
              </h2>
              <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: '#3a3a2a', margin: '0 0 1rem 0' }}>
                Most people spend their lives consuming. Watching. Scrolling. Waiting.
              </p>
              <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: '#3a3a2a', margin: '0 0 1rem 0' }}>
                Written by student entrepreneur <strong>Aman Muhammed</strong>, this book documents a transformative 21-day journey that changed the way he thought, learned, worked, and lived.
              </p>
            </div>
            
            <div style={{
              border: '2px solid #1a1a0e',
              padding: '2.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              backgroundColor: '#FFFFE3'
            }} className="features-box">
              <h3 style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#1a1a0e', margin: 0 }}>
                This book will help you
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {[
                  'Develop productive habits & increase focus',
                  'Think bigger about your future',
                  'Take action on your ideas',
                  'Build confidence through execution',
                  'Become more creative and proactive',
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.8rem' }}>
                    <span style={{ color: '#D97706', fontWeight: 'bold' }}>&rarr;</span>
                    <p style={{ fontSize: '0.95rem', color: '#3a3a2a', margin: 0, fontWeight: 600 }}>{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why 21 Days Section */}
      <section style={{ backgroundColor: '#FFFFE3', borderTop: '1px solid rgba(26,26,14,0.08)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '6rem 1.5rem' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#1a1a0e', marginBottom: '1.5rem' }}>
            Why 21 Days?
          </h2>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: '#3a3a2a', marginBottom: '1.5rem' }}>
            21 days is widely known as the time required to begin building a habit. Three weeks. Twenty-one opportunities to improve. Twenty-one opportunities to prove to yourself that change is possible.
          </p>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: '#3a3a2a', marginBottom: '2rem' }}>
            This book is intentionally designed to be <em>highly readable</em> — even if you are someone who normally doesn&apos;t read books. By the time you finish, reading itself becomes a habit.
          </p>
          <blockquote style={{ 
            borderLeft: '4px solid #1a1a0e', 
            paddingLeft: '1.5rem', 
            margin: '2rem 0',
            color: '#1a1a0e',
            fontStyle: 'italic',
            fontSize: '1.15rem',
            lineHeight: 1.7,
            fontWeight: 500
          }}>
            &ldquo;A ship in a harbour is safe, but that&apos;s not what ships are built for.&rdquo;
          </blockquote>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: '#3a3a2a', margin: 0 }}>
            The same is true for people. You were not built to remain comfortable.
          </p>
        </div>
      </section>

      {/* The Identity Section */}
      <section style={{ backgroundColor: '#FFFFE3', borderTop: '1px solid rgba(26,26,14,0.08)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '6rem 1.5rem' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#1a1a0e', marginBottom: '1.5rem' }}>
            What is a <span style={{ color: '#D97706' }}>Creative</span> <span style={{ color: '#1D4ED8' }}>Constructor</span>?
          </h2>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: '#3a3a2a', marginBottom: '2.5rem' }}>
            Most people consume what others create. A Creative Constructor <strong>creates what others consume.</strong> They share these core traits:
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="traits-grid">
            {[
              'Thinks independently',
              'Takes action on ideas',
              'Solves problems creatively',
              'Builds instead of complains',
              'Creates instead of waits',
              'Escapes comfort zones'
            ].map((trait, i) => (
              <div key={i} style={{ 
                border: '1px solid #1a1a0e', 
                padding: '1.2rem 1.5rem',
                backgroundColor: '#FFFFE3',
                fontSize: '0.95rem',
                fontWeight: 700,
                color: '#1a1a0e',
                display: 'flex',
                gap: '0.8rem',
                alignItems: 'center'
              }}>
                <span style={{ color: '#1D4ED8' }}>&#9632;</span>
                {trait}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Author Section */}
      <section style={{ backgroundColor: '#FFFFE3', borderTop: '1px solid rgba(26,26,14,0.08)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '6rem 1.5rem' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#1a1a0e', marginBottom: '0.5rem' }}>
            Aman Muhammed
          </h2>
          <p style={{ fontSize: '0.8rem', fontWeight: 800, color: '#7a7a5a', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2rem' }}>
            Author &bull; Student &bull; Entrepreneur
          </p>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: '#3a3a2a', marginBottom: '1.5rem' }}>
            Aman Muhammed believes that age should never limit ambition. Through entrepreneurship, learning, creativity, and continuous self-improvement, he aims to inspire young people to become builders rather than followers.
          </p>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: '#3a3a2a', margin: 0, fontStyle: 'italic' }}>
            &ldquo;The 21 Days That Built a Creative Constructor&rdquo; is his debut book and the beginning of a larger mission: to help people unlock their potential and build meaningful lives.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section style={{ backgroundColor: '#FFFFE3', borderTop: '1px solid rgba(26,26,14,0.08)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '6rem 1.5rem 8rem 1.5rem' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#1a1a0e', marginBottom: '2rem' }}>
            Frequently Asked Questions
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={index} style={{
                  borderBottom: '1px solid rgba(26, 26, 14, 0.15)',
                  padding: '1.5rem 0',
                }}>
                  <button
                    onClick={() => toggleFaq(index)}
                    style={{
                      width: '100%',
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem',
                      fontFamily: 'inherit',
                      outline: 'none'
                    }}
                  >
                    <h3 style={{
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      color: '#1a1a0e',
                      lineHeight: 1.4,
                      margin: 0,
                    }}>
                      {faq.q}
                    </h3>
                    <span style={{
                      fontSize: '1rem',
                      fontWeight: 800,
                      color: '#1a1a0e',
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                      flexShrink: 0
                    }}>
                      &darr;
                    </span>
                  </button>

                  <div style={{
                    maxHeight: isOpen ? '250px' : '0px',
                    overflow: 'hidden',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    opacity: isOpen ? 1 : 0,
                  }}>
                    <p style={{
                      fontSize: '0.98rem',
                      lineHeight: 1.7,
                      color: '#3a3a2a',
                      margin: '1rem 0 0 0',
                    }}>
                      {faq.a}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA Banner */}
      <section style={{ 
        backgroundColor: '#1a1a0e', 
        color: '#FFFFE3', 
        textAlign: 'center', 
        padding: '6rem 1.5rem',
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.02em', margin: '0 0 1rem 0', lineHeight: 1.15 }}>
            Start Small. Stay Consistent. <br /> Build Impact.
          </h2>
          <p style={{ fontSize: '1rem', color: '#a0a07a', margin: '0 0 2.5rem 0', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Only 100 copies available in the first batch.
          </p>
          <button
            onClick={() => setShowOrder(true)}
            style={{
              backgroundColor: '#FFFFE3',
              color: '#1a1a0e',
              border: 'none',
              padding: '1.2rem 3rem',
              fontSize: '1rem',
              fontWeight: 800,
              cursor: 'pointer',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              borderRadius: '0px',
              transition: 'all 0.2s ease'
            }}
            className="hover-cta-invert"
          >
            Pre-Order Now &mdash; ₹299
          </button>
        </div>
      </section>

      <footer style={{ backgroundColor: '#1a1a0e', borderTop: '1px solid rgba(255,255,227,0.1)', padding: '2rem 1.5rem', textAlign: 'center' }}>
        <p style={{ margin: 0, fontSize: '0.75rem', color: '#7a7a5a', letterSpacing: '0.05em' }}>
          &copy; {new Date().getFullYear()} Aman Muhammed. All rights reserved.
        </p>
      </footer>

      {/* Order Modal */}
      {showOrder && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(26,26,14,0.65)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 50, padding: '1rem',
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            backgroundColor: '#FFFFE3',
            border: '2px solid #1a1a0e',
            borderRadius: '0px',
            padding: '2.5rem',
            maxWidth: '480px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#1a1a0e', margin: 0 }}>Pre-Order Your Copy</h2>
              <button 
                onClick={() => setShowOrder(false)} 
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  fontSize: '1.5rem', 
                  cursor: 'pointer', 
                  color: '#1a1a0e',
                  fontWeight: 'bold',
                  padding: '0.2rem'
                }}
              >
                &times;
              </button>
            </div>
            
            <p style={{ fontSize: '0.95rem', color: '#3a3a2a', lineHeight: 1.6, marginBottom: '2rem' }}>
              Secure your copy of the limited first edition. Secure payment is handled via UPI transfer.
            </p>

            <Link href="/preorder" style={{
              display: 'block',
              backgroundColor: '#1a1a0e',
              color: '#FFFFE3',
              padding: '1.1rem',
              textAlign: 'center',
              textDecoration: 'none',
              fontWeight: 700,
              borderRadius: '0px',
              fontSize: '0.95rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              transition: 'all 0.2s'
            }} className="hover-cta">
              Go to Pre-Order Form &rarr;
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
