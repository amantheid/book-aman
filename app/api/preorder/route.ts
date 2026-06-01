import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

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

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
