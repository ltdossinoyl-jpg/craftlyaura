import React from 'react';
import { CATEGORIES } from '@/lib/categories';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import styles from '@/app/page.module.css';
import { connectDB } from '@/lib/mongodb';
import { Product } from '@/models/Product';

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
    const params = await searchParams;
    const query = params.q || '';
    return {
        title: `Search Results for "${query}" | CRAFTLY AURA`,
    };
}

async function getProducts() {
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

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
    const params = await searchParams;
    const query = params.q?.toLowerCase() || '';

    if (!query) {
        return (
            <div className="container" style={{ padding: '6rem 0', minHeight: '60vh', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', fontFamily: 'var(--font-serif)' }}>Search</h1>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Please enter a search term to find products.</p>
            </div>
        );
    }

    const productsData = await getProducts();

    // Search logic
    const matchedProducts = productsData.filter((product: any) => {
        return (
            (product.title || '').toLowerCase().includes(query) ||
            (product.description || '').toLowerCase().includes(query) ||
            (product.category || '').toLowerCase().includes(query)
        );
    });

    const matchedCategories = CATEGORIES.filter(cat => {
        return cat.name.toLowerCase().includes(query);
    });

    return (
        <div className="container" style={{ padding: '6rem 0', minHeight: '60vh' }}>
            <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>Search Results</h1>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '3rem' }}>
                Showing results for <strong>&quot;{params.q}&quot;</strong>
            </p>

            {/* Categories / Collections Results */}
            {matchedCategories.length > 0 && (
                <section style={{ marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontFamily: 'var(--font-serif)' }}>Collections</h2>
                    <div className={styles.brandGrid}>
                        {matchedCategories.map((cat) => (
                            <Link key={cat.slug} href={`/category/${cat.slug}`} className={styles.brandCard}>
                                <div className={styles.brandCardImage}>
                                    <img src={cat.image} alt={cat.name} />
                                </div>
                                <div className={styles.brandCardInfo}>
                                    <span className={styles.brandCardTitle}>{cat.name}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* Products Results */}
            {matchedProducts.length > 0 ? (
                <section>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontFamily: 'var(--font-serif)' }}>
                        Products ({matchedProducts.length})
                    </h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                        gap: '2rem'
                    }}>
                        {matchedProducts.map((product: any, index: number) => (
                            <ProductCard key={product.id} product={product} index={index} />
                        ))}
                    </div>
                </section>
            ) : (
                matchedCategories.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>
                            No products or collections found for &quot;{params.q}&quot;.
                        </p>
                    </div>
                )
            )}
        </div>
    );
}
