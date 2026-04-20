import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Product } from '@/models/Product';

// Public API: fetch all products from MongoDB (with fallback to static JSON)
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('id');

    try {
        await connectDB();

        if (productId) {
            // Fetch single product
            const product = await Product.findOne({ id: productId }).lean();
            if (product) {
                return NextResponse.json(product);
            }
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        // Fetch all products
        const products = await Product.find({}).lean();
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
            return NextResponse.json(productsData.default);
        } catch {
            return NextResponse.json({ error: 'Failed to load products' }, { status: 500 });
        }
    }
}
