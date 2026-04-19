import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'CraftlyAura Admin',
    robots: { index: false, follow: false },
};

// Admin has its own isolated layout — no site Navbar or Footer
export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
