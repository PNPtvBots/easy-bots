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
      case 'order.paid':
        console.log('Processing paid order:', data.orderId);
        
        // 1. Save transaction to Firestore
        const transactionData = {
          orderId: data.orderId,
          productId: data.metadata?.productId || 'unknown',
          userId: data.metadata?.userId || 'anonymous',
          amount: data.amount,
          currency: data.currency,
          status: 'PAID',
          reference: data.reference,
          customerName: data.customer?.name || 'N/A',
          customerPhone: data.customer?.phone || 'N/A',
        };
        await saveTransaction(transactionData);

        // 2. Trigger GenAI notification
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
        console.log(`AI notification flow triggered for order ${data.orderId}`);
        
        break;

      case 'order.cancelled':
        console.log('Processing cancelled order:', data.orderId);
        
        // 1. Update transaction status in Firestore
        // This assumes the document was already created on order creation.
        // If not, you might need a different logic (e.g., create if not exists).
        await updateTransactionStatus(data.orderId, 'CANCELLED');
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
