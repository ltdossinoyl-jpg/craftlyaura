import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Product } from '@/models/Product';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get('id');
  const productSlug = searchParams.get('slug');

  try {
    await connectDB();

    if (productId) {
      const product = await Product.findOne({ id: productId }).lean();
      if (product) return NextResponse.json(product);
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    if (productSlug) {
      const product = await Product.findOne({ slug: productSlug }).lean();
      if (product) return NextResponse.json(product);
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const products = await Product.find({ status: { $ne: 'draft' } }).lean();
    if (products?.length) return NextResponse.json(products);

    const fs = await import('fs');
    const path = await import('path');
    const dataPath = path.join(process.cwd(), 'src/data/products.json');
    const data = fs.readFileSync(dataPath, 'utf8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    console.error('Products API error:', error);
    try {
      const fs = await import('fs');
      const path = await import('path');
      const dataPath = path.join(process.cwd(), 'src/data/products.json');
      const data = fs.readFileSync(dataPath, 'utf8');
      const arr = JSON.parse(data);

      if (productId) {
        const p = arr.find((item: any) => item.id == productId);
        return p ? NextResponse.json(p) : NextResponse.json({ error: 'Not found' }, { status: 404 });
      }

      if (productSlug) {
        const p = arr.find((item: any) => item.slug == productSlug);
        return p ? NextResponse.json(p) : NextResponse.json({ error: 'Not found' }, { status: 404 });
      }

      return NextResponse.json(arr.filter((p: any) => p.status !== 'draft'));
    } catch {
      return NextResponse.json({ error: 'Failed to load products' }, { status: 500 });
    }
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const product = body?.product ?? body;

    const missingFields: string[] = [];
    if (!product?.id) missingFields.push('id');
    if (!product?.title) missingFields.push('title');
    if (typeof product?.price !== 'number' || Number.isNaN(product.price)) missingFields.push('price');

    if (missingFields.length) {
      return NextResponse.json(
        { ok: false, error: 'Missing or invalid required fields', missingFields },
        { status: 400 }
      );
    }

    const payload = {
      id: String(product.id),
      slug: product.slug ? String(product.slug) : undefined,
      title: String(product.title),
      description: String(product.description || ''),
      price: Number(product.price),
      compareAtPrice: product.compareAtPrice != null ? Number(product.compareAtPrice) : undefined,
      category: String(product.category || ''),
      image: String(product.image || ''),
      images: Array.isArray(product.images) ? product.images.map(String) : [],
      tags: Array.isArray(product.tags) ? product.tags.map(String) : [],
      variants: Array.isArray(product.variants) ? product.variants.map((variant: any) => ({
        size: String(variant?.size || ''),
        color: variant?.color ? String(variant.color) : undefined,
        price: variant?.price != null ? Number(variant.price) : undefined,
        sku: variant?.sku ? String(variant.sku) : undefined,
      })) : [],
      inventory: product.inventory != null ? Number(product.inventory) : 0,
      status: product.status === 'draft' ? 'draft' : 'active',
    };

    const query = payload.slug ? { slug: payload.slug } : { id: payload.id };

    const saved = await Product.findOneAndUpdate(
      query,
      { $set: payload },
      { new: true, upsert: true, runValidators: true }
    ).lean();

    return NextResponse.json({ ok: true, product: saved });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error?.message || 'Failed to save product' },
      { status: 400 }
    );
  }
}
