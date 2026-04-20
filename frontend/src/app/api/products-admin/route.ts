import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Product } from '@/models/Product';

export async function GET() {
    try {
        await connectDB();
        const products = await Product.find({}).lean();
        return NextResponse.json(products);
    } catch (error) {
        console.error('Failed to fetch products from MongoDB:', error);
        // Fallback to local JSON file if MongoDB fails
        try {
            const fs = await import('fs');
            const path = await import('path');
            const dataPath = path.join(process.cwd(), 'src/data/products.json');
            const data = fs.readFileSync(dataPath, 'utf8');
            return NextResponse.json(JSON.parse(data));
        } catch {
            return NextResponse.json({ error: 'Failed to read products' }, { status: 500 });
        }
    }
}

export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();

        if (Array.isArray(body)) {
            // Bulk save: delete all and re-insert
            await Product.deleteMany({});
            await Product.insertMany(body);
            return NextResponse.json({ success: true, message: 'Products saved to MongoDB successfully' });
        }

        return NextResponse.json({ error: 'Expected an array of products' }, { status: 400 });
    } catch (error) {
        console.error('Failed to save products to MongoDB:', error);
        return NextResponse.json({ error: 'Failed to write products' }, { status: 500 });
    }
}

// Delete a single product by ID
export async function DELETE(req: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const productId = searchParams.get('id');

        if (!productId) {
            return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
        }

        await Product.deleteOne({ id: productId });
        return NextResponse.json({ success: true, message: 'Product deleted' });
    } catch (error) {
        console.error('Failed to delete product:', error);
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }
}
