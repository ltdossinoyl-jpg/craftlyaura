"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export default function AccountOrdersPage() {
    const [filter, setFilter] = useState('all');

    return (
        <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', minHeight: '500px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#111827', margin: 0 }}>Order History</h1>

                <select
                    value={filter}
                    onChange={e => setFilter(e.target.value)}
                    style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', outline: 'none', backgroundColor: '#f9fafb', color: '#374151', cursor: 'pointer' }}
                >
                    <option value="all">All Orders</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px', textAlign: 'center', color: '#6b7280' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>📦</div>
                <h3 style={{ fontSize: '1.25rem', color: '#374151', margin: '0 0 0.5rem 0' }}>No orders found</h3>
                <p style={{ margin: '0 0 1.5rem 0', maxWidth: '300px' }}>You haven't placed any orders yet. Once you make a purchase, it will appear here.</p>
                <Link href="/catalog" style={{ backgroundColor: '#111827', color: 'white', padding: '0.75rem 2rem', borderRadius: '0.5rem', textDecoration: 'none', fontWeight: 600 }}>
                    Start Shopping
                </Link>
            </div>
        </div>
    );
}
