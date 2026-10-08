import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import Stripe from 'stripe';
import { createPaymentIntent, validateWebhookSignature, getPaymentIntent } from '../services/stripeService';
import { updateOrderStatusWithHistory } from '../services/orderService';
import { environment } from '../config/environment';

const router = Router();

/**
 * POST /api/payments/create-intent
 * Create a Stripe PaymentIntent for checkout
 */
router.post(
  '/create-intent',
  [
    body('orderId').notEmpty(),
    body('amount').isFloat({ min: 0.01 }),
    body('email').isEmail(),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { orderId, amount, email } = req.body;

      // Create or retrieve PaymentIntent
      const paymentIntent = await createPaymentIntent(
        amount,
        'usd',
        {
          orderId: orderId.toString(),
          email: email,
          tenantId: 'pivit-fishing',
        }
      );

      res.json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
      });
    } catch (error) {
      console.error('Error creating payment intent:', error);
      res.status(500).json({ error: 'Failed to create payment intent' });
    }
  }
);

/**
 * POST /api/payments/confirm
 * Confirm payment and update order status
 */
router.post(
  '/confirm',
  [
    body('paymentIntentId').notEmpty(),
    body('orderId').notEmpty(),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { paymentIntentId, orderId } = req.body;

      // Retrieve payment intent to verify status
      const paymentIntent = await getPaymentIntent(paymentIntentId);

      if (paymentIntent.status === 'succeeded') {
        // Update order status to paid
        await updateOrderStatusWithHistory(
          orderId,
          'pivit-fishing',
          'paid',
          null,
          'Payment confirmed via Stripe'
        );

        res.json({
          success: true,
          message: 'Payment confirmed and order updated',
          paymentIntentId: paymentIntent.id,
        });
      } else {
        res.status(400).json({
          error: 'Payment not completed',
          status: paymentIntent.status,
        });
      }
    } catch (error) {
      console.error('Error confirming payment:', error);
      res.status(500).json({ error: 'Failed to confirm payment' });
    }
  }
);

/**
 * POST /api/payments/webhook
 * Handle Stripe webhook events (payment completion, disputes, etc.)
 * Note: In production, webhook secret should be set in environment
 */
router.post(
  '/webhook',
  async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'];

    if (!sig || typeof sig !== 'string') {
      return res.status(400).send('Missing Stripe signature');
    }

    try {
      // Validate webhook signature
      const event = await validateWebhookSignature(
        JSON.stringify(req.body),
        sig
      );

      // Handle different event types
      const eventType = (event as any).type;
      switch (eventType) {
        case 'payment_intent.succeeded':
          {
            const paymentIntent = (event as any).data.object as Stripe.PaymentIntent;
            const orderId = paymentIntent.metadata?.orderId;

            if (orderId) {
              console.log(`✓ Payment succeeded for order ${orderId}`);
              // Order status already updated in /confirm endpoint
            }
          }
          break;

        case 'payment_intent.payment_failed':
          {
            const paymentIntent = (event as any).data.object as Stripe.PaymentIntent;
            const orderId = paymentIntent.metadata?.orderId;

            if (orderId) {
              console.error(`✗ Payment failed for order ${orderId}`, paymentIntent.last_payment_error);
              await updateOrderStatusWithHistory(
                orderId,
                'pivit-fishing',
                'payment_failed',
                null,
                `Payment failed: ${paymentIntent.last_payment_error?.message}`
              );
            }
          }
          break;

        case 'charge.refunded':
          {
            const charge = (event as any).data.object as Stripe.Charge;
            console.log(`Refund processed: ${charge.id}`);
          }
          break;

        default:
          console.log(`Unhandled event type: ${eventType}`);
      }

      res.json({ received: true });
    } catch (error) {
      console.error('Webhook signature verification failed:', error);
      res.status(400).send('Webhook signature verification failed');
    }
  }
);

export default router;
