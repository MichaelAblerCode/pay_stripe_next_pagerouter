// pages/success.js
import { stripe } from '../lib/stripe';

export async function getServerSideProps(context) {
  const { session_id } = context.query;
  console.log('session_id:', session_id); // Debugging line
  if (!session_id) {
    // Instead of throwing an error, redirect or return an error prop
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  try {
    const {
      status,
      customer_details: { email: customerEmail },
    } = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['line_items', 'payment_intent'],
    });

    if (status === 'open') {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }
    return {
      props: {
        status,
        customerEmail,
      },
    };
  } catch (error) {
    // Handle Stripe or other errors
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
}

export default function Success({ status, customerEmail }) {
  if (status === 'complete') {
    return (
      <section id="success">
        <p>
          We appreciate your business! A confirmation email will be sent to{' '}
          {customerEmail}. If you have any questions, please email{' '}
        </p>
        <a href="mailto:orders@example.com">orders@example.com</a>.
      </section>
    );
  }
  // Optionally handle other cases (e.g., status !== 'complete') with a fallback UI
  return null;
}
