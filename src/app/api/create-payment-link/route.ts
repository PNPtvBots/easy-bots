
import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { products } from '@/lib/products';
import fetch from 'node-fetch';

const BOLD_API_URL = 'https://api.bold.co/v2/payment-links';
const BOLD_API_KEY = process.env.BOLD_API_KEY;

export async function POST(request: NextRequest) {
  if (!BOLD_API_KEY) {
    console.error('BOLD_API_KEY is not set.');
    return new NextResponse('Internal Server Error: API key not configured.', { status: 500 });
  }

  try {
    const { 
        productId, 
        currency, 
        userId,
        userEmail,
        userName,
        userPhone,
    } = await request.json();

    if (!productId || !currency || !userId) {
      return new NextResponse('Bad Request: Missing required parameters.', { status: 400 });
    }

    const product = products.find((p) => p.id === productId);
    if (!product) {
      return new NextResponse('Not Found: Product not found.', { status: 404 });
    }

    const amountInCents = Math.round((currency === 'USD' ? product.prices.usd : product.prices.cop) * 100);
    const orderId = `easybots-${productId}-${Date.now()}`;
    const description = `Payment for ${product.name}`;
    
    // The redirect URL after payment completion
    const baseUrl = request.nextUrl.origin;
    const redirectUrl = `${baseUrl}/?lang=${request.nextUrl.searchParams.get('lang') || 'en'}`;

    const paymentLinkRequest = {
      amount: amountInCents,
      currency: currency,
      orderId: orderId,
      description: description,
      redirectUrl: redirectUrl,
      paymentMethods: {
        metadata: {
          productId: productId,
          userId: userId
        }
      },
      customer: {
        email: userEmail,
        name: userName,
        phoneNumber: userPhone
      }
    };

    const boldResponse = await fetch(BOLD_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `x-api-key ${BOLD_API_KEY}`,
      },
      body: JSON.stringify(paymentLinkRequest),
    });

    if (!boldResponse.ok) {
        const errorBody = await boldResponse.text();
        console.error('Bold API Error:', errorBody);
        throw new Error(`Bold API request failed with status ${boldResponse.status}`);
    }

    const responseData = await boldResponse.json() as { data: { id: string, url: string }};
    const paymentLink = responseData.data.url;

    return NextResponse.json({ paymentLink });

  } catch (error) {
    console.error('Error creating payment link:', error);
    if (error instanceof Error) {
        return new NextResponse(`Internal Server Error: ${error.message}`, { status: 500 });
    }
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
