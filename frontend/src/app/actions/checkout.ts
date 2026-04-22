'use server';

import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-02-25.clover',
});

export async function createCheckoutSession(items: any[]) {
    if (!items || items.length === 0) {
        throw new Error('Cart is empty');
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const lineItems = items.map((item) => ({
        price_data: {
            currency: 'usd',
            product_data: {
                name: item.title || item.name,
                images: [item.image].filter(Boolean),
            },
            unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
    }));

    const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/cart`,
        metadata: {
            user_id: user?.id || 'guest',
        },
    });

    return { url: session.url };
}
