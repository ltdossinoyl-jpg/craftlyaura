import { getCategoryBySlug } from '@/lib/categories';
import ProductCard from '@/components/ProductCard';
import { notFound } from 'next/navigation';
import styles from '@/app/page.module.css';
import { connectDB } from '@/lib/mongodb';
import { Product } from '@/models/Product';
export const dynamic = 'force-dynamic';

export default async function CategoryPage({ params }: { params: { slug: string } }) {
    // Note: in Next.js 15, route params must be awaited
    const { slug } = await params;
    const category = getCategoryBySlug(slug);

    if (!category) {
        notFound();
    }

    let productsData: any[] = [];
    try {
        await connectDB();
        productsData = await Product.find({ status: { $ne: 'draft' } }).lean();
        productsData = JSON.parse(JSON.stringify(productsData));
    } catch {
        const fs = await import('fs');
        const path = await import('path');
        const dataPath = path.join(process.cwd(), 'src/data/products.json');
        const data = fs.readFileSync(dataPath, 'utf8');
        productsData = JSON.parse(data).filter((p: any) => p.status !== 'draft');
    }

    const matchTerms = (category.matches || '').toLowerCase().split(',').map((t: string) => t.trim()).filter(Boolean);
    const products = productsData.filter(p => {
        const title = (p.title || '').toLowerCase();
        const catg = (p.category || '').toLowerCase();
        return matchTerms.some((term: string) => title.includes(term) || catg.includes(term));
    });

    return (
        <div style={{ paddingTop: '120px', paddingBottom: '6rem', minHeight: '80vh' }}>
            <div className="container fade-in">
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--primary)' }}>
                        {category.name}
                    </h1>
                    <p style={{ color: 'var(--text-muted)' }}>
                        Explore our handcrafted collection of {products.length} {category.name.toLowerCase()}.
                    </p>
                </div>

                {products.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                        No products available in this category yet.
                    </div>
                ) : (
                    <div className={styles.productGrid}>
                        {products.map((product: any, index: number) => (
                            <ProductCard key={product.id} product={product as any} index={index} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
