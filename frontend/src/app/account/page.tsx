"use client";

import React from 'react';
import Link from 'next/link';

export default function AccountOverviewPage() {
    return (
        <div style={{
            minHeight: '60vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4rem 2rem',
            textAlign: 'center',
            fontFamily: 'var(--font-sans, system-ui, sans-serif)',
        }}>
            <div style={{
                maxWidth: '480px',
                background: 'white',
                borderRadius: '1.5rem',
                padding: '3rem 2.5rem',
                boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                border: '1px solid #f1f5f9',
            }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔐</div>
                <h1 style={{ fontSize: '1.75rem', fontFamily: 'var(--font-serif)', margin: '0 0 0.75rem', color: '#111827' }}>
                    Member Account
                </h1>
                <p style={{ color: '#6b7280', lineHeight: 1.7, margin: '0 0 2rem', fontSize: '0.95rem' }}>
                    Our customer account system — including fidelity points, referral rewards, and exclusive membership — is coming very soon.
                    Stay tuned for personalised experiences!
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <Link
                        href="/catalog"
                        style={{
                            display: 'block',
                            background: 'var(--primary, #111827)',
                            color: 'white',
                            padding: '0.875rem 2rem',
                            borderRadius: '0.75rem',
                            textDecoration: 'none',
                            fontWeight: 600,
                            fontSize: '0.95rem',
                            transition: 'opacity 0.2s',
                        }}
                    >
                        Browse Our Collection
                    </Link>
                    <Link
                        href="/contact"
                        style={{
                            display: 'block',
                            background: '#f9fafb',
                            color: '#374151',
                            padding: '0.875rem 2rem',
                            borderRadius: '0.75rem',
                            textDecoration: 'none',
                            fontWeight: 600,
                            fontSize: '0.95rem',
                            border: '1px solid #e5e7eb',
                        }}
                    >
                        Contact Us
                    </Link>
                </div>
            </div>
        </div>
    );
}
