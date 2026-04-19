import Link from 'next/link';
import Image from 'next/image';
import productsData from '@/data/products.json';
import ProductCard from '@/components/ProductCard';
import HeroSlideshow from '@/components/HeroSlideshow';
import TrustedPartners from '@/components/TrustedPartners';
import styles from './page.module.css';

const SHOP_COLLECTIONS = [
  {
    name: "Leather Bags",
    href: "/category/leather-bag",
    image: "/images/collections/879585084f4a18b79ff55419da7d5685df8b717cdb0419c7565f01314cf5122b_360x.webp"
  },
  {
    name: "Leather Backpack",
    href: "/category/leather-backpack-kilim",
    image: "/images/collections/73b36d82f37b90d8c7d5afeefc54c3d36079d53be186fc1aaae0ca7f270edbe2_540x.webp"
  },
  {
    name: "Handwoven Baskets",
    href: "/category/handwoven-stitch-baskets",
    image: "/images/collections/d69c3bc1b50bafaf4e39bc274b47692785adf3526d588b5877060421f0b1fc2a_540x.webp"
  },
  {
    name: "Moroccan Ceramics",
    href: "/category/ceramic-collection",
    image: "/images/collections/87994f47a8dcef948e5ba86e86ec56828049bb66286a204d335272f15ed1597a_360x.webp"
  },
  {
    name: "Footwear",
    href: "/category/footwear-collection",
    image: "/images/collections/69939dcd6f4419b437ce9ad5d1c98a812a9ffbfa450de9a0f96bd5673974121a_a4bb32bc-06e7-47bc-ab1e-6ad2a5877df9_360x.webp"
  },
  {
    name: "Easter Baskets",
    href: "/category/easter-basket",
    image: "/images/collections/6b77177976711dff8beba035c81e5ff55ba2e3b03be145bb997ff445a2882527_360x.webp"
  },
  {
    name: "Christmas Bags",
    href: "/category/christmas-straw-bags",
    image: "/images/collections/51ab86450d0dd1de09edecad88901f6fc2289652e3997908efce0f56f439efc7_360x.webp"
  },
  {
    name: "Best Sellers",
    href: "/category/best-sellers",
    image: "/images/collections/59ef5776457df01b6839bc19d2b4e10bf81847e656597396cbff051d7faf0d02_540x.webp"
  }
];

export default function Home() {
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
              { name: 'FAIRE', domain: 'faire.com' },
              { name: 'ANKORSTORE', domain: 'ankorstore.com' },
              { name: 'CREOATE', domain: 'creoate.com' },
              { name: 'BULLETIN', domain: 'bulletin.co' },
              { name: 'FEDEX', domain: 'fedex.com' },
              { name: 'DHL EXPRESS', domain: 'dhl.com' },
              { name: 'UPS', domain: 'ups.com' },
              { name: 'ARAMEX', domain: 'aramex.com' },
              { name: 'FAIRE', domain: 'faire.com' },
              { name: 'ANKORSTORE', domain: 'ankorstore.com' },
              { name: 'CREOATE', domain: 'creoate.com' },
              { name: 'BULLETIN', domain: 'bulletin.co' }
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
              { name: 'FAIRE', domain: 'faire.com' },
              { name: 'ANKORSTORE', domain: 'ankorstore.com' },
              { name: 'CREOATE', domain: 'creoate.com' },
              { name: 'BULLETIN', domain: 'bulletin.co' },
              { name: 'FEDEX', domain: 'fedex.com' },
              { name: 'DHL EXPRESS', domain: 'dhl.com' },
              { name: 'UPS', domain: 'ups.com' },
              { name: 'ARAMEX', domain: 'aramex.com' },
              { name: 'FAIRE', domain: 'faire.com' },
              { name: 'ANKORSTORE', domain: 'ankorstore.com' },
              { name: 'CREOATE', domain: 'creoate.com' },
              { name: 'BULLETIN', domain: 'bulletin.co' }
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

      {/* Featured Products */}
      <section id="collection" className={`${styles.featuredSection} container slide-up`}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Featured Products</h2>
        </div>

        <div className={styles.productGrid}>
          {productsData.slice(0, 8).map((product, index) => (
            <ProductCard key={product.id} product={product as any} index={index} />
          ))}
        </div>
      </section>

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
