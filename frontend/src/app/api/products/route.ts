import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Product } from '@/models/Product';
export const dynamic = 'force-dynamic';

// Public API: fetch all products from MongoDB (with fallback to static JSON)
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('id');
    const productSlug = searchParams.get('slug');

    try {
        await connectDB();

        if (productId) {
            const product = await Product.findOne({ id: productId }).lean();
            if (product) {
                return NextResponse.json(product);
            }
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        if (productSlug) {
            const product = await Product.findOne({ slug: productSlug }).lean();
            if (product) {
                return NextResponse.json(product);
            }
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        // Fetch all products, excluding drafts
        const products = await Product.find({ status: { $ne: 'draft' } }).lean();
        if (products && products.length > 0) {
            return NextResponse.json(products);
        }

        // Fallback to static JSON
        const productsData = await import('@/data/products.json');
        return NextResponse.json(productsData.default);
    } catch (error) {
        console.error('Products API error:', error);
        // Fallback to static JSON
        try {
            const productsData = await import('@/data/products.json');
            const arr = productsData.default;

            if (productId) {
                const p = arr.find((item: any) => item.id == productId);
                return p ? NextResponse.json(p) : NextResponse.json({ error: 'Not found' }, { status: 404 });
            }
            if (productSlug) {
                const p = arr.find((item: any) => item.slug == productSlug);
                return p ? NextResponse.json(p) : NextResponse.json({ error: 'Not found' }, { status: 404 });
            }

            const publishedOnly = arr.filter((p: any) => p.status !== 'draft');
            return NextResponse.json(publishedOnly);
        } catch {
            return NextResponse.json({ error: 'Failed to load products' }, { status: 500 });
        }
    }
}
