import { CreemSDK } from "@creem/sdk";
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const sdk = new CreemSDK({
  apiKey: process.env.CREEM_API_KEY || ''
});

export async function getSubscription() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session?.user) {
    return null;
  }

  try {
    // Get the subscription_id from the user's metadata in Supabase
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_id')
      .eq('id', session.user.id)
      .single();

    if (!profile?.subscription_id) {
      return null;
    }

    const subscription = await sdk.getSubscription({
      subscription_id: profile.subscription_id
    });

    return {
      status: subscription.status,
      plan: subscription.product.name,
      currentPeriodEnd: subscription.current_period_end,
      cancelAtPeriodEnd: subscription.cancel_at_period_end
    };
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return null;
  }
} 