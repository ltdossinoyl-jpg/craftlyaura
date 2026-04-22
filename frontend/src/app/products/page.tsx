import React from 'react';
import ProductGrid from '@/components/product/ProductGrid';
import { createClient } from '@/lib/supabase/server';
import { Database } from '@/types/database';

// Let's do SSG or ISR with Supabase
export const revalidate = 60; // revalidate every 60 seconds

export default async function ProductsShowcasePage() {
    const supabase = await createClient();

    // Fetch from supabase
    const { data: dbProducts } = await supabase.from('products').select('*');

    // If supabase returns nothing, maybe because it's not setup yet, we load dummy logic
    let products = dbProducts || [];

    // Fallback if supabase table is empty for preview
    if (products.length === 0) {
        // Just providing dummy bento grid examples
        products = [
            { id: '1', name: 'Brass Basin Sink', price: 299, images: ['/placeholder.png'], slug: 'brass-basin-sink' },
            { id: '2', name: 'Copper Pendant Light', price: 150, images: ['/placeholder.png'], slug: 'copper-light' },
            { id: '3', name: 'Moroccan Rug', price: 450, images: ['/placeholder.png'], slug: 'rug' },
            { id: '4', name: 'Ceramic Vase', price: 85, images: ['/placeholder.png'], slug: 'vase' },
            { id: '5', name: 'Wooden Stool', price: 120, images: ['/placeholder.png'], slug: 'stool' },
            { id: '6', name: 'Zellige Tile Set', price: 80, images: ['/placeholder.png'], slug: 'tile' },
        ] as any[];
    }

    return (
        <div className="container mx-auto px-4 md:px-8 py-24">
            <div className="mb-12">
                <h1 className="text-5xl font-serif mb-4 fade-in">Bento Showcase</h1>
                <p className="text-gray-500 max-w-2xl text-lg fade-in delay-1">
                    Powered by Supabase Server Components and Tailwind CSS v4.
                </p>
            </div>

            <ProductGrid products={products} />
        </div>
    );
}
