import Link from 'next/link';
import Image from 'next/image';
import settingsData from '@/data/settings.json';
import ProductCard from '@/components/ProductCard';
import HeroSlideshow from '@/components/HeroSlideshow';
import TrustedPartners from '@/components/TrustedPartners';
import styles from './page.module.css';
import { connectDB } from '@/lib/mongodb';
import { Product } from '@/models/Product';
export const dynamic = 'force-dynamic';

async function getFeaturedProducts() {
  try {
    await connectDB();
    const products = await Product.find({}).lean();
    return JSON.parse(JSON.stringify(products));
  } catch {
    const fs = await import('fs');
    const path = await import('path');
    const dataPath = path.join(process.cwd(), 'src/data/products.json');
    const data = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(data);
  }
}

const SHOP_COLLECTIONS = [
  {
    name: "Patterned Barrels",
    href: "/category/patterned-barrels",
    image: "/images/ai/cat_patterned_barrel.png"
  },
  {
    name: "Classic Barrel Bags",
    href: "/category/classic-barrel-bags",
    image: "/images/ai/cat_classic_barrel.png"
  },
  {
    name: "Travel & Duffel Sets",
    href: "/category/travel-duffel-sets",
    image: "/images/ai/cat_duffel_sets.png"
  },
  {
    name: "Executive Briefcases",
    href: "/category/executive-briefcases",
    image: "/images/ai/cat_briefcases.png"
  },
  {
    name: "Totes & Shoulder Bags",
    href: "/category/totes-shoulder-bags",
    image: "/images/ai/cat_tote_shoulder.png"
  },
  {
    name: "Colorful Collection",
    href: "/category/colorful-bag-collection",
    image: "/images/ai/cat_vibrant_bags.png"
  }
];

export default async function Home() {
  const productsData = await getFeaturedProducts();
  return (
    <div className={styles.main}>
      <HeroSlideshow />

      {/* Ticker Section */}
      <section id="ia-logo-ticker-v2" className={styles.tickerSection}>
        <div className={styles.tickerTrack}>
          <div className={styles.tickerContent}>
            {[
              { name: 'FEDEX', domain: 'fedex.com' },
              { name: 'DHL EXPRESS', domain: 'dhl.com' },
              { name: 'UPS', domain: 'ups.com' },
              { name: 'ARAMEX', domain: 'aramex.com' },
              { name: 'FEDEX', domain: 'fedex.com' },
              { name: 'DHL EXPRESS', domain: 'dhl.com' },
              { name: 'UPS', domain: 'ups.com' },
              { name: 'ARAMEX', domain: 'aramex.com' },
              { name: 'FEDEX', domain: 'fedex.com' },
              { name: 'DHL EXPRESS', domain: 'dhl.com' },
              { name: 'UPS', domain: 'ups.com' },
              { name: 'ARAMEX', domain: 'aramex.com' }
            ].map((brand, i) => (
              <span key={`a-${i}`} className={styles.tickerText}>
                <img
                  src={`https://www.google.com/s2/favicons?domain=${brand.domain}&sz=64`}
                  alt={`${brand.name} logo`}
                  width="22"
                  height="22"
                  style={{ borderRadius: '4px', objectFit: 'contain', marginRight: '0.75rem', backgroundColor: 'transparent' }}
                />
                {brand.name} <span className={styles.tickerDot}>•</span>
              </span>
            ))}
          </div>
          <div className={styles.tickerContent} aria-hidden="true">
            {[
              { name: 'FEDEX', domain: 'fedex.com' },
              { name: 'DHL EXPRESS', domain: 'dhl.com' },
              { name: 'UPS', domain: 'ups.com' },
              { name: 'ARAMEX', domain: 'aramex.com' },
              { name: 'FEDEX', domain: 'fedex.com' },
              { name: 'DHL EXPRESS', domain: 'dhl.com' },
              { name: 'UPS', domain: 'ups.com' },
              { name: 'ARAMEX', domain: 'aramex.com' },
              { name: 'FEDEX', domain: 'fedex.com' },
              { name: 'DHL EXPRESS', domain: 'dhl.com' },
              { name: 'UPS', domain: 'ups.com' },
              { name: 'ARAMEX', domain: 'aramex.com' }
            ].map((brand, i) => (
              <span key={`b-${i}`} className={styles.tickerText}>
                <img
                  src={`https://www.google.com/s2/favicons?domain=${brand.domain}&sz=64`}
                  alt={`${brand.name} logo`}
                  width="22"
                  height="22"
                  style={{ borderRadius: '4px', objectFit: 'contain', marginRight: '0.75rem', backgroundColor: 'transparent' }}
                />
                {brand.name} <span className={styles.tickerDot}>•</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 3 Pillars exactly like insideast */}
      <section className={`container ${styles.pillarsSection}`}>
        <div className={`${styles.pillar} fade-in delay-1`}>
          <h2 className={styles.pillarTitle}>100% Handmade</h2>
          <p className={styles.pillarDesc}>Crafted with care using 100% natural materials.</p>
          <Link href="/catalog" className={styles.pillarLink}>View Collection</Link>
        </div>
        <div className={`${styles.pillar} fade-in delay-2`}>
          <h2 className={styles.pillarTitle}>Easy Returns</h2>
          <p className={styles.pillarDesc}>Returns within 30 days for hassle-free shopping.</p>
          <Link href="/contact" className={styles.pillarLink}>Learn More</Link>
        </div>
        <div className={`${styles.pillar} fade-in delay-3`}>
          <h2 className={styles.pillarTitle}>Secure Payment</h2>
          <p className={styles.pillarDesc}>Payment details are 100% protected.</p>
          <Link href="/catalog" className={styles.pillarLink}>Shop Securely</Link>
        </div>
      </section>

      {/* Featured Collection Multicolumn */}
      <section className={`${styles.collectionSection} container slide-up`}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Featured Collection</h2>
        </div>
        <div className={styles.collectionGrid}>
          {SHOP_COLLECTIONS.map((col, index) => (
            <div key={col.name} className={`${styles.collectionCard} fade-in`} style={{ animationDelay: `${index * 0.15}s` }}>
              <div className={styles.collectionImageWrapper}>
                <Image
                  src={col.image}
                  alt={col.name}
                  className={styles.collectionImage}
                  fill
                  sizes="(max-width: 600px) 100vw, 25vw"
                />
              </div>
              <div className={styles.collectionInfo}>
                <Link href={col.href} className={styles.collectionBtn}>
                  <span className={styles.btnText}>{col.name}</span>
                  <span className={styles.btnIcon}>
                    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7.5 3.75L13.75 10L7.5 16.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                    </svg>
                  </span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products By Collection */}
      <div className="container slide-up" style={{ marginTop: '2rem' }}>
        {settingsData.collections.map((col: any, cIdx: number) => {
          const matchTerms = (col.matches || '').toLowerCase().split(',').map((t: string) => t.trim()).filter(Boolean);
          const colProducts = productsData.filter((p: any) => {
            const title = (p.title || '').toLowerCase();
            const catg = (p.category || '').toLowerCase();
            return matchTerms.some((m: string) => title.includes(m) || catg.includes(m));
          }).slice(0, 4);

          if (colProducts.length === 0) return null;

          return (
            <section key={cIdx} className={styles.featuredSection} style={{ marginBottom: '5rem' }}>
              <div className={styles.sectionHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid #eee', paddingBottom: '1rem', marginBottom: '2rem' }}>
                <h2 className={styles.sectionTitle} style={{ margin: 0, textAlign: 'left', fontSize: '1.8rem' }}>{col.name}</h2>
                <Link href={`/category/${col.slug}`} style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary)', textDecoration: 'none' }}>
                  View Collection →
                </Link>
              </div>
              <div className={styles.productGrid}>
                {colProducts.map((product: any, index: number) => (
                  <ProductCard key={product.id} product={product as any} index={index} />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {/* Trusted By Partners & Media exactly from insideast */}
      <TrustedPartners />

      {/* Features Band exactly from insideast footer area */}
      <section className={styles.featuresBand}>
        <div className={`container ${styles.featuresGrid}`}>
          <div className={styles.featureItem}>
            <h3>100% Handmade</h3>
            <p>Crafted with care using 100% natural materials, including pure leather.</p>
          </div>
          <div className={styles.featureItem}>
            <h3>Return Policy</h3>
            <p>Easy returns within 30 days for hassle-free shopping.</p>
          </div>
          <div className={styles.featureItem}>
            <h3>Secure Payment</h3>
            <p>Shop with confidence: your payment details are protected.</p>
          </div>
          <div className={styles.featureItem}>
            <h3>Reliable Shipping</h3>
            <p>Reliable shipping to get your order from 1 day to 7 days.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
