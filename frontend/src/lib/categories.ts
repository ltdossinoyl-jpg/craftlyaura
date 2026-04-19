import productsData from '@/data/products.json';
import settingsData from '@/data/settings.json';

export interface Category {
    name: string;
    slug: string;
    matches: string;
    image?: string;
}

export const CATEGORIES: Category[] = settingsData.collections.map((cat: any) => ({
    ...cat,
    image: cat.image || ''
}));

export function getCategoryBySlug(slug: string): Category | undefined {
    return CATEGORIES.find(c => c.slug === slug);
}

export function getProductsByCategory(slug: string) {
    const category = getCategoryBySlug(slug);
    if (!category) return [];

    const matchTerms = (category.matches || '').toLowerCase().split(',').map((t: string) => t.trim()).filter(Boolean);

    return productsData.filter(p => {
        const title = (p.title || '').toLowerCase();
        const catg = (p.category || '').toLowerCase();
        return matchTerms.some((term: string) => title.includes(term) || catg.includes(term));
    });
}
