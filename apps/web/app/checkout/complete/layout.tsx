import { createClient } from "@repo/db/server";

export default async function CheckoutCompleteLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const getSubscription = await supabase.from('subscriptions').select('*').eq('user_id', user?.id || '').single();

    return (<div className="mx-auto max-h-dvh overflow-hidden">
        {children}
    </div>);
}
