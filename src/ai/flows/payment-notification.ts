'use server';
/**
 * @fileOverview A payment notification AI agent.
 *
 * - paymentNotification - A function that handles the payment notification process.
 * - PaymentNotificationInput - The input type for the paymentNotification function.
 * - PaymentNotificationOutput - The return type for the paymentNotification function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PaymentNotificationInputSchema = z.object({
  orderId: z.string().describe('The ID of the order.'),
  productId: z.string().describe('The ID of the product.'),
  userId: z.string().describe('The ID of the user.'),
  amount: z.number().describe('The amount paid.'),
  currency: z.string().describe('The currency used for the payment.'),
  status: z.string().describe('The status of the payment.'),
  reference: z.string().describe('The payment reference.'),
  customerName: z.string().describe('The name of the customer.'),
  customerPhone: z.string().describe('The phone number of the customer.'),
});
export type PaymentNotificationInput = z.infer<typeof PaymentNotificationInputSchema>;

const PaymentNotificationOutputSchema = z.object({
  notificationSent: z.boolean().describe('Whether the notification was sent successfully.'),
  message: z.string().describe('The message sent to the admin.'),
});
export type PaymentNotificationOutput = z.infer<typeof PaymentNotificationOutputSchema>;

const sendWhatsAppNotification = ai.defineTool(
  {
    name: 'sendWhatsAppNotification',
    description: 'Sends a WhatsApp notification to the store admin about a completed payment.',
    inputSchema: z.object({
      message: z.string().describe('The message to send via WhatsApp.'),
      phoneNumber: z.string().describe('The phone number to send the WhatsApp message to.  Must be in E.164 format (e.g., +14155552671).'),
    }),
    outputSchema: z.boolean().describe('Whether the WhatsApp notification was sent successfully.'),
  },
  async (input) => {
    // TODO: Implement the Twilio integration here.
    // This is a placeholder implementation. Replace with actual Twilio API call.
    console.log(`Sending WhatsApp notification to admin: ${input.message}`);
    console.log(`Sending WhatsApp notification to phone number: ${input.phoneNumber}`);
    return true; // Assume success for now.
  }
);

export async function paymentNotification(input: PaymentNotificationInput): Promise<PaymentNotificationOutput> {
  return paymentNotificationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'paymentNotificationPrompt',
  input: {schema: PaymentNotificationInputSchema},
  output: {schema: PaymentNotificationOutputSchema},
  tools: [sendWhatsAppNotification],
  prompt: `A payment has been completed.
Order ID: {{{orderId}}}
Product ID: {{{productId}}}
User ID: {{{userId}}}
Amount: {{{amount}}}
Currency: {{{currency}}}
Status: {{{status}}}
Reference: {{{reference}}}
Customer Name: {{{customerName}}}
Customer Phone: {{{customerPhone}}}

Based on this information, create a concise WhatsApp notification message to inform the store admin about the completed payment. Then, use the sendWhatsAppNotification tool to send the message to the admin. The admin's phone number is +14155552671.  The message should be tailored for a store administrator.

Ensure that the message is informative and includes key details such as order ID, amount, and customer name. Make it suitable for immediate action by the administrator.
`,
});

const paymentNotificationFlow = ai.defineFlow(
  {
    name: 'paymentNotificationFlow',
    inputSchema: PaymentNotificationInputSchema,
    outputSchema: PaymentNotificationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    //console.log("Prompt Output", output)

    //If prompt does not return output, return default values
    if(!output){
      return {
        notificationSent: false,
        message: "",
      }
    }

    return output!;
  }
);
