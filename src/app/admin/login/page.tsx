"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await fetch('/api/admin-login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (res.ok && data.success) {
                router.push('/admin/products');
            } else {
                setError(data.error || 'Login failed.');
            }
        } catch {
            setError('Network error. Please try again.');
        }
        setLoading(false);
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'Inter', 'Segoe UI', sans-serif",
            padding: '1rem',
        }}>
            <div style={{
                width: '100%',
                maxWidth: '420px',
                background: 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '1.5rem',
                padding: '2.5rem',
                boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
            }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        width: '56px',
                        height: '56px',
                        background: 'linear-gradient(135deg, #4f46e5, #818cf8)',
                        borderRadius: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1rem',
                        fontSize: '1.25rem',
                        fontWeight: 800,
                        color: 'white',
                        letterSpacing: '-0.05em',
                    }}>CA</div>
                    <h1 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 700, margin: '0 0 0.25rem' }}>
                        Admin Access
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.875rem', margin: 0 }}>
                        CraftlyAura Dashboard
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{
                            display: 'block',
                            color: 'rgba(255,255,255,0.6)',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            marginBottom: '0.5rem',
                        }}>Email Address</label>
                        <input
                            id="admin-email"
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            autoComplete="email"
                            placeholder="admin@yourstore.com"
                            style={{
                                width: '100%',
                                padding: '0.875rem 1rem',
                                background: 'rgba(255,255,255,0.07)',
                                border: '1px solid rgba(255,255,255,0.12)',
                                borderRadius: '0.75rem',
                                color: 'white',
                                fontSize: '0.95rem',
                                outline: 'none',
                                transition: 'border-color 0.2s',
                                boxSizing: 'border-box',
                            }}
                            onFocus={e => e.target.style.borderColor = 'rgba(79,70,229,0.8)'}
                            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
                        />
                    </div>

                    <div>
                        <label style={{
                            display: 'block',
                            color: 'rgba(255,255,255,0.6)',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            marginBottom: '0.5rem',
                        }}>Password</label>
                        <input
                            id="admin-password"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            autoComplete="current-password"
                            placeholder="••••••••••••"
                            style={{
                                width: '100%',
                                padding: '0.875rem 1rem',
                                background: 'rgba(255,255,255,0.07)',
                                border: '1px solid rgba(255,255,255,0.12)',
                                borderRadius: '0.75rem',
                                color: 'white',
                                fontSize: '0.95rem',
                                outline: 'none',
                                transition: 'border-color 0.2s',
                                boxSizing: 'border-box',
                            }}
                            onFocus={e => e.target.style.borderColor = 'rgba(79,70,229,0.8)'}
                            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
                        />
                    </div>

                    {error && (
                        <div style={{
                            background: 'rgba(239,68,68,0.15)',
                            border: '1px solid rgba(239,68,68,0.35)',
                            borderRadius: '0.75rem',
                            padding: '0.75rem 1rem',
                            color: '#fca5a5',
                            fontSize: '0.875rem',
                            textAlign: 'center',
                        }}>
                            {error}
                        </div>
                    )}

                    <button
                        id="admin-login-btn"
                        type="submit"
                        disabled={loading}
                        style={{
                            marginTop: '0.5rem',
                            padding: '0.95rem',
                            background: loading ? 'rgba(79,70,229,0.4)' : 'linear-gradient(135deg, #4f46e5, #6366f1)',
                            border: 'none',
                            borderRadius: '0.75rem',
                            color: 'white',
                            fontWeight: 700,
                            fontSize: '1rem',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s',
                            letterSpacing: '0.02em',
                            boxShadow: loading ? 'none' : '0 4px 15px rgba(79,70,229,0.4)',
                        }}
                    >
                        {loading ? 'Signing in...' : 'Sign In to Dashboard'}
                    </button>
                </form>

                <p style={{
                    textAlign: 'center',
                    marginTop: '1.5rem',
                    color: 'rgba(255,255,255,0.2)',
                    fontSize: '0.75rem',
                }}>
                    🔒 Restricted access — authorised personnel only
                </p>
            </div>
        </div>
    );
}
