"use client";

import React, { useState } from 'react';
import { useUser } from '@/context/UserContext';
import Link from 'next/link';

const MOCK_ORDERS = [
    { id: 'ORD-109283', date: 'Oct 15, 2026', total: 130.00, status: 'In Transit', items: 2 },
    { id: 'ORD-098273', date: 'Sep 02, 2026', total: 65.00, status: 'Delivered', items: 1 }
];

export default function OrdersPage() {
    const { user } = useUser();

    if (!user) return null;

    const handleDownloadInvoice = (orderId: string) => {
        alert(`Simulating PDF download for Invoice ${orderId}...`);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-serif)', margin: 0 }}>My Orders</h1>

            <div style={{ background: 'white', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                        <tr>
                            <th style={{ padding: '1rem', fontWeight: 600, color: '#4b5563', fontSize: '0.85rem', textTransform: 'uppercase' }}>Order ID</th>
                            <th style={{ padding: '1rem', fontWeight: 600, color: '#4b5563', fontSize: '0.85rem', textTransform: 'uppercase' }}>Date</th>
                            <th style={{ padding: '1rem', fontWeight: 600, color: '#4b5563', fontSize: '0.85rem', textTransform: 'uppercase' }}>Status</th>
                            <th style={{ padding: '1rem', fontWeight: 600, color: '#4b5563', fontSize: '0.85rem', textTransform: 'uppercase', textAlign: 'right' }}>Total</th>
                            <th style={{ padding: '1rem', fontWeight: 600, color: '#4b5563', fontSize: '0.85rem', textTransform: 'uppercase', textAlign: 'center' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {MOCK_ORDERS.map((order, idx) => (
                            <tr key={order.id} style={{ borderBottom: idx !== MOCK_ORDERS.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                                <td style={{ padding: '1rem', fontWeight: 500 }}>{order.id}</td>
                                <td style={{ padding: '1rem', color: '#6b7280', fontSize: '0.9rem' }}>{order.date}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        display: 'inline-block',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '99px',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        backgroundColor: order.status === 'Delivered' ? '#dcfce7' : '#fef3c7',
                                        color: order.status === 'Delivered' ? '#166534' : '#92400e'
                                    }}>
                                        {order.status}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem', fontWeight: 600, textAlign: 'right' }}>${order.total.toFixed(2)}</td>
                                <td style={{ padding: '1rem', textAlign: 'center' }}>
                                    <button
                                        onClick={() => handleDownloadInvoice(order.id)}
                                        style={{ background: 'white', border: '1px solid #d1d5db', padding: '0.4rem 0.75rem', borderRadius: '0.3rem', fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#374151', transition: 'all 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
                                    >
                                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4m14-7l-5 5m0 0l-5-5m5 5V3" />
                                        </svg>
                                        Invoice
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div style={{ padding: '1.5rem', background: '#f9fafb', borderRadius: '1rem', border: '1px solid #e5e7eb', textAlign: 'center' }}>
                <p style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem' }}>Looking for older orders? If you purchased before creating an account, <Link href="/account/tickets" style={{ color: 'var(--primary)', fontWeight: 600 }}>open a ticket</Link> and we'll link them for you.</p>
            </div>
        </div>
    );
}
