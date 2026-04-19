import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'src/data/products.json');

export async function GET() {
    try {
        const data = fs.readFileSync(dataPath, 'utf8');
        return NextResponse.json(JSON.parse(data));
    } catch (error) {
        return NextResponse.json({ error: 'Failed to read products' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        if (Array.isArray(body)) {
            fs.writeFileSync(dataPath, JSON.stringify(body, null, 2));

            const backendDataPath = path.join(process.cwd(), '../backend/products.json');
            if (fs.existsSync(backendDataPath)) {
                fs.writeFileSync(backendDataPath, JSON.stringify(body, null, 2));
            }

            return NextResponse.json({ success: true, message: 'Products saved successfully' });
        }
        return NextResponse.json({ error: 'Expected an array of products' }, { status: 400 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to write products' }, { status: 500 });
    }
}
