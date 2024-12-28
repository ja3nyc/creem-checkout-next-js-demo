'use client';

import { CreemSDK } from "@creem/sdk";

const sdk = new CreemSDK({
    apiKey: process.env.NEXT_PUBLIC_CREEM_API_KEY || ''
});

interface ManageSubscriptionButtonProps {
    subscriptionId: string;
}

export function ManageSubscriptionButton({ subscriptionId }: ManageSubscriptionButtonProps) {
    const handleClick = async () => {
        try {
            const response = await sdk.getCustomerPortalUrl(subscriptionId);
            window.location.href = response.customer_portal_link;
        } catch (error) {
            console.error('Error accessing customer portal:', error);
        }
    };

    return (
        <button
            onClick={handleClick}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
            Manage Subscription
        </button>
    );
} 