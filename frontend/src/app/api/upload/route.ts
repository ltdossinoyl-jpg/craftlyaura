import { NextResponse } from 'next/server';
import { uploadImage } from '@/lib/cloudinary';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file received.' }, { status: 400 });
        }

        // Check file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            return NextResponse.json({ error: 'File too large. Maximum size is 10MB.' }, { status: 413 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const cleanName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '');
        const filename = Date.now() + '_' + cleanName;

        // Upload to Cloudinary
        const url = await uploadImage(buffer, filename);

        return NextResponse.json({
            success: true,
            url: url
        });
    } catch (error) {
        console.error("Upload API Error:", error);
        return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
    }
}
