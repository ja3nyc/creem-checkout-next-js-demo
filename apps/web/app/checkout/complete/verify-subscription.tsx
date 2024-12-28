'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { verifyAndActivateSubscription } from './actions';

export function VerifySubscription() {
    const searchParams = useSearchParams();
    const [error, setError] = useState<string | null>(null);
    const subscriptionId = searchParams.get('subscription_id');

    useEffect(() => {
        if (!subscriptionId) {
            setError('No subscription ID found');
            return;
        }

        verifyAndActivateSubscription(subscriptionId)
            .catch((error) => {
                console.error('Verification error:', error);
                setError('Failed to verify subscription');
            });
    }, [subscriptionId]);

    if (error) {
        return (
            <div className="text-destructive text-center mt-4">
                <p>{error}</p>
                <p className="text-sm text-muted-foreground mt-2">
                    Please contact support if this issue persists.
                </p>
            </div>
        );
    }

    return null;
}