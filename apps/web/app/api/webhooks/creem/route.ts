import { env } from '@/env.mjs';
import { creem } from '@/lib/creem';
import { createWebhookHandler } from '@creem/sdk/webhook-handler';
import { createAdminClient } from '@repo/db/admin';
import { NextRequest, NextResponse } from 'next/server';

const webhookHandler = createWebhookHandler(creem, env.CREEM_WEBHOOK_SECRET, {
    'checkout.completed': async (event) => {
        console.log('Received checkout.completed webhook event:', event);
        const checkout = event.object;
        if (!checkout) {
            console.error('No checkout object found in event');
            return;
        }

        console.log('Processing checkout for customer:', checkout.customer.id);
        const supabase = await createAdminClient();
        
        const { error } = await supabase
            .from('subscriptions')
            .upsert(
                {
                    customer_id: checkout.customer.id,
                    subscription_id: checkout.subscription?.id || '',
                    product_id: checkout.product.id,
                    status: 'active',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    user_id: checkout.request_id as string
                },
                {
                    onConflict: checkout.subscription?.id ? 'subscription_id' : 'user_id',
                    ignoreDuplicates: false
                }
            );
            
        if (error) {
            console.error('Error upserting subscription:', error);
            if (error.code === '23505') {
                console.error('Duplicate subscription_id detected');
            }
        } else {
            console.log('Successfully processed checkout.completed for checkout:', checkout.id);
        }
    },

    'subscription.canceled': async (event) => {
        console.log('Received subscription.canceled webhook event:', event);
        const { id: subscription_id, customer, metadata } = event.object;


        console.log('Processing cancellation for subscription:', subscription_id);
        const supabase = await createAdminClient();
        const { error } = await supabase
            .from('subscriptions')
            .update({
                status: 'canceled',
                canceled_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
            .eq('subscription_id', subscription_id)

        if (error) {
            console.error('Error updating subscription:', error);
        } else {
            console.log('Successfully processed cancellation for subscription:', subscription_id);
        }
    }
});

export async function POST(req: NextRequest) {
    console.log('Received webhook request');
    const request = {
        method: req.method,
        headers: Object.fromEntries(req.headers),
        body: await req.json()
    };

    try {
        const response = await webhookHandler(request as any, {
            json: (data: any, init?: { status?: number }) => 
                NextResponse.json(data, { status: init?.status || 200 })
        } as any);
        console.log('Successfully processed webhook request');
        return response;
    } catch (error) {
        console.error('Error processing webhook:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
} 