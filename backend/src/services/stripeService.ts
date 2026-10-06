import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-08-16',
});

export async function createPaymentIntent(
  amount: number,
  currency: string = 'usd',
  metadata: Record<string, any> = {}
) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to cents
    currency,
    metadata,
  });
  return paymentIntent;
}

export async function confirmPaymentIntent(intentId: string, paymentMethodId: string) {
  const paymentIntent = await stripe.paymentIntents.confirm(intentId, {
    payment_method: paymentMethodId,
  });
  return paymentIntent;
}

export async function getPaymentIntent(intentId: string) {
  const paymentIntent = await stripe.paymentIntents.retrieve(intentId);
  return paymentIntent;
}

export async function createRefund(paymentIntentId: string, amount?: number) {
  const refund = await stripe.refunds.create({
    payment_intent: paymentIntentId,
    amount: amount ? Math.round(amount * 100) : undefined,
  });
  return refund;
}

export async function validateWebhookSignature(
  body: string,
  signature: string
): Promise<Stripe.Event> {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
  const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  return event;
}

export function getStripeInstance() {
  return stripe;
}
