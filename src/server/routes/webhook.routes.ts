import express from 'express';
import { handleStripeWebhook } from '../controllers/webhook.controller';

const router = express.Router();

// Stripe requires the raw body to construct the event
router.post('/', express.raw({ type: 'application/json' }), handleStripeWebhook);

export default router;
