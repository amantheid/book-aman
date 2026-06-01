import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const email = formData.get('email') as string;
    const address = formData.get('address') as string;
    const city = formData.get('city') as string;
    const state = formData.get('state') as string;
    const pincode = formData.get('pincode') as string;
    const bookPrice = formData.get('bookPrice') as string;
    const courierFee = formData.get('courierFee') as string;
    const total = formData.get('total') as string;
    const screenshot = formData.get('screenshot') as File;

    if (!name || !phone || !email || !address || !state || !pincode || !screenshot) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Upload screenshot to Supabase Storage
    const fileExt = screenshot.name.split('.').pop() || 'jpg';
    const fileName = `${Date.now()}-${phone}.${fileExt}`;
    const fileBuffer = await screenshot.arrayBuffer();

    const { error: uploadError } = await supabaseAdmin.storage
      .from('screenshots')
      .upload(fileName, fileBuffer, { contentType: screenshot.type });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return NextResponse.json({ error: 'Failed to upload screenshot' }, { status: 500 });
    }

    const { data: urlData } = supabaseAdmin.storage
      .from('screenshots')
      .getPublicUrl(fileName);

    const screenshotUrl = urlData.publicUrl;

    // Get order number (current count + 1)
    let orderNumber = 1;
    try {
      const { count, error: countError } = await supabaseAdmin
        .from('orders')
        .select('*', { count: 'exact', head: true });
      if (!countError && count !== null) {
        orderNumber = count + 1;
      }
    } catch (err) {
      console.error('Error fetching order count:', err);
    }

    // Insert order into database
    const { error: insertError } = await supabaseAdmin
      .from('orders')
      .insert([{
        name,
        phone,
        email,
        address,
        city,
        state,
        pincode,
        book_price: parseInt(bookPrice),
        courier_fee: parseInt(courierFee),
        total: parseInt(total),
        screenshot_url: screenshotUrl,
        status: 'pending',
        created_at: new Date().toISOString(),
      }]);

    if (insertError) {
      console.error('Insert error:', insertError);
      return NextResponse.json({ error: 'Failed to save order' }, { status: 500 });
    }

    // Email 1 — Send customer confirmation email immediately
    const customerEmailHtml = `
      <div style="background-color: #FFFFE3; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 3rem 2rem; color: #1a1a0e; max-width: 600px; margin: 0 auto; border: 2px solid #1a1a0e;">
        <p style="font-size: 0.75rem; font-weight: 800; letter-spacing: 0.15em; text-transform: uppercase; color: #7a7a5a; margin: 0 0 1rem 0;">Aman Muhammed</p>
        <h1 style="font-size: 2.2rem; font-weight: 900; letter-spacing: -0.03em; color: #000000; margin: 0 0 1.5rem 0; line-height: 1.1;">Your Pre-Order is Received! 📖</h1>
        <p style="font-size: 1.05rem; line-height: 1.6; color: #2a2a2a; margin-bottom: 2rem;">
          Thank you for pre-ordering <strong>The 21 Days That Built a Creative Constructor</strong>. We have received your order details and payment screenshot. Our team will verify the payment and confirm shortly.
        </p>
        
        <div style="border-top: 1px solid rgba(0,0,0,0.1); border-bottom: 1px solid rgba(0,0,0,0.1); padding: 1.5rem 0; margin-bottom: 2rem;">
          <h3 style="font-size: 0.85rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 1rem 0;">Delivery Details</h3>
          <p style="font-size: 0.95rem; margin: 0 0 0.5rem 0;"><strong>Name:</strong> ${name}</p>
          <p style="font-size: 0.95rem; margin: 0 0 0.5rem 0;"><strong>Address:</strong> ${address}, ${city || ''} ${state} - ${pincode}</p>
        </div>
        
        <div style="background-color: rgba(0,0,0,0.02); padding: 1.25rem 1.5rem; border: 1px solid #1a1a0e;">
          <h3 style="font-size: 0.85rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 1rem 0; color: #7a7a5a;">Order Summary</h3>
          <table style="width: 100%; font-size: 0.95rem; border-collapse: collapse;">
            <tr>
              <td style="padding: 0.25rem 0;">Book Price</td>
              <td style="text-align: right; font-weight: 700; padding: 0.25rem 0;">₹${bookPrice}</td>
            </tr>
            <tr>
              <td style="padding: 0.25rem 0;">Courier Fee</td>
              <td style="text-align: right; font-weight: 700; padding: 0.25rem 0;">₹${courierFee}</td>
            </tr>
            <tr style="border-top: 1px solid rgba(0,0,0,0.1);">
              <td style="padding: 0.5rem 0; font-size: 1.1rem; font-weight: 800;">Total Paid</td>
              <td style="text-align: right; padding: 0.5rem 0; font-size: 1.1rem; font-weight: 800;">₹${total}</td>
            </tr>
          </table>
        </div>
        
        <p style="font-size: 0.8rem; color: #7a7a5a; text-align: center; margin-top: 3rem; border-top: 1px solid rgba(0,0,0,0.05); padding-top: 1.5rem;">
          &copy; ${new Date().getFullYear()} Aman Muhammed. All rights reserved.
        </p>
      </div>
    `;

    try {
      await resend.emails.send({
        from: 'Creative Constructor <onboarding@resend.dev>',
        to: email,
        subject: 'Your Pre-Order is Received! 📖',
        html: customerEmailHtml
      });
      console.log('Customer pre-order received email sent successfully.');
    } catch (err) {
      console.error('Error sending customer confirmation email:', err);
    }

    // Email 3 — Send admin notification email
    const adminEmailHtml = `
      <div style="font-family: sans-serif; padding: 2rem; color: #1a1a0e; max-width: 600px; margin: 0 auto; border: 1px solid #ccc;">
        <h2>New Book Order #${orderNumber}</h2>
        <p>A new pre-order has been placed on the website.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 1.5rem;">
          <tr>
            <td style="padding: 0.5rem; border: 1px solid #ddd; font-weight: bold; width: 150px;">Customer Name</td>
            <td style="padding: 0.5rem; border: 1px solid #ddd;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 0.5rem; border: 1px solid #ddd; font-weight: bold;">Phone</td>
            <td style="padding: 0.5rem; border: 1px solid #ddd;">${phone}</td>
          </tr>
          <tr>
            <td style="padding: 0.5rem; border: 1px solid #ddd; font-weight: bold;">Email</td>
            <td style="padding: 0.5rem; border: 1px solid #ddd;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 0.5rem; border: 1px solid #ddd; font-weight: bold;">Address</td>
            <td style="padding: 0.5rem; border: 1px solid #ddd;">${address}, ${city || ''} ${state} - ${pincode}</td>
          </tr>
          <tr>
            <td style="padding: 0.5rem; border: 1px solid #ddd; font-weight: bold;">Amount Paid</td>
            <td style="padding: 0.5rem; border: 1px solid #ddd;">₹${total} (Book: ₹${bookPrice} + Courier: ₹${courierFee})</td>
          </tr>
          <tr>
            <td style="padding: 0.5rem; border: 1px solid #ddd; font-weight: bold;">Total Orders Count</td>
            <td style="padding: 0.5rem; border: 1px solid #ddd;">${orderNumber}</td>
          </tr>
        </table>
        
        <div style="margin-top: 2rem;">
          <p><strong>Payment Screenshot:</strong></p>
          <a href="${screenshotUrl}" target="_blank" style="display: inline-block; background-color: #1a1a0e; color: #fff; padding: 0.75rem 1.5rem; text-decoration: none; font-weight: bold; border-radius: 4px;">View Screenshot</a>
        </div>
      </div>
    `;

    try {
      await resend.emails.send({
        from: 'Creative Constructor <onboarding@resend.dev>',
        to: 'amantheid@gmail.com',
        subject: `New Book Order #${orderNumber}`,
        html: adminEmailHtml
      });
      console.log('Admin notification email sent successfully.');
    } catch (err) {
      console.error('Error sending admin notification email:', err);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
