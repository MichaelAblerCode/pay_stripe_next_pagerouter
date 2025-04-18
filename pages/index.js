import { paymentMethods } from '@/lib/stripe';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

/** Avoid default CSR and enforces SSG to make paymentMethods import remain secure on server including the stripe secret key
 */
export async function getStaticProps() {
  return {
    props: {
      paymentMethods,
    },
  };
}

export default function IndexPage({ paymentMethods }) {
  const router = useRouter();
  const { canceled } = router.query;

  useEffect(() => {
    if (canceled) {
      console.log(
        'Order canceled -- continue to shop around and checkout when youre ready.'
      );
    }
  }, [canceled]);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
      }}
    >
      <form action="/api/checkout_session" method="POST">
        <section>
          <table style={{ marginBottom: '20px' }}>
            <thead>
              <tr>
                <th>Select Payment Method</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {paymentMethods.map(method => (
                <tr key={method.id}>
                  <td>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      defaultChecked
                    />
                    <label htmlFor={method.id}>{method.label}</label>
                  </td>
                  <td>{method.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="submit" role="link" style={{ marginTop: '10px' }}>
            Proceed to Checkout
          </button>
        </section>
      </form>
    </div>
  );
}
