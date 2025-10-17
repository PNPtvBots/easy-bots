
import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { createHmac } from 'crypto';
import { paymentNotification, PaymentNotificationInput } from '@/ai/flows/payment-notification';
import { saveTransaction, updateTransactionStatus } from '@/lib/firebase';

const pKey = process.env.EPAYCO_P_KEY;
const publicKey = process.env.EPAYCO_PUBLIC_KEY;

export async function POST(request: NextRequest) {
  if (!pKey || !publicKey) {
    console.error('Epayco public or private keys are not set.');
    return new NextResponse('Internal Server Error: Webhook secret not configured.', { status: 500 });
  }
  
  const rawBody = await request.text();
  const data = new URLSearchParams(rawBody);

  const signature = data.get('x_signature');
  if (!signature) {
    return new NextResponse('Bad Request: Missing x_signature.', { status: 400 });
  }

  const p_cust_id_cliente = process.env.EPAYCO_P_CUST_ID;
  const p_key = process.env.EPAYCO_P_KEY;
  const x_ref_payco = data.get('x_ref_payco');
  const x_transaction_id = data.get('x_transaction_id');
  const x_amount = data.get('x_amount');
  const x_currency_code = data.get('x_currency_code');
  
  const signatureString = `${p_cust_id_cliente}^${p_key}^${x_ref_payco}^${x_transaction_id}^${x_amount}^${x_currency_code}`;
  const expectedSignature = createHmac('sha256', pKey).update(signatureString).digest('hex');

  if (signature !== expectedSignature) {
    console.error('Invalid Epayco signature.', { received: signature, expected: expectedSignature });
    return new NextResponse('Unauthorized: Invalid signature.', { status: 401 });
  }
  
  try {
    const transactionStatus = data.get('x_transaction_state');
    const orderId = data.get('x_extra1'); // We passed our internal orderId here
    const userId = data.get('x_extra2'); // We passed our userId here
    const productId = data.get('x_extra3'); // We passed our productId here

    const transactionData = {
      orderId: orderId,
      productId: productId,
      userId: userId,
      amount: parseFloat(data.get('x_amount') || '0'),
      currency: data.get('x_currency_code'),
      status: data.get('x_cod_transaction_state') === '1' ? 'PAID' : (data.get('x_cod_transaction_state') === '3' ? 'PENDING' : 'FAILED'),
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
    
    return NextResponse.json({ success: true, message: 'Webhook received and processed.' });

  } catch (error) {
    console.error('Error processing Epayco webhook:', error);
    if (error instanceof Error) {
        return new NextResponse(`Internal Server Error: ${error.message}`, { status: 500 });
    }
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
