"use client";

import React from 'react';
import Link from 'next/link';

export default function AccountExclusivePage() {
    return (
        <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', minHeight: '500px' }}>
            <div style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#111827', margin: 0 }}>The One & Only (Exclusive)</h1>
                <p style={{ color: '#6b7280', fontSize: '0.9rem', marginTop: '0.5rem' }}>Limited edition drops available only to verified VIP accounts.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px', textAlign: 'center', color: '#6b7280', background: 'linear-gradient(135deg, #faf6ed 0%, #f5f0e3 100%)', borderRadius: '0.75rem', padding: '2rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
                <h3 style={{ fontSize: '1.25rem', color: '#b78628', margin: '0 0 0.5rem 0', fontFamily: 'var(--font-serif)' }}>Exclusive Access Required</h3>
                <p style={{ margin: '0 0 1.5rem 0', maxWidth: '400px', color: '#444' }}>Our exclusive "One & Only" bespoke collection is currently locked. You need to reach 5,000 Fidelity Points or hold a VIP status to unlock these unique singular artisan masterpieces.</p>
                <div style={{ backgroundColor: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: 600, color: '#111827', border: '1px solid #e5e7eb' }}>
                    Current Status: Standard Member
                </div>
            </div>
        </div>
    );
}
