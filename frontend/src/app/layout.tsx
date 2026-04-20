import type { Metadata } from 'next';
import { CartProvider } from '@/context/CartContext';
import { UserProvider } from '@/context/UserContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartPopup from '@/components/CartPopup';
import CheckoutDrawer from '@/components/CheckoutDrawer';
import { SpeedInsights } from "@vercel/speed-insights/next";
import './globals.css';

export const metadata: Metadata = {
  title: 'craftly aura | Sophisticated Artisanal Decor',
  description: 'Handcrafted luxury derived from cultural heritage. Brass sinks, copper lighting, curated collections.',
  icons: {
    icon: '/icon.svg',
  },
};

import productsData from '@/data/products.json';
import settingsData from '@/data/settings.json';

import ChatWidget from '@/components/chat/ChatWidget';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Precompute only the needed 4 products per category for the Mega Menu
  // By doing this on the server, we completely prevent the 1.17MB products.json
  // from being bundled into the client-side JavaScript.
  const megaMenuProducts: Record<string, any[]> = {};

  settingsData.collections.forEach((cat: any) => {
    const matchTerms = (cat.matches || '').toLowerCase().split(',').map((t: string) => t.trim()).filter(Boolean);
    megaMenuProducts[cat.slug] = productsData
      .filter((p: any) => {
        const title = (p.title || '').toLowerCase();
        const catg = (p.category || '').toLowerCase();
        return matchTerms.some((m: string) => title.includes(m) || catg.includes(m));
      })
      .slice(0, 4)
      .map((p: any) => ({
        id: p.id,
        title: p.title,
        price: p.price,
        image: p.image
      }));
  });

  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <UserProvider>
          <CartProvider>
            <Navbar megaMenuProducts={megaMenuProducts} />
            <CartPopup />
            <CheckoutDrawer />
            <main>{children}</main>
            <ChatWidget />
            <Footer />
            <SpeedInsights />
          </CartProvider>
        </UserProvider>
      </body>
    </html>
  );
}
