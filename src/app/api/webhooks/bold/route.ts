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

    // Assuming a structure for the event payload.
    // Adjust based on actual Bold.co webhook structure.
    const { event: eventType, data } = event;

    switch (eventType) {
      case 'transaction.created': // Or whatever the correct event is for a new transaction
        console.log('Processing new transaction:', data.id);
        
        // 1. Save transaction to Firestore
        const transactionData = {
          orderId: data.reference, // Assuming reference holds the order id
          productId: data.payment_method.metadata?.productId || 'unknown',
          userId: data.payment_method.metadata?.userId || 'anonymous',
          amount: data.amount_in_cents / 100,
          currency: data.currency,
          status: data.status,
          reference: data.reference,
          customerName: data.customer.name || 'N/A',
          customerPhone: data.customer.phone_number || 'N/A',
        };
        await saveTransaction(transactionData);

        // 2. Trigger GenAI notification if payment is successful
        if (data.status === 'PAID') {
            const notificationInput: PaymentNotificationInput = {
              orderId: transactionData.orderId,
              productId: transactionData.productId,
              userId: transactionData.userId,
              amount: transactionData.amount,
              currency: transactionData.currency,
              status: transactionData.status,
              reference: transactionData.reference,
              customerName: transactionData.customerName,
              customerPhone: transactionData.customerPhone,
            };

            await paymentNotification(notificationInput);
            console.log(`AI notification flow triggered for order ${data.reference}`);
        }
        
        break;

      case 'transaction.updated':
        console.log('Processing transaction update:', data.id);
        
        // 1. Update transaction status in Firestore
        await updateTransactionStatus(data.reference, data.status);
        
        // 2. Potentially trigger notification if it just got paid
         if (data.status === 'PAID') {
            const notificationInput: PaymentNotificationInput = {
              orderId: data.reference,
              productId: data.payment_method.metadata?.productId || 'unknown',
              userId: data.payment_method.metadata?.userId || 'anonymous',
              amount: data.amount_in_cents / 100,
              currency: data.currency,
              status: data.status,
              reference: data.reference,
              customerName: data.customer.name || 'N/A',
              customerPhone: data.customer.phone_number || 'N/A',
            };

            await paymentNotification(notificationInput);
            console.log(`AI notification flow triggered for updated order ${data.reference}`);
        }
        break;

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
