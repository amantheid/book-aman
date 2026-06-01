import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(req: NextRequest) {
  const auth = req.headers.get('x-admin-auth');
  if (auth !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ orders: data });
}

export async function PATCH(req: NextRequest) {
  const auth = req.headers.get('x-admin-auth');
  if (auth !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id, status } = await req.json();

  // Fetch the existing order details to check previous status and gather email parameters
  const { data: order, error: fetchError } = await supabaseAdmin
    .from('orders')
    .select('*')
    .eq('id', id)
    .single();

  if (fetchError || !order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  // Update order status in database
  const { error: updateError } = await supabaseAdmin
    .from('orders')
    .update({ status })
    .eq('id', id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  // Resend configuration & Sandbox validation
  const senderEmail = process.env.SENDER_EMAIL || 'Creative Constructor <onboarding@resend.dev>';
  const isSandbox = senderEmail.includes('onboarding@resend.dev');
  const recipient = isSandbox ? 'amantheid@gmail.com' : order.email;
  const subjectPrefix = isSandbox ? '[TEST COPY] ' : '';

  // Case 1: Order is confirmed
  if (status === 'confirmed' && order.status !== 'confirmed') {
    const customerConfirmedEmailHtml = `
      <div style="background-color: #FFFFE3; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 3rem 2rem; color: #1a1a0e; max-width: 600px; margin: 0 auto; border: 2px solid #1a1a0e;">
        <p style="font-size: 0.75rem; font-weight: 800; letter-spacing: 0.15em; text-transform: uppercase; color: #7a7a5a; margin: 0 0 1rem 0;">Aman Muhammed</p>
        <h1 style="font-size: 2.2rem; font-weight: 900; letter-spacing: -0.03em; color: #000000; margin: 0 0 1.5rem 0; line-height: 1.1;">Your Order is Confirmed! 🎉</h1>
        <p style="font-size: 1.05rem; line-height: 1.6; color: #2a2a2a; margin-bottom: 2rem;">
          Great news! We have verified your payment, and your pre-order is officially confirmed.
        </p>

        <div style="background-color: #000000; color: #FFFFE3; padding: 1.5rem 2rem; text-align: center; margin-bottom: 2rem;">
          <p style="font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 0.5rem 0; color: #a0a07a;">Expected Shipping</p>
          <p style="font-size: 1.3rem; font-weight: 800; margin: 0;">Second Week of June</p>
        </div>
        
        <div style="border-top: 1px solid rgba(0,0,0,0.1); border-bottom: 1px solid rgba(0,0,0,0.1); padding: 1.5rem 0; margin-bottom: 2rem;">
          <h3 style="font-size: 0.85rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 1rem 0;">Order Summary</h3>
          <p style="font-size: 0.95rem; margin: 0 0 0.5rem 0;"><strong>Name:</strong> ${order.name}</p>
          <p style="font-size: 0.95rem; margin: 0 0 0.5rem 0;"><strong>Address:</strong> ${order.address}, ${order.city || ''} ${order.state} - ${order.pincode}</p>
          <p style="font-size: 0.95rem; margin: 0 0 0.5rem 0;"><strong>Amount Paid:</strong> ₹${order.total}</p>
        </div>
        
        <div style="text-align: center; margin: 3rem 0 1.5rem;">
          <p style="font-size: 1.25rem; font-weight: 800; letter-spacing: -0.02em; color: #000000; margin: 0 0 0.5rem 0;">Start Small. Stay Consistent. Build Impact.</p>
        </div>

        <p style="font-size: 0.8rem; color: #7a7a5a; text-align: center; margin-top: 3rem; border-top: 1px solid rgba(0,0,0,0.05); padding-top: 1.5rem;">
          &copy; ${new Date().getFullYear()} Aman Muhammed. All rights reserved.
        </p>
      </div>
    `;

    try {
      const response = await resend.emails.send({
        from: senderEmail,
        to: recipient,
        subject: `${subjectPrefix}Your Order is Confirmed! 🎉`,
        html: customerConfirmedEmailHtml
      });
      if (response.error) {
        console.error('Resend customer confirmation email error:', response.error);
      } else {
        console.log('Customer confirmation email sent successfully. ID:', response.data?.id);
      }
    } catch (err) {
      console.error('Error sending customer order confirmation email:', err);
    }
  }

  // Case 2: Order is cancelled
  if (status === 'cancelled' && order.status !== 'cancelled') {
    const customerCancelledEmailHtml = `
      <div style="background-color: #FFFFE3; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 3rem 2rem; color: #1a1a0e; max-width: 600px; margin: 0 auto; border: 2px solid #1a1a0e;">
        <p style="font-size: 0.75rem; font-weight: 800; letter-spacing: 0.15em; text-transform: uppercase; color: #7a7a5a; margin: 0 0 1rem 0;">Aman Muhammed</p>
        <h1 style="font-size: 2.0rem; font-weight: 900; letter-spacing: -0.02em; color: #000000; margin: 0 0 1.5rem 0; line-height: 1.15;">Update on Your Pre-Order</h1>
        
        <p style="font-size: 1.05rem; line-height: 1.6; color: #2a2a2a; margin-bottom: 1.5rem;">
          Dear ${order.name},
        </p>
        <p style="font-size: 1.05rem; line-height: 1.6; color: #2a2a2a; margin-bottom: 1.5rem;">
          Thank you for your interest in pre-ordering <strong>The 21 Days That Built a Creative Constructor</strong>.
        </p>
        <p style="font-size: 1.05rem; line-height: 1.6; color: #2a2a2a; margin-bottom: 1.5rem;">
          We are writing to inform you that your pre-order status has been updated to <strong>cancelled</strong>. This generally happens when we are unable to verify the transaction details or matching payment screenshot uploaded during the order.
        </p>
        <p style="font-size: 1.05rem; line-height: 1.6; color: #2a2a2a; margin-bottom: 2rem;">
          If this was unintentional or if you would like to try placing your pre-order again, please visit the website to re-submit your details. We would be glad to receive your order!
        </p>

        <div style="text-align: center; margin: 2.5rem 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://book.aman'}" style="display: inline-block; background-color: #000000; color: #FFFFE3; padding: 1.1rem 2.2rem; text-decoration: none; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; font-size: 0.9rem;">
            Visit Pre-Order Site &rarr;
          </a>
        </div>

        <p style="font-size: 1.05rem; line-height: 1.6; color: #2a2a2a; margin-bottom: 2rem;">
          If you have already paid and believe this cancellation was a mistake, please reply directly to this email or send us a message at amantheid@gmail.com with your transaction reference. We will assist you as soon as possible.
        </p>
        
        <p style="font-size: 0.8rem; color: #7a7a5a; text-align: center; margin-top: 3rem; border-top: 1px solid rgba(0,0,0,0.05); padding-top: 1.5rem;">
          &copy; ${new Date().getFullYear()} Aman Muhammed. All rights reserved.
        </p>
      </div>
    `;

    try {
      const response = await resend.emails.send({
        from: senderEmail,
        to: recipient,
        subject: `${subjectPrefix}Update on Your Pre-Order`,
        html: customerCancelledEmailHtml
      });
      if (response.error) {
        console.error('Resend customer cancellation email error:', response.error);
      } else {
        console.log('Customer cancellation email sent successfully. ID:', response.data?.id);
      }
    } catch (err) {
      console.error('Error sending customer cancellation email:', err);
    }
  }

  return NextResponse.json({ success: true });
}
