import React from 'react';
import styles from './Wholesale.module.css';
import Link from 'next/link';

export default function WholesalePage() {
    return (
        <main className={styles.wholesaleWrapper}>
            <section className={styles.heroSection}>
                <div className={styles.heroImageWrapper}>
                    <img
                        src="/wholesale_hero.png"
                        alt="Wholesale Moroccan artisanal decor"
                        className={styles.heroImage}
                    />
                    <div className={styles.heroOverlay}>
                        <div className={styles.contentBox}>
                            <h1 className={styles.title}>Wholesale Program</h1>
                            <p className={styles.subtitle}>Bringing authentic Atlas Mountain craftsmanship to your business.</p>
                            <div className={styles.comingSoonBadge}>COMING SOON</div>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.partnerSection}>
                <div className="container">
                    <div className={styles.partnerLayout} style={{ display: 'block', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
                        <div className={styles.partnerContent}>
                            <h2 className={styles.partnerTitle}>Direct B2B Partnership</h2>
                            <p className={styles.partnerDescription} style={{ margin: '1rem auto', maxWidth: '600px' }}>
                                We are excited to announce our upcoming direct wholesale portal.
                                We are currently preparing our inventory to offer you the best of Moroccan artisanal heritage with
                                seamless direct ordering and competitive volume pricing.
                            </p>
                            <div className={styles.perks} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem', marginTop: '2rem' }}>
                                <div className={styles.perk}>
                                    <span className={styles.perkIcon}>✨</span>
                                    <span>Dedicated B2B Support</span>
                                </div>
                                <div className={styles.perk}>
                                    <span className={styles.perkIcon}>📦</span>
                                    <span>Flexible minimum orders</span>
                                </div>
                                <div className={styles.perk}>
                                    <span className={styles.perkIcon}>🌎</span>
                                    <span>Global shipping from our workshop</span>
                                </div>
                            </div>
                            <div className={styles.ctaWrapper} style={{ marginTop: '3rem' }}>
                                <p className={styles.waitingText}>Want to be notified when we launch?</p>
                                <Link href="/contact" className={styles.notifyBtn}>Contact Us</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
