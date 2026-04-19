import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file received.' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        // Clean filename to be safe
        const cleanName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '');
        const filename = Date.now() + '_' + cleanName;

        const uploadDir = path.join(process.cwd(), 'public/images/uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const filePath = path.join(uploadDir, filename);
        fs.writeFileSync(filePath, buffer);

        return NextResponse.json({
            success: true,
            url: `/images/uploads/${filename}`
        });
    } catch (error) {
        console.error("Upload API Error:", error);
        return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
    }
}
