import { creem } from '@/lib/creem';
import { createClient } from '@repo/db/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json(
                { error: 'Please log in to continue with your purchase' },
                { status: 401 }
            );
        }

        const { productId, successUrl } = await request.json();

        if (!productId || !successUrl) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const session = await creem.createCheckoutSession({
            product_id: productId,
            success_url: successUrl,
            request_id: user.id, // Using user ID as request ID for trackin
        });

        return NextResponse.json(session);
    } catch (error) {
        console.error('Checkout error:', error);
        return NextResponse.json(
            { error: 'Failed to create checkout session' },
            { status: 500 }
        );
    }
} 