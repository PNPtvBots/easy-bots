
import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { createHmac } from 'crypto';
import { paymentNotification, PaymentNotificationInput } from '@/ai/flows/payment-notification';
import { saveTransaction, updateTransactionStatus } from '@/lib/firebase';

const pKey = process.env.EPAYCO_P_KEY;
const publicKey = process.env.EPAYCO_PUBLIC_KEY;
const p_cust_id_cliente = process.env.EPAYCO_P_CUST_ID;


export async function POST(request: NextRequest) {
  if (!pKey || !publicKey || !p_cust_id_cliente) {
    console.error('Epayco public, private, or customer ID keys are not set.');
    return new NextResponse('Internal Server Error: Webhook secret not configured.', { status: 500 });
  }
  
  const rawBody = await request.text();
  const data = new URLSearchParams(rawBody);

  const signature = data.get('x_signature');
  if (!signature) {
    return new NextResponse('Bad Request: Missing x_signature.', { status: 400 });
  }

  const x_ref_payco = data.get('x_ref_payco');
  const x_transaction_id = data.get('x_transaction_id');
  const x_amount = data.get('x_amount');
  const x_currency_code = data.get('x_currency_code');
  const x_cod_transaction_state = data.get('x_cod_transaction_state');
  
  const signatureString = `${p_cust_id_cliente}^${pKey}^${x_ref_payco}^${x_transaction_id}^${x_amount}^${x_currency_code}`;
  const expectedSignature = createHmac('sha256', pKey).update(signatureString).digest('hex');

  if (signature !== expectedSignature) {
    console.error('Invalid Epayco signature.', { received: signature, expected: expectedSignature });
    return new NextResponse('Unauthorized: Invalid signature.', { status: 401 });
  }
  
  try {
    const orderId = data.get('x_extra1'); 
    const userId = data.get('x_extra2'); 
    const productId = data.get('x_extra3');

    if (!orderId || !userId || !productId) {
        console.error('Missing extra fields from Epayco webhook.');
        return new NextResponse('Bad Request: Missing required transaction data.', { status: 400 });
    }

    const transactionData = {
      orderId: orderId,
      productId: productId,
      userId: userId,
      amount: parseFloat(data.get('x_amount') || '0'),
      currency: data.get('x_currency_code'),
      status: x_cod_transaction_state === '1' ? 'PAID' : (x_cod_transaction_state === '3' ? 'PENDING' : 'FAILED'),
      reference: data.get('x_ref_payco'),
      customerName: data.get('x_customer_name') || 'N/A',
      customerEmail: data.get('x_customer_email') || 'N/A',
      customerPhone: data.get('x_customer_phone') || 'N/A',
    };

    if (data.get('x_cod_response') === '1') { // 1 = Transaction Approved
        await saveTransaction(transactionData);

        const notificationInput: PaymentNotificationInput = {
            ...transactionData,
            customerPhone: transactionData.customerPhone || 'N/A',
        };
        await paymentNotification(notificationInput);
        console.log(`AI notification flow triggered for order ${orderId}`);

    } else { // Handle other statuses (declined, pending, etc.)
        await updateTransactionStatus(transactionData.orderId, transactionData.status, transactionData.userId);
    }
    
    return new NextResponse('OK', { status: 200 });

  } catch (error) {
    console.error('Error processing Epayco webhook:', error);
    if (error instanceof Error) {
        return new NextResponse(`Internal Server Error: ${error.message}`, { status: 500 });
    }
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

