import { CreemSDK } from "@creem/sdk";
import { createClient } from '@repo/db/server';
import { redirect } from "next/navigation";

const sdk = new CreemSDK({
    apiKey: process.env.CREEM_API_KEY || ''
});

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/");
    }

    try {
        const { data: profile } = await supabase
            .from('subscriptions')
            .select('subscription_id')
            .eq('user_id', user.id)
            .single();

        const subscription = profile?.subscription_id ? await sdk.getSubscription({
            subscription_id: profile.subscription_id
        }) : null;

        const formattedSubscription = subscription ? {
            status: subscription.status,
            plan: subscription.product.name,
            currentPeriodEnd: subscription.current_period_end_date,
            cancelAtPeriodEnd: subscription.canceled_at
        } : null;

        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

                <div className="bg-white w-full rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Subscription Details</h2>

                    {formattedSubscription ? (
                        <div className="space-y-4">
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-gray-600">Status</span>
                                <span className="font-medium capitalize">
                                    {formattedSubscription.status}
                                </span>
                            </div>

                            <div className="flex justify-between border-b pb-2">
                                <span className="text-gray-600">Plan</span>
                                <span className="font-medium">{formattedSubscription.plan}</span>
                            </div>

                            <div className="flex justify-between border-b pb-2">
                                <span className="text-gray-600">Current Period End</span>
                                <span className="font-medium">
                                    {formattedSubscription.currentPeriodEnd ? new Date(formattedSubscription.currentPeriodEnd).toLocaleDateString() : 'N/A'}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-600">Cancel at Period End</span>
                                <span className="font-medium">
                                    {formattedSubscription.cancelAtPeriodEnd ? "Yes" : "No"}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-4">
                            <p className="text-gray-600">No active subscription</p>
                            <a
                                href="/#pricing"
                                className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                            >
                                View Plans
                            </a>
                        </div>
                    )}
                </div>
            </div>
        );
    } catch (error) {
        console.error('Error:', error);
        return <div>Error loading subscription details</div>;
    }
}

