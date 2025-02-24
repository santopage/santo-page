import Stripe from 'stripe';

const stripe = new Stripe(`${process.env.NEXT_PUBLIC_STRIPE_API_SECRET_KEY}`);

export const createCheckoutSession = async (quantity: number, page_id: number) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price: process.env.NEXT_PUBLIC_STRIPE_PRODUCT_PRICE_ID,
        quantity: quantity,
      }],
      mode: 'payment',
      success_url: `http://localhost:3000/page/${page_id}`,
      cancel_url: `http://localhost:3000/login`,
      metadata: {
        integration_check: 'accept_a_payment',
      },
    });
    return session.url;
  } catch (error) {
    console.error('Erro ao criar Checkout Session:', error);
    throw new Error('Erro ao criar Checkout Session');
  }
};

export default stripe;