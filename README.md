# Stripe Checkout Example with Next.js

This project demonstrates a simple e-commerce checkout flow using Stripe for payment processing, integrated with Next.js. It allows users to select from multiple payment methods (Credit/Debit Card, PayPal, Klarna) and complete a purchase via Stripe's Checkout.

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

Create a `.env.local` file in the root directory:

```bash
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxx
STRIPE_PRICE_ID=price_xxxxxxxxxxxxxxxxxxxxxxxx
```

### Installation

```bash
git clone https://github.com/your-username/stripe-checkout-example.git
cd stripe-checkout-example
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
├── lib/
│   └── stripe.js           # Stripe initialization
├── pages/
│   ├── api/
│   │   └── checkout_sessions.js  # Checkout API route
│   ├── success.js          # Success page
│   └── index.js            # Homepage with form
├── .env.local             # Environment variables
└── package.json
```

## How It Works

### Homepage (/)

- Displays payment method selection
- Form submits to `/api/checkout_sessions`

### Checkout Session Creation

- Validates POST request
- Creates Stripe Checkout session
- Redirects to Stripe Checkout page

### Success Page (/success)

- Verifies session completion
- Shows confirmation message
- Handles error states

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
// filepath: pages/api/webhooks/stripe.js
import { buffer } from 'micro';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];

  try {
    const event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      // Process the successful payment
      console.log(`Payment completed for session ${session.id}`);
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err.message);
    res.status(400).json({ error: 'Webhook Error' });
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

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature-name`)
3. Commit changes (`git commit -m "Add feature"`)
4. Push to branch (`git push origin feature-name`)
5. Open a Pull Request

## License

MIT License - feel free to use and modify for your projects.
