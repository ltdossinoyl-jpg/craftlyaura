"use client";

import React, { useState } from 'react';
import { useUser } from '@/context/UserContext';
import Link from 'next/link';

export default function AccountOverviewPage() {
    const { user, redeemPoints } = useUser();
    const [couponCode, setCouponCode] = useState<string | null>(null);

    if (!user) return null;

    const pointsGoal = 1000;
    const progress = Math.min((user.fidelityPoints / pointsGoal) * 100, 100);
    const canRedeem = user.fidelityPoints >= pointsGoal;

    const handleRedeem = () => {
        const code = redeemPoints();
        if (code) setCouponCode(code);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-serif)', margin: 0 }}>Account Overview</h1>

            <div style={{ background: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h2 style={{ fontSize: '1.25rem', margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontSize: '1.5rem' }}>✨</span> Fidelity Rewards
                        </h2>
                        <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>Earn points with every purchase. 1000 points = 50% Off Coupon!</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>{user.fidelityPoints}</span>
                        <span style={{ display: 'block', fontSize: '0.8rem', color: '#888', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Points Balance</span>
                    </div>
                </div>

                {/* Progress Bar */}
                <div style={{ height: '12px', background: '#f3f4f6', borderRadius: '999px', overflow: 'hidden', marginBottom: '1rem' }}>
                    <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, #4f46e5, #818cf8)', transition: 'width 1s ease-in-out' }}></div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, color: '#666', marginBottom: '1.5rem' }}>
                    <span>0 Points</span>
                    <span>1000 Points Goal</span>
                </div>

                {couponCode ? (
                    <div style={{ background: '#ecfdf5', border: '1px dashed #10b981', padding: '1.5rem', borderRadius: '0.5rem', textAlign: 'center' }}>
                        <p style={{ margin: '0 0 0.5rem 0', color: '#047857', fontWeight: 600 }}>Your 50% Off Coupon Code:</p>
                        <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#065f46', fontFamily: 'monospace', letterSpacing: '2px' }}>{couponCode}</h3>
                    </div>
                ) : (
                    <button
                        onClick={handleRedeem}
                        disabled={!canRedeem}
                        style={{ width: '100%', padding: '1rem', border: 'none', background: canRedeem ? 'var(--primary)' : '#e5e7eb', color: canRedeem ? 'white' : '#9ca3af', fontWeight: 600, borderRadius: '0.5rem', cursor: canRedeem ? 'pointer' : 'not-allowed', transition: 'all 0.2s', fontSize: '1rem' }}
                    >
                        {canRedeem ? '🎉 Redeem 1000 Points for 50% OFF' : `Earn ${1000 - user.fidelityPoints} more points to unlock reward`}
                    </button>
                )}
            </div>

            {/* INSTRUCTIONS SECTION */}
            <div style={{ background: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem' }}>How Fidelity Points Work 🎁</h3>
                <ul style={{ lineHeight: '1.8', color: '#4b5563', paddingLeft: '1.5rem', margin: 0 }}>
                    <li><strong style={{ color: '#111827' }}>Earn with Purchases:</strong> Every $1 spent earns you 5 points. Reach $200 (1000 points) to get a <strong>-50% Coupon Code</strong>!</li>
                    <li><strong style={{ color: '#111827' }}>Referral Program:</strong> Share your referral link with friends. You will receive a 10% discount (valued at 200 points) once your friend accumulates 500 points on their account.</li>
                </ul>
            </div>

            {/* REFERRAL SYSTEM SECTION */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '2rem' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', color: '#0f172a' }}>Invite Friends & Earn Points 🤝</h3>
                <p style={{ color: '#475569', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                    Give friends a 10% discount on their first order. When a friend hits 500 points, you get <strong>200 points</strong> instantly!
                </p>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '250px' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#64748b', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Your Personal Referral Link</label>
                        <div style={{ display: 'flex', border: '1px solid #cbd5e1', borderRadius: '0.5rem', overflow: 'hidden', background: 'white' }}>
                            <input
                                type="text"
                                readOnly
                                value={`https://www.craftlyaura.com/invite/${user.referralCode}`}
                                style={{ flex: 1, padding: '0.75rem', border: 'none', color: '#334155', outline: 'none', background: 'transparent' }}
                            />
                            <button
                                onClick={() => { navigator.clipboard.writeText(`https://www.craftlyaura.com/invite/${user.referralCode}`); alert('Referral link copied!'); }}
                                style={{ background: '#f1f5f9', border: 'none', borderLeft: '1px solid #cbd5e1', padding: '0 1rem', cursor: 'pointer', fontWeight: 600, color: '#0f172a', transition: 'background 0.2s' }}
                            >
                                Copy Link
                            </button>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginTop: '2rem' }}>
                    <div style={{ background: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)' }}>{user.successfulReferrals || 0}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Successful Invites</div>
                    </div>
                    <div style={{ background: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: '#10b981' }}>+{(user.successfulReferrals || 0) * 200}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Points Earned</div>
                    </div>
                    <div style={{ background: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: '#f59e0b' }}>{(user.totalReferrals || 0) - (user.successfulReferrals || 0)}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Pending (Needs 500 pts)</div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                <div style={{ background: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem' }}>Recent Order Status</h3>
                    <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem' }}>You have 2 items currently in transit.</p>
                    <Link href="/account/orders" style={{ display: 'inline-block', textDecoration: 'none', color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem' }}>Track Orders →</Link>
                </div>

                <div style={{ background: 'linear-gradient(135deg, #111827, #374151)', color: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                        <span style={{ fontSize: '1.5rem' }}>👑</span>
                        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>The One & Only</h3>
                    </div>
                    <p style={{ color: '#d1d5db', fontSize: '0.9rem', marginBottom: '1rem' }}>Want an exclusive color that no one else can buy? Claim it forever.</p>
                    <Link href="/account/exclusive" style={{ display: 'inline-block', background: 'rgba(255,255,255,0.1)', padding: '0.5rem 1rem', borderRadius: '99px', textDecoration: 'none', color: '#fff', fontWeight: 600, fontSize: '0.8rem', border: '1px solid rgba(255,255,255,0.2)' }}>View Program</Link>
                </div>
            </div>
        </div>
    );
}
