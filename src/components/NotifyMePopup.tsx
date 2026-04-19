"use client";

import { useState, useEffect } from 'react';
import styles from './NotifyMePopup.module.css';

interface NotifyMePopupProps {
    productName: string;
    productId: string;
    onClose: () => void;
}

export default function NotifyMePopup({ productName, productId, onClose }: NotifyMePopupProps) {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = useState('');

    // Close on Escape key
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [onClose]);

    // Lock body scroll while open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus('loading');
        setErrorMsg('');

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3005'}/notify/stock`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, productName, productId }),
            });

            if (!res.ok) throw new Error('Failed to send');
            setStatus('success');
        } catch (err) {
            setStatus('error');
            setErrorMsg('Something went wrong. Please try again.');
        }
    };

    return (
        <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true">
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                {/* Close button */}
                <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </button>

                {/* Bell icon */}
                <div className={styles.iconWrapper}>
                    <div className={styles.bellIcon}>
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>

                {status === 'success' ? (
                    <div className={styles.successState}>
                        <div className={styles.successIcon}>✓</div>
                        <h2 className={styles.title}>You&apos;re on the list!</h2>
                        <p className={styles.subtitle}>
                            We&apos;ll notify you at <strong>{email}</strong> as soon as <em>{productName}</em> is back in stock.
                        </p>
                        <button className={styles.submitBtn} onClick={onClose}>Got it!</button>
                    </div>
                ) : (
                    <>
                        <h2 className={styles.title}>Notify Me When Available</h2>
                        <p className={styles.subtitle}>
                            <strong>{productName}</strong> is currently out of stock. Leave your email and we&apos;ll let you know the moment it&apos;s back!
                        </p>

                        <form className={styles.form} onSubmit={handleSubmit}>
                            <div className={styles.inputWrapper}>
                                <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <input
                                    id="notify-email"
                                    type="email"
                                    className={styles.emailInput}
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                    autoFocus
                                />
                            </div>

                            {errorMsg && <p className={styles.errorMsg}>{errorMsg}</p>}

                            <button
                                id="notify-submit-btn"
                                type="submit"
                                className={styles.submitBtn}
                                disabled={status === 'loading'}
                            >
                                {status === 'loading' ? (
                                    <span className={styles.spinner}></span>
                                ) : (
                                    '🔔 Notify Me'
                                )}
                            </button>
                        </form>

                        <p className={styles.footerNote}>
                            We respect your privacy. No spam, ever.
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}
