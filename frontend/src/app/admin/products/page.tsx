"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './admin.module.css';

// Simple Toast Notification
const Toast = ({ message, type = "success" }: { message: string, type?: string }) => (
    <div className={`${styles.toast} ${type === 'success' ? styles.success : styles.error}`}>
        {message}
    </div>
);

const ArrayEditor = ({ title, description, data, onChange, itemTemplate }: any) => {
    const [mode, setMode] = useState('visual');
    const items = data || [];

    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>{title}</div>
            <div className={styles.cardBody}>
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{description}</p>
                <div className={styles.editorToggle}>
                    <button className={`${styles.editorToggleBtn} ${mode === 'visual' ? styles.active : ''}`} onClick={() => setMode('visual')}>👁️ Visual Builder</button>
                    <button className={`${styles.editorToggleBtn} ${mode === 'json' ? styles.active : ''}`} onClick={() => setMode('json')}>{"{ }"} Advanced JSON</button>
                </div>

                {mode === 'visual' ? (
                    <div>
                        {items.map((item: any, idx: number) => (
                            <div key={idx} className={styles.listRow} style={{ gridTemplateColumns: `repeat(${Object.keys(itemTemplate).length}, 1fr) auto` }}>
                                {Object.keys(itemTemplate).map(key => (
                                    <input
                                        key={key}
                                        placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                                        value={item[key] || ''}
                                        onChange={(e) => {
                                            const newItems = [...items];
                                            newItems[idx] = { ...newItems[idx], [key]: e.target.value };
                                            onChange(newItems);
                                        }}
                                    />
                                ))}
                                <button className={styles.removeBtn} onClick={() => {
                                    const newItems = [...items];
                                    newItems.splice(idx, 1);
                                    onChange(newItems);
                                }}>✕</button>
                            </div>
                        ))}
                        <button className={styles.addBtn} onClick={() => onChange([...items, { ...itemTemplate }])}>
                            + Add New Item
                        </button>
                    </div>
                ) : (
                    <textarea
                        className={styles.codeEditor}
                        value={JSON.stringify(items, null, 4)}
                        onChange={e => {
                            try { onChange(JSON.parse(e.target.value)); } catch (err) { }
                        }}
                        style={{ minHeight: '200px' }}
                    />
                )}
            </div>
        </div>
    );
};

export default function AdvancedAdminDashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'products' | 'settings'>('products');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleLogout = async () => {
        await fetch('/api/admin-logout', { method: 'POST' });
        router.push('/admin/login');
    };

    const [uploading, setUploading] = useState(false);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0 || activeIdx === null || !products[activeIdx]) return;
        const files = Array.from(e.target.files);

        const activeProd = products[activeIdx];
        const currentImages: string[] = activeProd.images || [];
        const newImages = [...currentImages];
        let newMainImage = activeProd.image || "";
        setUploading(true);

        for (const file of files) {
            // Upload directly to Cloudinary from browser (bypasses Vercel 4.5MB limit)
            const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
            const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'craftlyaura_unsigned';

            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', uploadPreset);
            formData.append('folder', 'craftlyaura/products');

            try {
                const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                    method: 'POST',
                    body: formData
                });
                const data = await res.json();
                if (data.secure_url) {
                    newImages.push(data.secure_url);
                    if (!newMainImage) {
                        newMainImage = data.secure_url;
                    }
                    showMessage(`✅ Uploaded: ${file.name}`);
                } else {
                    showMessage(`❌ Failed to upload ${file.name}: ${data.error?.message || 'Unknown error'}`, 'error');
                }
            } catch (err) {
                console.error("Upload failed", err);
                showMessage(`❌ Upload failed for ${file.name}`, 'error');
            }
        }

        // Update state
        const newProds = [...products];
        newProds[activeIdx].images = newImages;
        newProds[activeIdx].image = newMainImage;
        setProducts(newProds);
        setUploading(false);

        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    // Products State
    const [products, setProducts] = useState<any[]>([]);

    // Settings State
    const [settings, setSettings] = useState<any>(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // UI State
    const [searchQuery, setSearchQuery] = useState("");
    const [activeIdx, setActiveIdx] = useState<number | null>(null);
    const [showBulk, setShowBulk] = useState(false);
    const [bulkJson, setBulkJson] = useState("");
    const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        Promise.all([
            fetch('/api/products-admin').then(res => res.json()),
            fetch('/api/settings-admin').then(res => res.json())
        ])
            .then(([prodData, setData]) => {
                setProducts(prodData);
                setSettings(setData);
                if (prodData.length > 0) setActiveIdx(0);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const showMessage = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleSaveAll = async () => {
        setSaving(true);
        try {
            const p1 = fetch('/api/products-admin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(products),
            });
            const p2 = fetch('/api/settings-admin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings),
            });

            const [r1, r2] = await Promise.all([p1, p2]);
            if (r1.ok && r2.ok) {
                showMessage('🎉 All changes saved successfully!');
            } else {
                showMessage('Failed to save some data.', 'error');
            }
        } catch (error) {
            showMessage('Network error while saving.', 'error');
        }
        setSaving(false);
    };

    const addProduct = () => {
        const newProduct = {
            id: Date.now().toString(),
            title: "New Product Title",
            description: "Describe the luxury and craftsmanship of this product...",
            price: 50,
            category: "Leather Bag",
            slug: "new-product-slug",
            image: "/images/placeholder.jpg",
            images: ["/images/placeholder.jpg"],
            variationTypes: {
                "Size": ["Small", "Medium", "Large"]
            },
            variations: [
                { "Size": "Small", price: 30 },
                { "Size": "Medium", price: 50 },
                { "Size": "Large", price: 80 }
            ]
        };
        const updated = [newProduct, ...products];
        setProducts(updated);
        setActiveIdx(0);
        showMessage('Draft product added.');
    };

    const removeProduct = (idx: number) => {
        if (confirm("Are you sure you want to permanently delete this product?")) {
            const newProds = [...products];
            newProds.splice(idx, 1);
            setProducts(newProds);
            setActiveIdx(null);
            showMessage('Product removed from view.', 'error');
        }
    };

    const updateActiveProduct = (field: string, value: any) => {
        if (activeIdx === null || !products[activeIdx]) return;
        const newProds = [...products];
        newProds[activeIdx][field] = value;
        setProducts(newProds);
    };

    const applyBulk = () => {
        try {
            const parsed = JSON.parse(bulkJson);
            if (Array.isArray(parsed)) {
                setProducts([...parsed, ...products]);
                setBulkJson("");
                setShowBulk(false);
                showMessage(`${parsed.length} products added in bulk.`);
            } else {
                showMessage("JSON must be an array of objects.", 'error');
            }
        } catch (e) {
            showMessage("Invalid JSON format.", 'error');
        }
    };

    const filteredProducts = products.map((p, originalIndex) => ({ ...p, originalIndex }))
        .filter(p => !searchQuery || p.title?.toLowerCase().includes(searchQuery.toLowerCase()) || p.id?.includes(searchQuery));

    if (loading) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            Loading your workspace...
        </div>
    );

    const activeProd = activeIdx !== null && products[activeIdx] ? products[activeIdx] : null;

    return (
        <div className={styles.container}>
            {toast && <Toast message={toast.message} type={toast.type} />}

            {/* Top Navigation */}
            <header className={styles.header}>
                <div className={styles.logoArea}>
                    <div className={styles.logoIcon}>CA</div>
                    <h1 className={styles.headerTitle}>CRAFTLY AURA Admin</h1>

                    <div style={{ marginLeft: '2rem', display: 'flex', gap: '1rem' }}>
                        <button
                            style={{ background: 'none', border: 'none', fontSize: '1rem', fontWeight: activeTab === 'products' ? 600 : 400, color: activeTab === 'products' ? '#4f46e5' : '#6b7280', borderBottom: activeTab === 'products' ? '2px solid #4f46e5' : '2px solid transparent', cursor: 'pointer', paddingBottom: '0.2rem' }}
                            onClick={() => setActiveTab('products')}
                        >
                            Products
                        </button>
                        <button
                            style={{ background: 'none', border: 'none', fontSize: '1rem', fontWeight: activeTab === 'settings' ? 600 : 400, color: activeTab === 'settings' ? '#4f46e5' : '#6b7280', borderBottom: activeTab === 'settings' ? '2px solid #4f46e5' : '2px solid transparent', cursor: 'pointer', paddingBottom: '0.2rem' }}
                            onClick={() => setActiveTab('settings')}
                        >
                            Store Config
                        </button>
                    </div>
                </div>
                <div className={styles.headerActions}>
                    <Link href="/" className={styles.btnSecondary} style={{ border: 'none', background: 'transparent' }}>
                        View Live Site
                    </Link>
                    <button className={styles.btnSecondary} onClick={() => setShowBulk(true)}>
                        📦 Bulk Import
                    </button>
                    <button className={styles.btnPrimary} onClick={handleSaveAll} disabled={saving}>
                        {saving ? 'Saving...' : '💾 Publish Changes'}
                    </button>
                    <button
                        onClick={handleLogout}
                        style={{ padding: '0.5rem 1rem', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '0.375rem', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}
                    >
                        🔓 Logout
                    </button>
                </div>
            </header>

            {/* Bulk Add Modal */}
            {showBulk && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h3>Bulk Import via JSON</h3>
                            <button onClick={() => setShowBulk(false)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
                        </div>
                        <div className={styles.modalBody}>
                            <p style={{ marginBottom: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>Paste an array of product objects here. Ensure the JSON is strictly formatted.</p>
                            <textarea
                                value={bulkJson}
                                onChange={(e) => setBulkJson(e.target.value)}
                                className={styles.codeEditor}
                                style={{ minHeight: '200px', backgroundColor: '#f9fafb', color: '#111827', border: '1px solid #d1d5db' }}
                                placeholder={`[\n  {\n    "id": "25",\n    "title": "New Bag"\n  }\n]`}
                            />
                        </div>
                        <div className={styles.modalFooter}>
                            <button onClick={() => setShowBulk(false)} className={styles.btnSecondary}>Cancel</button>
                            <button onClick={applyBulk} className={styles.btnPrimary}>Import Data</button>
                        </div>
                    </div>
                </div>
            )}

            <div className={styles.layout}>
                {activeTab === 'settings' && settings ? (
                    <main className={styles.editor} style={{ padding: '2rem', flex: 1 }}>
                        <div className={styles.editorContainer}>
                            <div className={styles.editorHeader}>
                                <div>
                                    <h2>Store Configuration</h2>
                                    <p>Manage Menu Links, Collections, and Global UI Settings</p>
                                </div>
                            </div>

                            <div className={styles.card}>
                                <div className={styles.cardHeader}>Global Brand Settings</div>
                                <div className={styles.cardBody}>
                                    <div className={styles.formGroup}>
                                        <label>Announcement Bar Text</label>
                                        <input
                                            type="text"
                                            value={settings.announcement || ""}
                                            onChange={e => setSettings({ ...settings, announcement: e.target.value })}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Logo Path (Local or URL)</label>
                                        <input
                                            type="text"
                                            value={settings.logo || ""}
                                            onChange={e => setSettings({ ...settings, logo: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className={styles.cardBody} style={{ borderTop: '1px solid #f3f4f6' }}>
                                    <div className={styles.formGroup}>
                                        <label>Footer Brand Description</label>
                                        <textarea
                                            value={settings.footerDescription || ""}
                                            onChange={e => setSettings({ ...settings, footerDescription: e.target.value })}
                                            style={{ minHeight: '60px' }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <ArrayEditor
                                title="Primary Navigation Menu"
                                description="Edit the main menu links appearing in the site header."
                                data={settings.menus}
                                onChange={(m: any) => setSettings({ ...settings, menus: m })}
                                itemTemplate={{ label: '', href: '' }}
                            />

                            <ArrayEditor
                                title="Footer Quick Links"
                                description="First column of links in the footer."
                                data={settings.footerQuickLinks}
                                onChange={(m: any) => setSettings({ ...settings, footerQuickLinks: m })}
                                itemTemplate={{ label: '', href: '' }}
                            />

                            <ArrayEditor
                                title="Footer Policy Links"
                                description="Second column of links in the footer."
                                data={settings.footerPolicyLinks}
                                onChange={(m: any) => setSettings({ ...settings, footerPolicyLinks: m })}
                                itemTemplate={{ label: '', href: '' }}
                            />

                            <ArrayEditor
                                title="Collections & Categories"
                                description="Define category collections. Products auto-map to collections based on matching strings."
                                data={settings.collections}
                                onChange={(c: any) => setSettings({ ...settings, collections: c })}
                                itemTemplate={{ name: '', slug: '', matches: '' }}
                            />
                        </div>
                    </main>
                ) : (
                    <>
                        {/* Left Sidebar - Product List */}
                        <aside className={styles.sidebar}>
                            <div className={styles.sidebarAction}>
                                <button className={styles.btnAddProduct} onClick={addProduct}>
                                    + Add New Product
                                </button>
                            </div>
                            <div className={styles.searchBox}>
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <ul className={styles.productList}>
                                {filteredProducts.length === 0 ? (
                                    <div style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af', fontSize: '0.875rem' }}>No products found.</div>
                                ) : (
                                    filteredProducts.map((p) => {
                                        const isSelected = activeIdx === p.originalIndex;
                                        return (
                                            <li key={p.id || p.originalIndex}>
                                                <button
                                                    className={`${styles.productItem} ${isSelected ? styles.active : ''}`}
                                                    onClick={() => setActiveIdx(p.originalIndex)}
                                                >
                                                    <div className={styles.productThumb}>
                                                        <img src={p.image || p.images?.[0] || '/placeholder.jpg'} alt="" />
                                                    </div>
                                                    <div className={styles.productMeta}>
                                                        <div className={styles.productTitle}>{p.title || 'Untitled Product'}</div>
                                                        <div className={styles.productSubtitle}>
                                                            {p.category} • <span className={styles.priceTag}>£{p.price}</span>
                                                            {p.status === 'draft' && <span style={{ marginLeft: "0.5rem", padding: "0.15rem 0.4rem", background: "#fef9c3", color: "#ca8a04", border: "1px solid #fde047", borderRadius: "4px", fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase" }}>Draft</span>}
                                                        </div>
                                                    </div>
                                                </button>
                                            </li>
                                        );
                                    })
                                )}
                            </ul>
                        </aside>

                        {/* Right Area - Editor */}
                        <main className={styles.editor}>
                            {!activeProd ? (
                                <div className={styles.emptyState}>
                                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📄</div>
                                    <h2>Select a product to edit</h2>
                                    <p>Or add a new one from the sidebar.</p>
                                </div>
                            ) : (
                                <div className={styles.editorContainer}>

                                    <div className={styles.editorHeader}>
                                        <div>
                                            <h2>Edit Product</h2>
                                            <p>ID: <span className={styles.idTag}>{activeProd.id}</span></p>
                                        </div>
                                        <button className={styles.btnDanger} onClick={() => removeProduct(activeIdx!)}>
                                            Delete Product
                                        </button>
                                    </div>

                                    <div className={styles.card}>
                                        <div className={styles.cardHeader}>Basic Information</div>
                                        <div className={styles.cardBody}>
                                            <div className={styles.formGroup}>
                                                <label>Product Title</label>
                                                <input
                                                    type="text"
                                                    value={activeProd.title || ""}
                                                    onChange={(e) => {
                                                        const title = e.target.value;
                                                        updateActiveProduct('title', title);
                                                        // Auto-generate slug from title
                                                        const slug = title
                                                            .toLowerCase()
                                                            .trim()
                                                            .replace(/[^a-z0-9\s-]/g, '')
                                                            .replace(/\s+/g, '_');
                                                        updateActiveProduct('slug', slug);
                                                    }}
                                                />
                                            </div>

                                            <div className={styles.formRow}>
                                                <div className={styles.formGroup}>
                                                    <label>URL Slug</label>
                                                    <input
                                                        type="text"
                                                        value={activeProd.slug || ""}
                                                        onChange={(e) => updateActiveProduct('slug', e.target.value)}
                                                        style={{ fontFamily: 'monospace' }}
                                                    />
                                                </div>
                                                <div className={styles.formGroup}>
                                                    <label>Category</label>
                                                    <input
                                                        type="text"
                                                        value={activeProd.category || ""}
                                                        onChange={(e) => updateActiveProduct('category', e.target.value)}
                                                    />
                                                </div>
                                                <div className={styles.formGroup}>
                                                    <label>Status</label>
                                                    <select
                                                        value={activeProd.status || 'published'}
                                                        onChange={(e) => updateActiveProduct('status', e.target.value)}
                                                        style={{ padding: '0.65rem', borderRadius: '0.375rem', border: '1px solid #d1d5db', width: '100%', background: '#fff', fontSize: '0.9rem', cursor: 'pointer' }}
                                                    >
                                                        <option value="published">🟢 Published (Live)</option>
                                                        <option value="draft">🟡 Draft (Hidden)</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className={styles.formGroup}>
                                                <label>Base Price (£)</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={activeProd.price || 0}
                                                    onChange={(e) => updateActiveProduct('price', Number(e.target.value))}
                                                />
                                            </div>

                                            <div className={styles.formGroup}>
                                                <label>Marketing Description</label>
                                                <textarea
                                                    value={activeProd.description || ""}
                                                    onChange={(e) => updateActiveProduct('description', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className={styles.card}>
                                        <div className={styles.cardHeader}>Product Media Gallery</div>
                                        <div className={styles.cardBody}>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '1rem' }}>
                                                {(activeProd.images || []).map((imgUrl: string, idx: number) => (
                                                    <div key={idx} style={{ position: 'relative', aspectRatio: '1/1', border: activeProd.image === imgUrl ? '2px solid #4f46e5' : '1px solid #e5e7eb', borderRadius: '0.5rem', overflow: 'hidden' }}>
                                                        <img src={imgUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />

                                                        {/* Delete overlay button */}
                                                        <button onClick={(e) => {
                                                            e.preventDefault();
                                                            const newImgs = [...(activeProd.images || [])];
                                                            newImgs.splice(idx, 1);
                                                            updateActiveProduct('images', newImgs);
                                                            if (activeProd.image === imgUrl) {
                                                                updateActiveProduct('image', newImgs[0] || "");
                                                            }
                                                        }} style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(255,0,0,0.8)', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', zIndex: 10 }}>✕</button>

                                                        {/* Set Main overlay button */}
                                                        {activeProd.image !== imgUrl && (
                                                            <button onClick={(e) => {
                                                                e.preventDefault();
                                                                updateActiveProduct('image', imgUrl);
                                                            }} style={{ position: 'absolute', bottom: 4, left: 4, background: 'rgba(0,0,0,0.7)', color: 'white', border: 'none', borderRadius: '4px', fontSize: '0.7rem', padding: '2px 6px', cursor: 'pointer', zIndex: 10 }}>Set Main</button>
                                                        )}
                                                        {activeProd.image === imgUrl && (
                                                            <div style={{ position: 'absolute', bottom: 4, left: 4, background: '#4f46e5', color: 'white', borderRadius: '4px', fontSize: '0.7rem', padding: '2px 6px', zIndex: 10 }}>Main Cover</div>
                                                        )}
                                                    </div>
                                                ))}

                                                {/* Upload Button */}
                                                <div style={{ border: '2px dashed #d1d5db', borderRadius: '0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: uploading ? 'wait' : 'pointer', aspectRatio: '1/1', background: uploading ? '#eef2ff' : '#f9fafb', opacity: uploading ? 0.7 : 1 }} onClick={() => !uploading && fileInputRef.current?.click()}>
                                                    <span style={{ fontSize: '2rem', color: '#9ca3af', lineHeight: 1 }}>{uploading ? '⏳' : '+'}</span>
                                                    <span style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>{uploading ? 'Uploading...' : 'Upload'}</span>
                                                    <input type="file" multiple accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileUpload} />
                                                </div>
                                            </div>
                                            <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '1rem' }}>
                                                Click on "+" to browse and upload images from your desktop. Click "Set Main" to choose the cover image. Changes are saved automatically when you click publish.
                                            </p>
                                        </div>
                                    </div>

                                    <div className={styles.card}>
                                        <div className={styles.cardHeader}>Advanced Configuration</div>
                                        <div className={styles.cardBody}>
                                            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Edit the full underlying JSON for complex properties like Variations. Changes reflect immediately.</p>
                                            <textarea
                                                className={styles.codeEditor}
                                                value={JSON.stringify(activeProd, null, 4)}
                                                onChange={(e) => {
                                                    try {
                                                        const updated = JSON.parse(e.target.value);
                                                        // Create a shallow copy and update ONLY if JSON differs to avoid cursor jump
                                                        const newProds = [...products];
                                                        newProds[activeIdx!] = updated;
                                                        setProducts(newProds);
                                                    } catch (err) {
                                                        // ignore parse errors while user is actively typing
                                                    }
                                                }}
                                                spellCheck={false}
                                            />
                                        </div>
                                    </div>

                                </div>
                            )}
                        </main>
                    </>
                )}
            </div>
        </div>
    );
}
