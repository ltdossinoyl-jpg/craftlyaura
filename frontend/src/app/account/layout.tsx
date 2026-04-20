"use client";

import React from 'react';

// Production layout for the account section.
// The sidebar and mock login have been removed.
export default function AccountLayout({ children }: { children: React.ReactNode }) {
    return (
        <div style={{ backgroundColor: '#f8fafc', minHeight: 'calc(100vh - 80px)', paddingTop: '80px', paddingBottom: '4rem' }}>
            <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
                {children}
            </div>
        </div>
    );
}
