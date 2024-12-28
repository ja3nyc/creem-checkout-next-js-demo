'use server'

import { creem } from '@/lib/creem';
import { createAdminClient } from '@repo/db/admin';
import { createClient } from '@repo/db/server';

export async function verifyAndActivateSubscription(subscriptionId: string) {
    const supabase = await createAdminClient();
    const authSupabase = await createClient();
    const { data: { user } } = await authSupabase.auth.getUser();

    if (!user) {
        console.error('Authentication failed: No user found');
        throw new Error('User not authenticated');
    }

    try {
        // Check if subscription is already active
        const { data: existingSubscription } = await supabase
            .from('subscriptions')
            .select('status')
            .eq('subscription_id', subscriptionId)
            .eq('status', 'active')
            .single();

        if (existingSubscription) {
            return { success: true };
        }
        // Verify subscription with Creem
        const subscription = await creem.getSubscription({ subscription_id: subscriptionId });

        if (subscription.status !== 'active') {
            console.error('Subscription is not active');
            throw new Error('Subscription is not active');
        }

        // Create new subscription record
        const { error: insertError } = await supabase
            .from('subscriptions')
            .upsert({
                user_id: user.id,
                subscription_id: subscription.id,
                customer_id: subscription.customer.id,
                product_id: subscription.product.id,
                status: subscription.status,
                current_period_start: subscription.current_period_start_date,
                current_period_end: subscription.current_period_end_date,
                metadata: {
                    checkout_completed_at: subscription.current_period_start_date,
                }
            });

        if (insertError) {
            console.error('Error inserting subscription record:', insertError);
            throw insertError;
        }

        return { success: true };
    } catch (error) {
        console.error('Error activating subscription:', error);
        throw error;
    }
}