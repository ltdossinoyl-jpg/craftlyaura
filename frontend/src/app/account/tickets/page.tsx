"use client";

import React, { useState } from 'react';

export default function AccountTicketsPage() {
    const [tickets, setTickets] = useState<any[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newTicket = {
            id: 'TKT-' + Math.floor(1000 + Math.random() * 9000),
            subject,
            message,
            status: 'Open',
            date: new Date().toLocaleDateString()
        };
        setTickets([newTicket, ...tickets]);
        setShowForm(false);
        setSubject('');
        setMessage('');
    };

    return (
        <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', minHeight: '500px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#111827', margin: 0 }}>Support Tickets</h1>

                <button
                    onClick={() => setShowForm(!showForm)}
                    style={{ backgroundColor: '#111827', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '0.5rem', border: 'none', fontWeight: 600, cursor: 'pointer' }}
                >
                    {showForm ? 'Cancel' : '+ New Ticket'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} style={{ backgroundColor: '#f9fafb', padding: '1.5rem', borderRadius: '0.75rem', marginBottom: '2rem', border: '1px solid #e5e7eb' }}>
                    <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem' }}>Submit a new request</h3>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem', color: '#374151' }}>Subject</label>
                        <input
                            required
                            type="text"
                            value={subject}
                            onChange={e => setSubject(e.target.value)}
                            placeholder="e.g. Question about my order"
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', outline: 'none' }}
                        />
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem', color: '#374151' }}>Message</label>
                        <textarea
                            required
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            placeholder="Please describe your issue in detail..."
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', minHeight: '100px', resize: 'vertical', outline: 'none' }}
                        />
                    </div>
                    <button type="submit" style={{ backgroundColor: '#4f46e5', color: 'white', padding: '0.75rem 2rem', borderRadius: '0.5rem', border: 'none', fontWeight: 600, cursor: 'pointer' }}>
                        Submit Ticket
                    </button>
                </form>
            )}

            {tickets.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '200px', textAlign: 'center', color: '#6b7280' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>🎫</div>
                    <p style={{ margin: 0 }}>You don't have any support tickets yet.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {tickets.map(ticket => (
                        <div key={ticket.id} style={{ border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h4 style={{ margin: '0 0 0.5rem 0', color: '#111827', fontSize: '1rem' }}>{ticket.subject}</h4>
                                <div style={{ fontSize: '0.8rem', color: '#6b7280', display: 'flex', gap: '1rem' }}>
                                    <span>ID: {ticket.id}</span>
                                    <span>Date: {ticket.date}</span>
                                </div>
                            </div>
                            <div>
                                <span style={{ backgroundColor: '#eef2ff', color: '#4f46e5', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 600, border: '1px solid #c7d2fe' }}>
                                    {ticket.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
