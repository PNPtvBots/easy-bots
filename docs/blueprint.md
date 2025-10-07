# **App Name**: EasyBots Store

## Core Features:

- Product Display and Purchase: Showcase EasyBots' four products with 'Buy' buttons for USD and COP currencies, integrating with Bold Checkout for web transactions.
- Mobile Applink Integration: Incorporate buttons that redirect users to the Bold Applink (Android only) for mobile purchases, enhancing mobile accessibility.
- Webhook Event Listener: Implement a webhook listener for Bold.co events ('order.paid', 'order.cancelled'), validating signatures with a secret key to ensure secure data handling.
- Transaction Data Storage: Store transaction details in Firestore, including orderId, productId, userId, amount, currency, status, reference, timestamps, and customer information for reliable record-keeping.
- Conditional Notifications Tool: Leverage a generative AI tool that monitors incoming data and sends WhatsApp notifications via Twilio when a payment is completed. This feature uses a tool.

## Style Guidelines:

- Primary color: Use a vibrant blue (#29ABE2) to evoke trust and reliability, aligning with the professional services offered by EasyBots.
- Background color: Employ a light gray (#F0F0F0) to provide a clean, neutral backdrop that highlights product information.
- Accent color: Implement a bright orange (#FF9500) for call-to-action buttons, drawing attention to key interactive elements.
- Body and headline font: 'Inter' (sans-serif) provides a clean, modern and neutral style.