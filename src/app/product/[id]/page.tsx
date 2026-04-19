"use client";

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import productsData from '@/data/products.json';
import styles from './page.module.css';
import React, { useState } from 'react';
import ProductCard from '@/components/ProductCard';
import dynamic from 'next/dynamic';
import NotifyMePopup from '@/components/NotifyMePopup';

const ImageLightbox = dynamic(() => import('@/components/ImageLightbox'), { ssr: false });

// Renders text with clickable guide/spec sheet links
const RichText = ({ text, productSlug }: { text: string, productSlug?: string }) => {
    const productUrl = productSlug
        ? `https://www.insideast.com/products/${productSlug}`
        : '#';

    // Pattern to detect guide/spec lines like "📄 Download Size Guide" etc.
    const linkPattern = /(?:📄\s*)?(?:Download|View)\s+(?:Size Guide|Spec Sheet|Product Details|Installation Guide)(?:\s*\(PDF\))?/gi;

    // Clean HTML tags from the description
    const cleanText = text
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/p>/gi, '\n\n')
        .replace(/<[^>]+>/g, '')
        .replace(/\n\s*\n\s*\n/g, '\n\n') // Collapse excessive newlines
        .trim();

    const parts = cleanText.split('\n');
    return (
        <>
            {parts.map((line, i) => {
                const match = line.match(linkPattern);
                if (match) {
                    const segments: React.ReactNode[] = [];
                    let lastIndex = 0;
                    let m;
                    const re = new RegExp(linkPattern.source, 'gi');
                    while ((m = re.exec(line)) !== null) {
                        if (m.index > lastIndex) {
                            segments.push(line.slice(lastIndex, m.index));
                        }
                        segments.push(
                            <a
                                key={`link-${i}-${m.index}`}
                                href={productUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.guideLink}
                            >
                                {m[0]}
                            </a>
                        );
                        lastIndex = m.index + m[0].length;
                    }
                    if (lastIndex < line.length) {
                        segments.push(line.slice(lastIndex));
                    }
                    return <React.Fragment key={i}>{segments}{i < parts.length - 1 ? '\n' : ''}</React.Fragment>;
                }
                return <React.Fragment key={i}>{line}{i < parts.length - 1 ? '\n' : ''}</React.Fragment>;
            })}
        </>
    );
};

const Accordion = ({ title, content, productSlug }: { title: string, content: string, productSlug?: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className={styles.accordionContainer}>
            <button className={styles.accordionHeader} onClick={() => setIsOpen(!isOpen)} aria-expanded={isOpen}>
                <span className={styles.accordionTitle}>{title}</span>
                <span className={`${styles.accordionIcon} ${isOpen ? styles.open : ''}`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
                </span>
            </button>
            <div className={`${styles.accordionContentWrapper} ${isOpen ? styles.open : ''}`}>
                <div className={styles.accordionContent}>
                    <RichText text={content} productSlug={productSlug} />
                </div>
            </div>
        </div>
    );
};

export default function ProductPage({ params }: { params: { id: string } }) {
    const { id } = React.use(params as unknown as Promise<{ id: string }>);
    const { addItem, openCheckoutDrawer } = useCart();

    // Find the product
    const product = productsData.find((p) => p.id === id);

    if (!product) {
        notFound();
    }

    // Variation types and state
    const variationTypes = (product as any).variationTypes as Record<string, string[]> | undefined;
    const variations = (product as any).variations as Array<Record<string, string>> | undefined;
    const hasVariations = variationTypes && Object.keys(variationTypes).length > 0;

    // Initialize selected variations with first value of each type
    const initialSelections: Record<string, string> = {};
    if (variationTypes) {
        Object.entries(variationTypes).forEach(([key, values]) => {
            if (values.length > 0) initialSelections[key] = values[0];
        });
    }
    const [selectedVariations, setSelectedVariations] = useState<Record<string, string>>(initialSelections);

    // Find the matching variation for the current selection
    const findMatchingVariation = (selections: Record<string, string>) => {
        if (!variations) return null;
        return variations.find(v => {
            return Object.entries(selections).every(([key, value]) => v[key] === value);
        });
    };

    const handleVariationChange = (type: string, value: string) => {
        const newSelections = { ...selectedVariations, [type]: value };
        setSelectedVariations(newSelections);
        // If the matched variation has an image, update main image
        const matched = findMatchingVariation(newSelections);
        if (matched?.image) {
            setMainImage(matched.image);
        }
    };

    // Prepare images array fallback
    const images = product.images && product.images.length > 0 ? product.images : [product.image];
    const [mainImage, setMainImage] = useState(images[0]);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [showNotifyPopup, setShowNotifyPopup] = useState(false);
    const isOutOfStock = !!(product as any).outOfStock;

    // Compute current price based on selected variation
    const currentVariation = hasVariations ? findMatchingVariation(selectedVariations) : null;
    const currentPrice = currentVariation?.price ? Number(currentVariation.price) : product.price;
    const hasDifferentPrices = variations ? new Set(variations.map(v => v.price).filter(Boolean)).size > 1 : false;

    const getProductForCart = () => ({
        ...product,
        price: currentPrice,
        image: mainImage,
        selectedVariations: hasVariations ? selectedVariations : undefined,
        cartItemId: hasVariations ? `${product.id}-${Object.values(selectedVariations).join('-')}` : product.id
    });

    const handleAddToCart = () => {
        addItem(getProductForCart() as any);
    };

    const handleBuyNow = () => {
        addItem(getProductForCart() as any);
        openCheckoutDrawer();
    };

    // Helper for formatting text and brand swapping
    const formatText = (text: string) => {
        return text
            .replace(/&amp;/g, ' / ')
            .replace(/Insideast/gi, 'handmadebestseller')
            .replace(/contact@insideast\.com/gi, 'contact@handmadebestseller.com')
            .replace(/insideast\.com/gi, 'handmadebestseller.com');
    };

    // Parse description to extract Reviews and FAQ
    let mainDescriptionLines: string[] = [];
    let reviewLines: string[] = [];
    let faqLines: string[] = [];
    let currentMode = 'main';

    const lines = (product.description || '').split('\n');

    lines.forEach(line => {
        const t = line.trim();

        // Detect section changes
        const isReviewsHeader = t === 'Customer Reviews' || t === 'Reviews';
        const isReviewsStarTrigger = t.includes('★★★★★') && currentMode !== 'reviews';

        const isFaqHeader = t === 'Frequently Asked Questions' ||
            t === 'Questions' ||
            t === 'Support' ||
            t === 'Questions & Support' ||
            t === 'Support & Questions' ||
            t === 'Q&A' || t === 'Q/A';

        if ((isReviewsHeader || isReviewsStarTrigger) && currentMode !== 'reviews') {
            currentMode = 'reviews';
            if (isReviewsHeader) return; // Skip pushing the header itself
        } else if (isFaqHeader && currentMode !== 'faq') {
            currentMode = 'faq';
            return; // Skip adding the title itself
        } else if (currentMode === 'reviews' && (t.includes('Our Promise to You') || t.includes('Our No-Risk Promise') || t === 'Distinctive Features' || t === 'Key Dimensions' || t.includes('What\'s in the Box'))) {
            currentMode = 'main';
        } else if (currentMode === 'faq' && (t.includes('Configure &') || t.includes('Invest in') || t.includes('Handcrafted to Order'))) {
            currentMode = 'main';
        }

        if (currentMode === 'reviews') {
            reviewLines.push(line);
        } else if (currentMode === 'faq') {
            faqLines.push(line);
        } else {
            mainDescriptionLines.push(line);
        }
    });

    const mainDescription = mainDescriptionLines.join('\n');
    const reviewsText = formatText(reviewLines.join('\n').trim());
    const faqText = formatText(faqLines.join('\n').trim());

    // Parse main description dynamically into text and accordions based on '▼' or '&amp;' flags
    const parsedBlocks = (() => {
        const blocksLines = mainDescription.split('\n');
        const elements: any[] = [];
        let currentText = '';
        let currentAccordion: { title: string, content: string } | null = null;

        blocksLines.forEach(rawLine => {
            const isAccordionTitle = rawLine.includes('▼') || rawLine.includes('&amp;');
            const cleanLine = formatText(rawLine).replace('▼', '');

            if (isAccordionTitle) {
                if (currentAccordion) {
                    elements.push({ type: 'accordion', data: currentAccordion });
                } else if (currentText.trim()) {
                    elements.push({ type: 'text', data: currentText.trim() });
                }
                currentText = '';
                currentAccordion = {
                    title: cleanLine.trim(),
                    content: ''
                };
            } else {
                if (currentAccordion) {
                    currentAccordion.content += (currentAccordion.content ? '\n' : '') + cleanLine;
                } else {
                    currentText += (currentText ? '\n' : '') + cleanLine;
                }
            }
        });

        if (currentAccordion) {
            elements.push({ type: 'accordion', data: currentAccordion });
        } else if (currentText.trim()) {
            elements.push({ type: 'text', data: currentText.trim() });
        }

        return elements;
    })();

    // Upsell logic: pick 4 products from same category or fallback to any 4
    let relatedProducts = productsData
        .filter(p => p.id !== product.id && p.category === product.category)
        .slice(0, 4);

    if (relatedProducts.length < 4) {
        const fillers = productsData.filter(p => p.id !== product.id && !relatedProducts.includes(p));
        relatedProducts = [...relatedProducts, ...fillers.slice(0, 4 - relatedProducts.length)];
    }

    return (
        <div className={styles.container}>
            <div className={`container ${styles.productContainer}`}>
                {/* Product Layout Grid */}
                <div className={styles.productLayout}>

                    {/* Left Sticky Column */}
                    <div className={styles.leftColumn}>
                        <div className={styles.imageGallery}>
                            <img
                                src={mainImage}
                                alt={product.title}
                                className={styles.mainImage}
                                onClick={() => setIsLightboxOpen(true)}
                                style={{ cursor: 'zoom-in' }}
                            />

                            {images.length > 1 && (
                                <div className={styles.thumbnailStrip}>
                                    {images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            className={`${styles.thumbnailBtn} ${mainImage === img ? styles.activeThumb : ''}`}
                                            onClick={() => setMainImage(img)}
                                            aria-label={`View image ${idx + 1}`}
                                        >
                                            <img src={img} alt={`${product.title} alternate view ${idx + 1}`} className={styles.thumbnailImg} loading="lazy" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Scrolling Column */}
                    <div className={`${styles.rightColumn} fade-in delay-1`}>
                        <div className={styles.breadcrumbs}>
                            <Link href="/">Home</Link> <span className={styles.divider}>/</span>
                            <Link href={`/category/${product.category.toLowerCase()}`}>{product.category}</Link>
                        </div>

                        <h1 className={styles.title}>{product.title}</h1>
                        {isOutOfStock ? (
                            <p className={styles.outOfStockLabel}>Out of Stock</p>
                        ) : (
                            <div className={styles.priceBlock}>
                                {hasDifferentPrices && !currentVariation?.price && (
                                    <span className={styles.priceFrom}>From </span>
                                )}
                                <span className={styles.price}>${currentPrice.toFixed(2)}</span>
                            </div>
                        )}

                        {/* Variation Selectors */}
                        {hasVariations && variationTypes && (
                            <div className={styles.variationsSection}>
                                {Object.entries(variationTypes).map(([typeName, values]) => (
                                    <div key={typeName} className={styles.variationGroup}>
                                        <label className={styles.variationLabel}>
                                            {typeName}: <span className={styles.variationSelected}>{selectedVariations[typeName]}</span>
                                        </label>
                                        <div className={styles.variationOptions}>
                                            {values.map((value) => {
                                                const isSelected = selectedVariations[typeName] === value;
                                                // Check if this variation has an associated image (for color swatches)
                                                const matchedVar = variations?.find(v => v[typeName] === value);
                                                const hasImage = matchedVar?.image;

                                                return (
                                                    <button
                                                        key={value}
                                                        className={`${styles.variationBtn} ${isSelected ? styles.variationBtnActive : ''} ${hasImage ? styles.variationBtnSwatch : ''}`}
                                                        onClick={() => handleVariationChange(typeName, value)}
                                                        title={value}
                                                    >
                                                        {hasImage ? (
                                                            <img src={hasImage} alt={value} className={styles.variationSwatchImg} />
                                                        ) : (
                                                            <span>{value}</span>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className={styles.actions}>
                            {isOutOfStock ? (
                                <button
                                    id={`notify-product-page-${product.id}`}
                                    className={styles.btnNotify}
                                    onClick={() => setShowNotifyPopup(true)}
                                >
                                    🔔 Notify Me When Available
                                </button>
                            ) : (
                                <>
                                    <button className={styles.btnCart} onClick={handleAddToCart}>
                                        Add to Cart
                                    </button>
                                    <button
                                        className={styles.btnBuyNow}
                                        onClick={handleBuyNow}
                                    >
                                        Buy it Now
                                    </button>
                                </>
                            )}
                        </div>

                        <div className={styles.descriptionWrapper}>
                            {parsedBlocks.map((block, idx) => {
                                if (block.type === 'text') {
                                    return <p key={`text-${idx}`} className={styles.description}><RichText text={block.data} productSlug={product.slug} /></p>;
                                } else {
                                    return <Accordion key={`acc-${idx}`} title={block.data.title} content={block.data.content} productSlug={product.slug} />;
                                }
                            })}
                        </div>

                        <div className={styles.actions}>
                            <button className={styles.btnCart} onClick={handleAddToCart}>
                                Add to Cart
                            </button>
                        </div>

                        {reviewsText && (
                            <section className={styles.extraSection}>
                                <h3 className={styles.extraSectionTitle}>Customer Reviews</h3>
                                <div className={styles.extraSectionContent}>
                                    <RichText text={reviewsText} productSlug={product.slug} />
                                </div>
                            </section>
                        )}

                        {faqText && (
                            <section className={styles.extraSection}>
                                <h3 className={styles.extraSectionTitle}>Frequently Asked Questions</h3>
                                <div className={styles.extraSectionContent}>
                                    <RichText text={faqText} productSlug={product.slug} />
                                </div>
                            </section>
                        )}

                        <div className={styles.features}>
                            <ul className={styles.featureList}>
                                <li>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    Artisan Handcrafted
                                </li>
                                <li>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    Premium Materials
                                </li>
                                <li>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M10 14L21 3M18 20L10 14 3 17l1-5-4-3 10-1 4-6v6l6 4-6 2z" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    Worldwide Shipping
                                </li>
                                <li>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    Lifetime Warranty
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Upsell / Related Products */}
                {relatedProducts.length > 0 && (
                    <section className={`${styles.upsellSection} slide-up`}>
                        <h2 className={styles.upsellTitle}>You may also like</h2>
                        <div className={styles.upsellGrid}>
                            {relatedProducts.map((p, i) => (
                                <ProductCard key={p.id} product={p as any} index={i} />
                            ))}
                        </div>
                    </section>
                )}
            </div>

            {/* Sticky Mobile Bottom Bar */}
            <div className={styles.stickyMobileBar}>
                {isOutOfStock ? (
                    <button
                        className={`${styles.stickyBtnCart} ${styles.stickyBtnNotify}`}
                        style={{ flex: 'none', width: '100%' }}
                        onClick={() => setShowNotifyPopup(true)}
                    >
                        🔔 Notify Me When Available
                    </button>
                ) : (
                    <>
                        <button className={styles.stickyBtnCart} onClick={handleAddToCart}>
                            Add to Cart
                        </button>
                        <button
                            className={styles.stickyBtnBuy}
                            onClick={handleBuyNow}
                        >
                            Buy it Now
                        </button>
                    </>
                )}
            </div>

            {isLightboxOpen && (
                <ImageLightbox
                    images={images}
                    initialIndex={images.indexOf(mainImage) >= 0 ? images.indexOf(mainImage) : 0}
                    onClose={() => setIsLightboxOpen(false)}
                />
            )}

            {showNotifyPopup && (
                <NotifyMePopup
                    productName={product.title}
                    productId={product.id}
                    onClose={() => setShowNotifyPopup(false)}
                />
            )}
        </div>
    );
}
