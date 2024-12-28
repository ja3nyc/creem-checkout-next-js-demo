import { creem } from '@/lib/creem';
import { createClient } from '@repo/db/server';
import { CheckCircle, XCircle } from 'lucide-react';
import { redirect } from 'next/navigation';
import { verifyAndActivateSubscription } from './actions';

interface CheckoutParams {
    request_id?: string;
    checkout_id: string;
    order_id: string;
    customer_id: string;
    subscription_id: string;
    product_id: string;
    signature: string;
}

export default async function CheckoutCompletePage({
    searchParams,
}: {
    searchParams: Partial<CheckoutParams>;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Extract all params except signature for verification
    const params = await Promise.resolve(searchParams);
    const { signature, ...verificationParams } = params;

    if (!signature) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="max-w-md w-full p-8 text-center">
                    <div className="mb-4 flex justify-center">
                        <XCircle className="h-16 w-16 text-destructive" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Invalid Request</h1>
                    <p className="text-muted-foreground mb-8">
                        Missing signature in redirect URL.
                    </p>
                    <div className="space-y-4">
                        <a href="/" className="block w-full p-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
                            Return Home
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    // Verify the signature
    const isValid = creem.verifyRedirectSignature(verificationParams, signature);

    if (!isValid) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="max-w-md w-full p-8 text-center">
                    <div className="mb-4 flex justify-center">
                        <XCircle className="h-16 w-16 text-destructive" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Invalid Signature</h1>
                    <p className="text-muted-foreground mb-8">
                        We couldn't verify your purchase. Please contact support if you believe this is an error.
                    </p>
                    <div className="space-y-4">
                        <a href="/" className="block w-full p-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
                            Return Home
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    try {
        const subscriptionId = await Promise.resolve(params.subscription_id);
        if (!subscriptionId) {
            throw new Error('Missing subscription ID');
        }

        // Check if subscription is already activated
        const { data: subscription } = await supabase
            .from('subscriptions')
            .select('status')
            .eq('id', subscriptionId)
            .single();

        if (subscription?.status === 'active') {
            redirect('/');
        }

        // Verify and activate the subscription
        await verifyAndActivateSubscription(subscriptionId);

        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="max-w-md w-full p-8 text-center">
                    <div className="mb-4 flex justify-center">
                        <CheckCircle className="h-16 w-16 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Thank you for your purchase!</h1>
                    <p className="text-muted-foreground mb-8">
                        Your subscription has been activated successfully.
                    </p>
                    <div className="space-y-4">
                        <a href="/dashboard" className="block w-full p-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
                            Go to Dashboard
                        </a>
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="max-w-md w-full p-8 text-center">
                    <div className="mb-4 flex justify-center">
                        <XCircle className="h-16 w-16 text-destructive" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Activation Failed</h1>
                    <p className="text-muted-foreground mb-8">
                        We couldn't activate your subscription. Please contact support.
                    </p>
                    <div className="space-y-4">
                        <a href="/" className="block w-full p-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
                            Return Home
                        </a>
                    </div>
                </div>
            </div>
        );
    }
}
