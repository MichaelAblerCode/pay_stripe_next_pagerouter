// pages/api/checkout_sessions.js
import { allPaymentMethods, stripe } from '../../lib/stripe';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Access the selected payment method from form data
  let paymentMethod = req.body.paymentMethod;
  switch (paymentMethod) {
    case 'card':
    case 'klarna':
    case 'paypal':
      paymentMethod = [paymentMethod];
      break;
    default:
      paymentMethod = allPaymentMethods;
  }

  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      payment_method_types: ['card', 'paypal', 'klarna'],
      //      payment_method_types: [paymentMethod],
      mode: 'payment',
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/?canceled=true`,
    });

    // Redirect directly to Stripe Checkout
    return res.redirect(303, session.url);
  } catch (err) {
    console.error('Stripe error:', err.message);
    return res.status(err.statusCode || 500).json({ error: err.message });
  }
}
