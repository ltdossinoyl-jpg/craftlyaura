"use client";

import Link from 'next/link';
import settingsData from '@/data/settings.json';
import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={`container ${styles.container}`}>
                <div className={styles.grid}>
                    <div className={styles.brand}>
                        <Link href="/">
                            <img src="/logo.svg" alt="CRAFTLY AURA" className={styles.footerLogo} />
                        </Link>
                        <p className={styles.description} style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
                            {settingsData.footerDescription || 'Offering authentic Moroccan products, handmade by local artisans in Marrakech. Inspired by tradition and made using sustainable practices.'}
                        </p>
                    </div>

                    <div className={styles.linksColumn}>
                        <h3 className={styles.title}>Quick Links</h3>
                        <ul className={styles.list}>
                            {(settingsData.footerQuickLinks || []).map((link: any, idx: number) => (
                                <li key={idx}><Link href={link.href} className={styles.link}>{link.label}</Link></li>
                            ))}
                        </ul>
                    </div>

                    <div className={styles.linksColumn}>
                        <h3 className={styles.title}>Policy Links</h3>
                        <ul className={styles.list}>
                            {(settingsData.footerPolicyLinks || []).map((link: any, idx: number) => (
                                <li key={idx}><Link href={link.href} className={styles.link}>{link.label}</Link></li>
                            ))}
                        </ul>
                    </div>

                    <div className={styles.newsletter}>
                        <h3 className={styles.title}>Join Our Newsletter</h3>
                        <p className={styles.description} style={{ fontSize: '0.85rem' }}>
                            Subscribe to receive updates on new collections and exclusive artisan stories.
                        </p>
                        <form className={styles.form} onSubmit={(e) => { e.preventDefault(); }}>
                            <input type="email" placeholder="Email Address" className={styles.input} required />
                            <button type="submit" className={styles.button}>Subscribe</button>
                        </form>
                    </div>
                </div>

                <div className={styles.bottom}>
                    <p>&copy; {new Date().getFullYear()} CRAFTLY AURA. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
