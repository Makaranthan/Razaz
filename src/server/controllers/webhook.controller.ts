import { Request, Response } from 'express';
import { stripe } from '../utils/stripe';
import { db } from '../utils/db';

export const handleStripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test_secret';

  let event;

  try {
    // Note: req.body must be raw buffer for Stripe signature verification
    // This requires specific middleware setup in server.ts
    event = stripe.webhooks.constructEvent(req.body, sig as string, endpointSecret);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object as any;
      const orderId = paymentIntent.metadata.orderId;

      if (orderId) {
        // Update order status to PAID
        await db.order.update({
          where: { id: orderId },
          data: { status: 'PAID' }
        });

        // Decrement inventory securely
        const order = await db.order.findUnique({
          where: { id: orderId },
          include: { items: true }
        });

        if (order) {
          for (const item of order.items) {
            await db.product.update({
              where: { id: item.productId },
              data: {
                stockQuantity: {
                  decrement: item.quantity
                }
              }
            });
          }
        }
      }
      break;
    
    case 'payment_intent.payment_failed':
      const failedIntent = event.data.object as any;
      const failedOrderId = failedIntent.metadata.orderId;
      
      if (failedOrderId) {
        await db.order.update({
          where: { id: failedOrderId },
          data: { status: 'CANCELLED' }
        });
      }
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.send();
};
