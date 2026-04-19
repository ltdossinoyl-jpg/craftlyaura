export interface RawCategory {
    name: string;
    slug: string;
    matches: string[];
}

export const RAW_CATEGORIES: RawCategory[] = [
    { name: 'Leather Bags', slug: 'leather-bag', matches: ['Leather Bag'] },
    { name: 'Leather Backpacks', slug: 'leather-backpack-kilim', matches: ['Leather Backpack'] },
    { name: 'Handwoven Baskets', slug: 'handwoven-stitch-baskets', matches: ['Basket', 'Stitch Basket'] },
    { name: 'Moroccan Ceramics', slug: 'ceramic-collection', matches: ['Ceramic'] },
    { name: 'Footwear', slug: 'footwear-collection', matches: ['Footwear', 'Sandals'] },
    { name: 'Easter Baskets', slug: 'easter-basket', matches: ['Easter'] },
    { name: 'Straw Bags', slug: 'christmas-straw-bags', matches: ['Straw Bag'] },
    { name: 'Best Sellers', slug: 'best-sellers', matches: ['Best Seller'] }
];
