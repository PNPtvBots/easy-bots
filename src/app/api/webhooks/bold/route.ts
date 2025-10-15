
import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { createHmac } from 'crypto';
import { paymentNotification, PaymentNotificationInput } from '@/ai/flows/payment-notification';
import { saveTransaction, updateTransactionStatus } from '@/lib/firebase';

const secret = process.env.BOLD_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  if (!secret) {
    console.error('BOLD_WEBHOOK_SECRET is not set.');
    return new NextResponse('Internal Server Error: Webhook secret not configured.', { status: 500 });
  }

  const signature = request.headers.get('x-bold-signature');
  if (!signature) {
    return new NextResponse('Bad Request: Missing x-bold-signature header.', { status: 400 });
  }

  const rawBody = await request.text();

  const hmac = createHmac('sha256', secret);
  hmac.update(rawBody);
  const expectedSignature = hmac.digest('hex');

  if (signature !== expectedSignature) {
    return new NextResponse('Unauthorized: Invalid signature.', { status: 401 });
  }

  try {
    const event = JSON.parse(rawBody);

    const { event: eventType, data } = event;

    // Helper function to extract data, now including customer info from top level
    const extractTransactionData = (d: any) => {
        const metadata = d.payment_method?.metadata || {};
        const customer = d.customer || {};
        
        return {
            orderId: d.reference,
            productId: metadata.productId || 'unknown',
            userId: metadata.userId || 'anonymous',
            amount: d.amount_in_cents / 100,
            currency: d.currency,
            status: d.status,
            reference: d.reference,
            customerName: customer.name || 'N/A',
            customerEmail: customer.email || 'N/A',
            customerPhone: customer.phone_number || 'N/A',
        };
    };

    switch (eventType) {
      case 'transaction.created': {
        console.log('Processing new transaction:', data.id);
        
        const newTransactionData = extractTransactionData(data);
        if (newTransactionData.userId !== 'anonymous') {
            await saveTransaction(newTransactionData);
        } else {
            console.log('Skipping transaction save for anonymous user.');
        }

        if (newTransactionData.status === 'PAID') {
            const notificationInput: PaymentNotificationInput = {
              ...newTransactionData,
              customerPhone: newTransactionData.customerPhone || 'N/A',
            };
            await paymentNotification(notificationInput);
            console.log(`AI notification flow triggered for order ${data.reference}`);
        }
        
        break;
      }
      case 'transaction.updated': {
        console.log('Processing transaction update:', data.id);
        
        const updatedTransactionData = extractTransactionData(data);
        if (updatedTransactionData.userId !== 'anonymous') {
            await updateTransactionStatus(updatedTransactionData.orderId, updatedTransactionData.status, updatedTransactionData.userId);
        } else {
            console.log(`Skipping transaction update for anonymous user on order ${updatedTransactionData.orderId}.`);
        }
        
         if (updatedTransactionData.status === 'PAID') {
            const notificationInput: PaymentNotificationInput = {
                ...updatedTransactionData,
                customerPhone: updatedTransactionData.customerPhone || 'N/A',
            };

            await paymentNotification(notificationInput);
            console.log(`AI notification flow triggered for updated order ${data.reference}`);
        }
        break;
      }
      default:
        console.log(`Received unhandled event type: ${eventType}`);
    }

    return NextResponse.json({ success: true, message: 'Webhook received and processed.' });

  } catch (error) {
    console.error('Error processing webhook:', error);
    if (error instanceof Error) {
        return new NextResponse(`Internal Server Error: ${error.message}`, { status: 500 });
    }
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
