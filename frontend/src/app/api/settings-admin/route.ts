import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Setting } from '@/models/Setting';

const SETTINGS_KEY = 'site_settings';

// Default settings fallback
const DEFAULT_SETTINGS = {
    announcement: "FREE SHIPPING WORLDWIDE ON ALL ORDERS",
    logo: "/logo.svg",
    menus: [],
    collections: [],
    footerQuickLinks: [],
    footerPolicyLinks: [],
    footerDescription: "",
};

export async function GET() {
    try {
        await connectDB();
        const doc = await Setting.findOne({ key: SETTINGS_KEY }).lean();

        if (doc && doc.value) {
            return NextResponse.json(doc.value);
        }

        // Fallback: try reading from local JSON file
        try {
            const fs = await import('fs');
            const path = await import('path');
            const dataPath = path.join(process.cwd(), 'src/data/settings.json');
            if (fs.existsSync(dataPath)) {
                const data = fs.readFileSync(dataPath, 'utf8');
                return NextResponse.json(JSON.parse(data));
            }
        } catch { }

        return NextResponse.json(DEFAULT_SETTINGS);
    } catch (error) {
        console.error('Failed to fetch settings:', error);
        // Fallback to local file
        try {
            const fs = await import('fs');
            const path = await import('path');
            const dataPath = path.join(process.cwd(), 'src/data/settings.json');
            const data = fs.readFileSync(dataPath, 'utf8');
            return NextResponse.json(JSON.parse(data));
        } catch {
            return NextResponse.json(DEFAULT_SETTINGS);
        }
    }
}

export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();

        await Setting.findOneAndUpdate(
            { key: SETTINGS_KEY },
            { key: SETTINGS_KEY, value: body },
            { upsert: true, new: true }
        );

        return NextResponse.json({ success: true, message: 'Settings saved to MongoDB successfully' });
    } catch (error) {
        console.error('Failed to save settings:', error);
        return NextResponse.json({ error: 'Failed to write settings' }, { status: 500 });
    }
}
