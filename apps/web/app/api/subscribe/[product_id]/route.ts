import { creem } from '@/lib/creem';
import { createClient } from '@repo/db/server';
import { NextResponse } from 'next/server';

export async function GET(
    request: Request,
    { params }: { params: { product_id: string } }
) {
    try {
        const { searchParams, pathname } = new URL(request.url);
        const successUrl = searchParams.get('successUrl');

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            const returnUrl = encodeURIComponent(`${pathname}?${searchParams.toString()}`);
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_SITE_URL}/login?next=${returnUrl}`
            );
        }

        if (!successUrl) {
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_SITE_URL}/?error=${encodeURIComponent('Missing success URL')}`
            );
        }

        const session = await creem.createCheckoutSession({
            product_id: params.product_id,
            success_url: successUrl,
            request_id: user.id,
        });

        if (session.checkout_url) {
            return NextResponse.redirect(session.checkout_url);
        }

        return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_SITE_URL}/?error=${encodeURIComponent('Failed to create checkout session')}`
        );
    } catch (error) {
        console.error('Checkout error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to create checkout session';
        return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_SITE_URL}/?error=${encodeURIComponent(errorMessage)}`
        );
    }
} 