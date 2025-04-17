import Stripe from 'stripe';

export const allPaymentMethods = ['card', 'klarna', 'paypal'];

export const paymentMethods = [
  {
    id: 'card',
    label: 'Card Payment',
    description: 'Pay with Credit or Debit Card',
  },
  {
    id: 'paypal',
    label: 'PayPal',
    description: 'Pay with your PayPal account',
  },
  {
    id: 'klarna',
    label: 'Klarna',
    description: 'Pay later with Klarna',
  },
  {
    id: 'all',
    label: 'All Payment Methods',
    description: 'All payments',
  },
];

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
