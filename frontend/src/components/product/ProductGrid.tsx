'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

// Using Supabase generated types
type Product = {
    id: string;
    name: string;
    price: number;
    slug: string;
    images: string[];
};

export default function ProductGrid({ products }: { products: Product[] }) {
    // Framer Motion variants for staggered loading
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300 } }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[300px] p-4"
        >
            {products.map((product, index) => {
                // Create Bento Grid layout variations
                // Make the 1st and 6th items span wider
                const isFeatured = index === 0 || index === 5;
                const isTall = index === 2;

                return (
                    <motion.div
                        key={product.id}
                        variants={itemVariants}
                        className={`group relative overflow-hidden rounded-2xl bg-gray-100 ${isFeatured ? 'md:col-span-2 md:row-span-2' : ''
                            } ${isTall ? 'md:row-span-2' : ''}`}
                    >
                        <Link href={`/product/${product.id}`} className="block w-full h-full">
                            <Image
                                src={product.images[0] || '/placeholder.png'}
                                alt={product.name}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                unoptimized
                            />

                            {/* Gradient Overlay for Text Readability */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-80" />

                            {/* Product Info */}
                            <div className="absolute bottom-0 left-0 p-6 w-full transform translate-y-4 transition-transform duration-300 group-hover:translate-y-0">
                                <h3 className="text-white font-serif text-2xl mb-1 drop-shadow-md">
                                    {product.name}
                                </h3>
                                <p className="text-gray-200 text-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                    ${product.price.toFixed(2)}
                                </p>

                                {/* Quick Add Button (Visual) */}
                                <button className="mt-4 bg-white text-black px-6 py-2 rounded-full font-medium text-sm opacity-0 transition-all duration-300 group-hover:opacity-100 hover:bg-gray-200 pointer-events-none">
                                    Quick Overview
                                </button>
                            </div>
                        </Link>
                    </motion.div>
                );
            })}
        </motion.div>
    );
}
