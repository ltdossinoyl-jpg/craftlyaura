"use client";

import React, { useState } from 'react';
import { useUser } from '@/context/UserContext';

const MOCK_TICKETS = [
    { id: 'TKT-9921', subject: 'Change shipping address', date: 'Oct 16, 2026', status: 'Open' },
    { id: 'TKT-8432', subject: 'Where is my tracking number?', date: 'Sep 05, 2026', status: 'Resolved' }
];

export default function TicketsPage() {
    const { user } = useUser();
    const [isCreating, setIsCreating] = useState(false);

    if (!user) return null;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-serif)', margin: 0 }}>Support Tickets</h1>
                {!isCreating && (
                    <button
                        onClick={() => setIsCreating(true)}
                        style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '0.6rem 1.25rem', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        + Open New Ticket
                    </button>
                )}
            </div>

            {isCreating ? (
                <div style={{ background: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                    <h2 style={{ fontSize: '1.25rem', margin: '0 0 1.5rem 0' }}>Open a New Ticket</h2>
                    <form onSubmit={(e) => { e.preventDefault(); alert("Ticket submitted successfully!"); setIsCreating(false); }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>Subject line</label>
                            <input type="text" required placeholder="e.g. Issue with order ORD-109283" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', fontSize: '1rem' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>How can we help?</label>
                            <textarea required rows={5} placeholder="Describe your issue in detail..." style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', fontSize: '1rem', fontFamily: 'inherit', resize: 'vertical' }}></textarea>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <button type="submit" style={{ flex: 1, background: 'var(--primary)', color: 'white', border: 'none', padding: '0.85rem', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer' }}>Submit Ticket</button>
                            <button type="button" onClick={() => setIsCreating(false)} style={{ flex: 1, background: 'white', color: '#4b5563', border: '1px solid #d1d5db', padding: '0.85rem', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                        </div>
                    </form>
                </div>
            ) : (
                <div style={{ background: 'white', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                            <tr>
                                <th style={{ padding: '1rem', fontWeight: 600, color: '#4b5563', fontSize: '0.85rem', textTransform: 'uppercase' }}>Ticket ID</th>
                                <th style={{ padding: '1rem', fontWeight: 600, color: '#4b5563', fontSize: '0.85rem', textTransform: 'uppercase' }}>Subject</th>
                                <th style={{ padding: '1rem', fontWeight: 600, color: '#4b5563', fontSize: '0.85rem', textTransform: 'uppercase' }}>Date</th>
                                <th style={{ padding: '1rem', fontWeight: 600, color: '#4b5563', fontSize: '0.85rem', textTransform: 'uppercase', textAlign: 'right' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {MOCK_TICKETS.map((ticket, idx) => (
                                <tr key={ticket.id} style={{ borderBottom: idx !== MOCK_TICKETS.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                                    <td style={{ padding: '1rem', fontWeight: 500 }}>{ticket.id}</td>
                                    <td style={{ padding: '1rem', fontWeight: 500 }}>{ticket.subject}</td>
                                    <td style={{ padding: '1rem', color: '#6b7280', fontSize: '0.9rem' }}>{ticket.date}</td>
                                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                                        <span style={{
                                            display: 'inline-block',
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '99px',
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                            backgroundColor: ticket.status === 'Resolved' ? '#f3f4f6' : '#eff6ff',
                                            color: ticket.status === 'Resolved' ? '#4b5563' : '#1d4ed8'
                                        }}>
                                            {ticket.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
