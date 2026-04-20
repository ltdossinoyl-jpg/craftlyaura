import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Product } from '@/models/Product';
import productsData from '@/data/products.json';

// GET: Migrate products.json into MongoDB (one-time use)
export async function GET() {
    try {
        await connectDB();

        const existingCount = await Product.countDocuments();

        if (existingCount > 0) {
            return NextResponse.json({
                message: `MongoDB already has ${existingCount} products. Use POST to force re-import.`,
                count: existingCount
            });
        }

        const result = await Product.insertMany(productsData);

        return NextResponse.json({
            success: true,
            message: `Migrated ${result.length} products from products.json to MongoDB.`,
            count: result.length
        });
    } catch (error) {
        console.error('Migration failed:', error);
        return NextResponse.json({ error: 'Migration failed', details: String(error) }, { status: 500 });
    }
}

// POST: Force re-import (deletes everything and re-imports)
export async function POST() {
    try {
        await connectDB();

        await Product.deleteMany({});
        const result = await Product.insertMany(productsData);

        return NextResponse.json({
            success: true,
            message: `Force migrated ${result.length} products from products.json to MongoDB.`,
            count: result.length
        });
    } catch (error) {
        console.error('Force migration failed:', error);
        return NextResponse.json({ error: 'Migration failed', details: String(error) }, { status: 500 });
    }
}
