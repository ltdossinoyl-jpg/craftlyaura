"use client";

import React, { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import styles from '../info.module.css';

export default function CatalogPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/products?t=' + Date.now())
            .then(res => res.json())
            .then(data => {
                setProducts(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    return (
        <div className={`container ${styles.page}`}>
            <div className={styles.hero}>
                <span className={styles.badge}>Full Collection</span>
                <h1 className={styles.pageTitle}>Our Catalog</h1>
                <p className={styles.subtitle}>
                    Explore our complete collection of handcrafted brass and copper fixtures, lighting, sinks, and accessories.
                </p>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                    Loading products...
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                    gap: '2rem',
                    maxWidth: '1200px',
                    margin: '0 auto'
                }}>
                    {products.map((product, index) => (
                        <ProductCard key={product.id} product={product as any} index={index} />
                    ))}
                </div>
            )}
        </div>
    );
}
