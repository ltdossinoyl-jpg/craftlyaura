"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useUser } from '@/context/UserContext';
import styles from './page.module.css';

export default function AccountOverviewPage() {
    const { user, loginWithGoogle, login, register, logout, redeemPoints } = useUser();

    // Auth UI state
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    // Dashboard state
    const [redeemResult, setRedeemResult] = useState<string | null>(null);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        let success = false;
        if (mode === 'login') {
            success = await login(email, password);
            if (!success) setError('Invalid email or password.');
        } else {
            success = await register(name, email, password);
            if (!success) setError('Email already in use.');
        }
    };

    if (!user) {
        return (
            <div className={styles.authContainer}>
                <div className={styles.authBox}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '1rem', textAlign: 'center' }}>🔐</div>
                    <h1 className={styles.authTitle}>
                        {mode === 'login' ? 'Welcome Back' : 'Create an Account'}
                    </h1>
                    <p className={styles.authSubtitle}>
                        {mode === 'login'
                            ? 'Sign in to access your fidelity points and order history.'
                            : 'Join our exclusive community and earn 100 points instantly.'}
                    </p>

                    {error && <div className={styles.errorMsg}>{error}</div>}

                    <form onSubmit={handleAuth} className={styles.authForm}>
                        {mode === 'register' && (
                            <div className={styles.formGroup}>
                                <label>Full Name</label>
                                <input type="text" required value={name} onChange={e => setName(e.target.value)} />
                            </div>
                        )}
                        <div className={styles.formGroup}>
                            <label>Email Address</label>
                            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Password</label>
                            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} />
                        </div>
                        <button type="submit" className={styles.btnPrimary}>
                            {mode === 'login' ? 'Sign In' : 'Sign Up'}
                        </button>
                    </form>

                    <div className={styles.divider}><span>or</span></div>

                    <button onClick={loginWithGoogle} className={styles.btnGoogle}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" />
                        </svg>
                        Continue with Google
                    </button>

                    <div className={styles.toggleMode}>
                        {mode === 'login' ? (
                            <p>Don't have an account? <button onClick={() => { setMode('register'); setError(''); }}>Sign up</button></p>
                        ) : (
                            <p>Already have an account? <button onClick={() => { setMode('login'); setError(''); }}>Sign in</button></p>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.dashboardContainer}>
            <header className={styles.dashHeader}>
                <div className={styles.userInfo}>
                    <img src={user.avatar} alt="Avatar" className={styles.avatar} />
                    <div>
                        <h2>{user.name}</h2>
                        <p>{user.email}</p>
                    </div>
                </div>
                <button onClick={logout} className={styles.btnLogout}>Log Out</button>
            </header>

            <div className={styles.grid}>
                {/* Points Card */}
                <div className={styles.card}>
                    <div className={styles.cardIcon}>✨</div>
                    <h3>Fidelity Points</h3>
                    <div className={styles.pointsDisplay}>
                        <span className={styles.pointsNum}>{user.fidelityPoints}</span>
                        <span className={styles.pointsLabel}>pts</span>
                    </div>
                    <p className={styles.cardDesc}>Earn 10 points for every $1 spent. Redeem 1,000 points for a $50 discount.</p>

                    {redeemResult && (
                        <div className={styles.couponBox}>
                            <strong>VIP Coupon Unlocked:</strong>
                            <code>{redeemResult}</code>
                        </div>
                    )}

                    <button
                        onClick={() => setRedeemResult(redeemPoints())}
                        className={styles.btnAction}
                        disabled={user.fidelityPoints < 1000}
                    >
                        {user.fidelityPoints >= 1000 ? 'Redeem $50 Coupon' : `Need ${1000 - user.fidelityPoints} more pts`}
                    </button>
                </div>

                {/* Referrals */}
                <div className={styles.card}>
                    <div className={styles.cardIcon}>🎁</div>
                    <h3>Refer a Friend</h3>
                    <p className={styles.cardDesc}>Give friends $20 off their first order, and you get 500 points when they buy.</p>
                    <div className={styles.referralBox}>
                        <span>Your Code:</span>
                        <strong>{user.referralCode}</strong>
                    </div>
                    <div className={styles.statsGrid}>
                        <div>
                            <h4>Total Sent</h4>
                            <span>{user.totalReferrals}</span>
                        </div>
                        <div>
                            <h4>Successful</h4>
                            <span>{user.successfulReferrals}</span>
                        </div>
                    </div>
                </div>

                {/* Orders / Shortcuts */}
                <div className={styles.card}>
                    <div className={styles.cardIcon}>📦</div>
                    <h3>Your Orders</h3>
                    <p className={styles.cardDesc}>Track, return, or buy things again.</p>
                    <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <Link href="/catalog" className={styles.btnSecondary}>Continue Shopping</Link>
                        <Link href="/contact" className={styles.btnSecondary}>Contact Support</Link>
                    </div>
                </div>
            </div>

            {/* Fidelity System Instructions */}
            <div className={styles.instructionsSection} style={{ marginTop: '3rem', backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 1rem 0' }}>📖 How Our Fidelity Program Works</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', color: '#4b5563', fontSize: '0.95rem', lineHeight: 1.6 }}>
                    <div>
                        <strong style={{ color: '#111827', display: 'block', marginBottom: '0.5rem' }}>1. Earn Points</strong>
                        You get exactly <strong>10 Points</strong> for every $1 USD you spend in our store. You also earn a 100 points welcome bonus simply by creating an account, and 500 points for every successful referral.
                    </div>
                    <div>
                        <strong style={{ color: '#111827', display: 'block', marginBottom: '0.5rem' }}>2. Redeem Rewards</strong>
                        Once you accumulate <strong>1,000 Points</strong>, you can click the redeem button above to securely unlock an automatic $50 VIP discount code that you can apply immediately at checkout!
                    </div>
                    <div>
                        <strong style={{ color: '#111827', display: 'block', marginBottom: '0.5rem' }}>3. VIP Progression</strong>
                        Members who reach over 5,000 points automatically unlock the "The One & Only" exclusive collection, gaining VIP access to bespoke, limited-run Moroccan artisan masterpieces.
                    </div>
                </div>
            </div>

        </div>
    );
}
