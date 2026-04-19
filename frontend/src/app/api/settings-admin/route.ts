import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'src/data/settings.json');

export async function GET() {
    try {
        if (!fs.existsSync(dataPath)) {
            return NextResponse.json({
                announcement: "FREE SHIPPING WORLDWIDE ON ALL ORDERS",
                logo: "/logo.svg",
                menus: [],
                collections: []
            });
        }
        const data = fs.readFileSync(dataPath, 'utf8');
        return NextResponse.json(JSON.parse(data));
    } catch (error) {
        return NextResponse.json({ error: 'Failed to read settings' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        fs.writeFileSync(dataPath, JSON.stringify(body, null, 2));
        return NextResponse.json({ success: true, message: 'Settings saved successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to write settings' }, { status: 500 });
    }
}
