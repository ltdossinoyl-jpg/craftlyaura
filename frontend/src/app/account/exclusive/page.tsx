"use client";

import React, { useState } from 'react';
import { useUser } from '@/context/UserContext';
import Link from 'next/link';

export default function ExclusivePage() {
    const { user } = useUser();
    const [isSubscribing, setIsSubscribing] = useState(false);

    if (!user) return null;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-serif)', margin: 0 }}>The One & Only Program</h1>

            {!user.isExclusiveMember ? (
                <div style={{ background: 'linear-gradient(135deg, #111827, #1f2937)', color: 'white', border: '1px solid #374151', borderRadius: '1rem', padding: '2.5rem', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)', position: 'relative', overflow: 'hidden' }}>

                    <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(234,179,8,0.2) 0%, rgba(0,0,0,0) 70%)', pointerEvents: 'none' }}></div>

                    <div style={{ maxWidth: '600px', position: 'relative', zIndex: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                            <span style={{ fontSize: '2rem' }}>👑</span>
                            <h2 style={{ fontSize: '1.8rem', margin: 0, fontFamily: 'var(--font-serif)', background: 'linear-gradient(90deg, #fbbf24, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                Exclusive Ownership
                            </h2>
                        </div>

                        <p style={{ fontSize: '1.1rem', color: '#d1d5db', lineHeight: 1.6, marginBottom: '2rem' }}>
                            Subscribe to <strong>The One & Only</strong> program.
                            If you find a unique product or a specific color variation that you love, you can lock it.
                            Once you subscribe to a product, we will remove it from the store for everyone else.
                            <strong>It will be crafted exclusively for you, forever.</strong>
                        </p>

                        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '0.75rem', marginBottom: '2rem', border: '1px solid #374151' }}>
                            <h3 style={{ margin: '0 0 1rem 0', color: '#f3f4f6', fontSize: '1rem' }}>Membership Benefits:</h3>
                            <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#9ca3af', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <li><strong>Full Exclusivity:</strong> The selected item variation is hidden from the public catalog.</li>
                                <li><strong>Lifetime Supply:</strong> Order your exclusive item anytime, directly from your dashboard.</li>
                                <li><strong>Priority Artisan Crafting:</strong> Your exclusive items skip the production queue.</li>
                            </ul>
                        </div>

                        {isSubscribing ? (
                            <form onSubmit={(e) => { e.preventDefault(); alert('Redirecting to Stripe for secure checkout ($99/year subscription)...'); }} style={{ background: 'white', padding: '1.5rem', borderRadius: '0.75rem', color: '#111827' }}>
                                <h3 style={{ margin: '0 0 1rem 0' }}>Complete Subscription</h3>
                                <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1.5rem' }}>The fee is $99/year. Once active, you can navigate to any product variation and click "Lock as Exclusive".</p>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button type="submit" style={{ flex: 1, background: '#111827', color: 'white', border: 'none', padding: '0.85rem', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer' }}>Proceed to Checkout</button>
                                    <button type="button" onClick={() => setIsSubscribing(false)} style={{ flex: 1, background: 'white', color: '#4b5563', border: '1px solid #d1d5db', padding: '0.85rem', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                                </div>
                            </form>
                        ) : (
                            <button
                                onClick={() => setIsSubscribing(true)}
                                style={{ background: 'linear-gradient(90deg, #fbbf24, #f59e0b)', color: '#78350f', border: 'none', padding: '1rem 2rem', borderRadius: '0.5rem', fontSize: '1.1rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px 0 rgba(245, 158, 11, 0.39)' }}
                            >
                                ✨ Join Program ($99/year)
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                <div style={{ background: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <div>
                            <h2 style={{ fontSize: '1.5rem', margin: '0 0 0.5rem 0', color: '#111827' }}>Your Exclusive Items</h2>
                            <p style={{ margin: 0, color: '#666' }}>You are an active subscriber to The One & Only program.</p>
                        </div>
                        <span style={{ background: '#ecfdf5', color: '#065f46', padding: '0.5rem 1rem', borderRadius: '99px', fontSize: '0.85rem', fontWeight: 600, border: '1px solid #10b981' }}>Active Member</span>
                    </div>

                    {user.exclusiveItems.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '4rem', background: '#f9fafb', borderRadius: '0.75rem', border: '1px dashed #d1d5db' }}>
                            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>🛍️</span>
                            <h3 style={{ margin: '0 0 0.5rem 0', color: '#374151' }}>No Exclusive Items Yet</h3>
                            <p style={{ color: '#6b7280', margin: '0 0 1.5rem 0' }}>Browse our catalog. Next to variations, look for the "Lock as Exclusive" button to claim your unique design.</p>
                            <Link href="/catalog" style={{ display: 'inline-block', background: 'var(--primary)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', textDecoration: 'none', fontWeight: 600 }}>Explore Catalog</Link>
                        </div>
                    ) : (
                        <div>
                            {/* Render exclusive items here */}
                            <p>You have exclusive items.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
