# Stripe Checkout Example with Next.js (Page Router)

This project demonstrates a simple e-commerce checkout flow using Stripe for payment processing, integrated with Next.js using the Page Router. It allows users to select from multiple payment methods (Credit/Debit Card, PayPal, Klarna) and complete a purchase via Stripe's Checkout.

## Features

- Multiple Payment Methods: Credit/Debit Card, PayPal, and Klarna via Stripe Checkout
- Dynamic Payment Selection: Choose specific payment method or allow all available methods
- Success and Cancel Handling: Proper redirect handling for payment completion or cancellation
- Error Handling: Graceful handling of Stripe API errors and invalid session IDs
- Responsive UI: Simple, user-friendly interface for selecting payment methods

## Prerequisites

- Node.js (v14.x or higher)
- Stripe Account (for API keys)
- Stripe CLI (optional, for webhook testing)
- Git

## Setup

### Environment Variables

Create a `.env.local` file in the root directory and add API keys of your Stripe Account :

```bash
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxx
STRIPE_PRICE_ID=price_xxxxxxxxxxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxxxx
```

### Installation

```bash
git clone https://github.com/MichaelAblerCode/pay_stripe_next_pagerouter.git
cd pay_stripe_next_pagerouter
npm install
```

### Running the Application

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

## Project Structure

```
stripe-checkout-example/
├── pages/
│   ├── api/
│   │   ├── checkout_sessions.js  # API route for creating Checkout sessions
│   │   └── webhooks/
│   │       └── stripe.js        # Webhook endpoint for Stripe events
│   ├── success.js              # Success page after payment completion
│   └── index.js                # Homepage with payment method selection form
├── lib/
│   └── stripe.js               # Stripe initialization and configuration
├── .env.local                 # Environment variables
└── package.json
```

## How It Works

### Homepage (/)

- Located at `pages/index.js`
- Displays payment method selection form
- Submits to `/api/checkout_sessions`

### Checkout Session Creation

- Located at `pages/api/checkout_sessions.js`
- Validates POST request
- Creates Stripe Checkout session
- Redirects to Stripe Checkout page

### Success Page (/success)

- Located at `pages/success.js`
- Verifies session completion
- Shows confirmation message
- Handles error states

## Stripe Test Cards

| Card Number         | Brand | Expiry     | CVV          | Scenario           |
| ------------------- | ----- | ---------- | ------------ | ------------------ |
| 4242 4242 4242 4242 | Visa  | Any future | Any 3 digits | Success            |
| 4000 0000 0000 0002 | Visa  | Any future | Any 3 digits | Declined           |
| 4000 0000 0000 9995 | Visa  | Any future | Any 3 digits | Insufficient funds |
| 4000 0000 0000 3220 | Visa  | Any future | Any 3 digits | 3D Secure required |

## Important: Payment Reliability

### Why Implement Webhooks

The current redirect-based success confirmation isn't fully reliable because:

- Users might close browser before redirect
- Network issues could prevent redirect
- Success page could be bypassed

### Webhook Implementation

1. **Register Webhook in Stripe Dashboard**

   - Add endpoint URL
   - Select `checkout.session.completed` event

2. **Local Testing with Stripe CLI**

```bash
stripe listen --forward-to http://localhost:3000/api/webhooks/stripe
```

3. **Create Webhook Endpoint**

```javascript
// filepath: app/api/webhooks/stripe/route.js
import { buffer } from 'micro';
import Stripe from 'stripe';
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req) {
  const buf = await buffer(req);
  const sig = req.headers.get('stripe-signature');

  try {
    const event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      console.log(`Payment completed for session ${session.id}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    console.error('Webhook error:', err.message);
    return NextResponse.json({ error: 'Webhook Error' }, { status: 400 });
  }
}
```

4. **Add Webhook Secret**

```bash
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxxxx
```

5. **Test Webhook**

```bash
stripe trigger checkout.session.completed
```

## Troubleshooting

- Invalid API Key: Verify STRIPE_SECRET_KEY matches Stripe Dashboard
- Webhook Errors: Check STRIPE_WEBHOOK_SECRET and Stripe Dashboard logs
- Payment Failures: Use appropriate test cards to simulate scenarios
- Localhost Issues: Use Stripe CLI for local webhook testing

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature-name`)
3. Commit changes (`git commit -m "Add feature"`)
4. Push to branch (`git push origin feature-name`)
5. Open a Pull Request

## License

MIT License - feel free to use and modify for your projects.
