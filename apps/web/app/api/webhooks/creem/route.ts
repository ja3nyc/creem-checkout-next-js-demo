import { creem } from '@/lib/creem';
import { createAdminClient } from '@repo/db/admin';
import { createClient } from '@repo/db/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const signature = req.headers.get('creem-signature');
    console.log(signature);
    if (!signature) {
        return NextResponse.json({ message: 'No signature found' }, { status: 400 });
    }
    const payload = await req.text();
    const isValid = creem.verifyWebhookSignature(
        payload,
        signature,
        process.env.CREEM_WEBHOOK_SECRET!
    );
    if (!isValid) {
        return NextResponse.json({ message: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(payload);
    const supabase = await createAdminClient();
    const supabaseClient = await createClient();

    const authUser = await supabaseClient.auth.getUser();

    try {
        switch (event.eventType) {
            case 'checkout.completed': {
                const { customer_id, subscription_id, product_id } = event.object.subscription;
                await supabase
                    .from('subscriptions')
                    .upsert({
                        customer_id,    
                        id: subscription_id,
                        subscription_id,
                        product_id,
                        status: 'active',
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                        user_id: customer_id
                    });
                break;
            }

            case 'subscription.canceled': {
                const { customer_id, subscription_id } = event.object;
                await supabase
                    .from('subscriptions')
                    .update({
                        status: 'canceled',
                        canceled_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    })
                    .eq('subscription_id', subscription_id)
                    .eq('customer_id', customer_id);
                break;
            }
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('Webhook handler error:', error);
        return NextResponse.json({ message: 'Webhook handler failed' }, { status: 500 });
    }
} 