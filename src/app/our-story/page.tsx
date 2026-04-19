import React from 'react';
import Link from 'next/link';
import styles from '../info.module.css';

export const metadata = {
    title: 'Our Story | handmadebestseller',
    description: 'Discover the heritage, craftsmanship, and passion behind handmadebestseller.',
};

export default function OurStoryPage() {
    return (
        <div className={`container ${styles.page}`}>
            <div className={styles.hero}>
                <span className={styles.badge}>Our Heritage</span>
                <h1 className={styles.pageTitle}>Where Tradition Meets Modern Living</h1>
                <p className={styles.subtitle}>
                    Based in the heart of Marrakech, handmadebestseller brings the soul of Moroccan craftsmanship to the global stage, specializing in authentic handwoven bags, baskets, and artisanal ceramics.
                </p>
            </div>

            <div className={styles.content}>
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Our Roots</h2>
                    <p className={styles.sectionText}>
                        handmadebestseller was born in the vibrant souks and quiet artisan quarters of Marrakech. Our mission is simple: to share the extraordinary artistry of Moroccan makers with the world. From the nimble hands weaving natural straw to the master potters shaping local clay, each product is a testament to a living heritage.
                    </p>
                    <p className={styles.sectionText}>
                        Every bag, basket, and ceramic piece carries the story of its creation — the sun-dried fibers, the natural dyes, and the generations of ancestral knowledge that define Moroccan artisanal excellence.
                    </p>
                </div>

                <div className={styles.highlightBox}>
                    <p>
                        <strong>"We don't just sell products — we preserve the heart of Moroccan tradition."</strong>
                        <br /><br />
                        Our artisans work in small batches using 100% natural and sustainable materials. This isn't mass production; it's a slow, intentional process that respects the earth and those who walk upon it.
                    </p>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>The Artisanal Journey</h2>
                    <p className={styles.sectionText}>
                        Each collection is curated with a focus on authenticity and quality. Our handwoven baskets are crafted from local fibers that have been harvested and prepared using traditional methods. Our leather goods are tanned using age-old techniques that preserve the natural character of the hide.
                    </p>
                    <p className={styles.sectionText}>
                        Our ceramics represent the perfect fusion of tradition and contemporary style, hand-painted with intricate motifs that reflect the rich cultural tapestry of Morocco.
                    </p>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Our Values</h2>
                    <div className={styles.featureGrid}>
                        <div className={styles.featureCard}>
                            <span className={styles.featureIcon}>🌿</span>
                            <h3 className={styles.featureTitle}>Natural Materials</h3>
                            <p className={styles.featureDesc}>We prioritize 100% natural materials like straw, wool, and pure leather.</p>
                        </div>
                        <div className={styles.featureCard}>
                            <span className={styles.featureIcon}>🌍</span>
                            <h3 className={styles.featureTitle}>Ethical Production</h3>
                            <p className={styles.featureDesc}>We support fair wages and safe working conditions for our local artisan partners.</p>
                        </div>
                        <div className={styles.featureCard}>
                            <span className={styles.featureIcon}>♻️</span>
                            <h3 className={styles.featureTitle}>Sustainable Craft</h3>
                            <p className={styles.featureDesc}>Traditional methods are inherently low-impact and built for longevity.</p>
                        </div>
                        <div className={styles.featureCard}>
                            <span className={styles.featureIcon}>✨</span>
                            <h3 className={styles.featureTitle}>Unique Artistry</h3>
                            <p className={styles.featureDesc}>Because every piece is handmade, no two items are exactly alike.</p>
                        </div>
                    </div>
                </div>

                <div className={styles.cta}>
                    <h2 className={styles.ctaTitle}>Discover Moroccan Beauty</h2>
                    <p className={styles.ctaText}>Explore our collection of handcrafted bags, baskets, and decor.</p>
                    <Link href="/catalog" className={styles.ctaBtn}>Shop the Collection</Link>
                </div>
            </div>
        </div>
    );
}
