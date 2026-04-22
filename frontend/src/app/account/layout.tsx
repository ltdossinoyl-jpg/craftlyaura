"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@/context/UserContext';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
    const { user, loginWithGoogle, login, register, logout } = useUser();
    const pathname = usePathname();

    const [isLoginView, setIsLoginView] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (isLoginView) {
            const success = await login(email, password);
            if (!success) setError('Invalid email or password.');
        } else {
            if (name.trim() === '') {
                setError('Name is required.');
                return;
            }
            const success = await register(name, email, password);
            if (!success) setError('Account with this email already exists.');
        }
    };

    if (!user) {
        return (
            <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb', paddingTop: '80px', paddingBottom: '80px' }}>
                <div style={{ background: 'white', padding: '3rem 2rem', borderRadius: '1rem', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', maxWidth: '450px', width: '90%', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 600, marginBottom: '0.5rem', fontFamily: 'var(--font-serif)' }}>
                        {isLoginView ? 'Welcome Back' : 'Create Account'}
                    </h1>
                    <p style={{ color: '#666', marginBottom: '2rem', fontSize: '0.9rem' }}>
                        {isLoginView ? 'Log in to track orders and earn rewards.' : 'Sign up to lock exclusive items and earn points.'}
                    </p>

                    <button
                        onClick={loginWithGoogle}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%', padding: '0.85rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', backgroundColor: 'white', cursor: 'pointer', fontSize: '1rem', fontWeight: 500, transition: 'all 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
                    >
                        <svg width="20" height="20" viewBox="0 0 48 48">
                            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.16 7.09-10.36 7.09-17.65z" />
                            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                        </svg>
                        Continue with Google
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0' }}>
                        <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }}></div>
                        <span style={{ padding: '0 10px', color: '#9ca3af', fontSize: '0.8rem' }}>OR CONTINURE WITH EMAIL</span>
                        <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }}></div>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
                        {error && <div style={{ color: '#ef4444', fontSize: '0.9rem', marginBottom: '0.5rem', textAlign: 'center', background: '#fef2f2', padding: '0.5rem', borderRadius: '0.3rem' }}>{error}</div>}

                        {!isLoginView && (
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#4b5563', marginBottom: '0.3rem' }}>Full Name</label>
                                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Jane Doe" required style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }} className="user-input" />
                            </div>
                        )}
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#4b5563', marginBottom: '0.3rem' }}>Email Address</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }} className="user-input" />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#4b5563', marginBottom: '0.3rem' }}>Password</label>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }} className="user-input" />
                        </div>

                        <button type="submit" style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '0.85rem', borderRadius: '0.5rem', fontWeight: 600, marginTop: '0.5rem', cursor: 'pointer', transition: 'all 0.2s', width: '100%' }}>
                            {isLoginView ? 'Log In' : 'Create Account'}
                        </button>
                    </form>

                    <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '1.5rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                        {isLoginView ? "Don't have an account?" : "Already have an account?"}
                        <button onClick={() => { setIsLoginView(!isLoginView); setError(''); }} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', padding: 0 }}>
                            {isLoginView ? "Sign Up" : "Log In"}
                        </button>
                    </p>
                </div>
            </div>
        );
    }

    const navItems = [
        { name: 'Dashboard', path: '/account', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
        { name: 'My Orders', path: '/account/orders', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
        { name: 'Support Tickets', path: '/account/tickets', icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z' },
        { name: 'The One & Only', path: '/account/exclusive', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' }
    ];

    return (
        <div style={{ backgroundColor: '#f9fafb', minHeight: 'calc(100vh - 80px)', paddingTop: '90px', paddingBottom: '4rem' }}>
            <div className="container" style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>

                {/* Sidebar */}
                <aside style={{ width: '280px', flexShrink: 0 }}>
                    <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                            <img src={user.avatar} alt={user.name} style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#f3f4f6' }} />
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>{user.name}</h3>
                                <p style={{ margin: 0, fontSize: '0.8rem', color: '#666' }}>{user.email}</p>
                            </div>
                        </div>

                        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {navItems.map(item => {
                                const isActive = pathname === item.path;
                                return (
                                    <Link key={item.path} href={item.path} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '0.5rem', textDecoration: 'none', color: isActive ? 'var(--primary)' : '#444', backgroundColor: isActive ? '#f0f0f0' : 'transparent', fontWeight: isActive ? 600 : 500, transition: 'all 0.2s' }}>
                                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d={item.icon} />
                                        </svg>
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </nav>

                        <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', width: '100%', marginTop: '2rem', border: 'none', background: 'none', color: '#ef4444', fontWeight: 500, cursor: 'pointer', textAlign: 'left', borderRadius: '0.5rem' }}>
                            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Logout
                        </button>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main style={{ flex: 1, minWidth: '300px' }}>
                    {children}
                </main>
            </div>
        </div>
    );
}
