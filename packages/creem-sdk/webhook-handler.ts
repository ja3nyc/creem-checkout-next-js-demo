import { NextApiRequest, NextApiResponse } from 'next';
import { CreemSDK } from './index';
import { WebhookEvent } from './types';

export interface WebhookHandlers {
    'checkout.completed'?: (event: WebhookEvent) => Promise<void>;
    'subscription.created'?: (event: WebhookEvent) => Promise<void>;
    'subscription.canceled'?: (event: WebhookEvent) => Promise<void>;
    [key: string]: ((event: WebhookEvent) => Promise<void>) | undefined;
}

export function createWebhookHandler(
    creem: CreemSDK,
    webhookSecret: string,
    handlers: WebhookHandlers
) {
    return async function handler(req: NextApiRequest, res: NextApiResponse) {
        if (req.method !== 'POST') {
            return res.status(405).json({ message: 'Method not allowed' });
        }

        const signature = req.headers['creem-signature'] as string;
        if (!signature) {
            return res.status(400).json({ message: 'No signature found' });
        }

        const payload = JSON.stringify(req.body);
        const isValid = creem.verifyWebhookSignature(payload, signature, webhookSecret);

        if (!isValid) {
            return res.status(400).json({ message: 'Invalid signature' });
        }

        const event = req.body as WebhookEvent;
        const handler = handlers[event.type];

        if (handler) {
            try {
                await handler(event);
                res.status(200).json({ received: true });
            } catch (error) {
                console.error('Webhook handler error:', error);
                res.status(500).json({ message: 'Webhook handler failed' });
            }
        } else {
            res.status(400).json({ message: `No handler for event: ${event.type}` });
        }
    };
} 