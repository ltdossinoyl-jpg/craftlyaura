"use client";

import { useEffect, useState } from 'react';
import './TrustedPartners.css';

const REVIEWS = [
    {
        text: "\"This leather bag exceeded all my expectations. The stitching, the feel of the leather, everything screams luxury. I carry it daily and always get compliments. Truly a masterpiece of craftsmanship!\"",
        name: "Sarah Mitchell",
        initials: "SM",
        role: "Verified Buyer, USA"
    },
    {
        text: "\"I ordered the barrel bag for my wife's birthday and she absolutely loved it. The quality is unmatched — you can feel the artisan touch in every detail. Will definitely be coming back for more!\"",
        name: "James Richardson",
        initials: "JR",
        role: "Verified Buyer, UK"
    },
    {
        text: "\"As a fashion blogger, I've seen hundreds of bags. CraftlyAura stands out with their genuine handcrafted quality. The leather ages beautifully and the hardware is premium. A must-have brand!\"",
        name: "Amira Khaled",
        initials: "AK",
        role: "Fashion Blogger, Dubai"
    },
    {
        text: "\"I purchased the executive briefcase and it's absolutely stunning. Perfect for business meetings — professional yet uniquely stylish. The interior organization is incredibly well thought out.\"",
        name: "David Chen",
        initials: "DC",
        role: "Verified Buyer, Canada"
    },
    {
        text: "\"The attention to detail is remarkable. From the brass buckles to the hand-stitched seams, every element of my tote bag tells a story of true craftsmanship. Worth every penny!\"",
        name: "Olivia Perez",
        initials: "OP",
        role: "Interior Designer, Spain"
    },
    {
        text: "\"I've been searching for an authentic handmade leather travel bag for years. CraftlyAura delivered beyond what I imagined. The duffel is spacious, durable, and absolutely gorgeous.\"",
        name: "Marcus Williams",
        initials: "MW",
        role: "Frequent Traveler, Australia"
    },
    {
        text: "\"Bought the colorful patterned barrel bag as a gift for my daughter. She was over the moon! The vibrant colors and buttery-soft leather make it her favorite accessory. Thank you CraftlyAura!\"",
        name: "Nadia Benali",
        initials: "NB",
        role: "Verified Buyer, Morocco"
    },
    {
        text: "\"Outstanding customer service and even better products. My shoulder bag arrived beautifully packaged, and the leather smells divine. It's clear this is made with passion and love.\"",
        name: "Emma Thompson",
        initials: "ET",
        role: "Verified Buyer, Ireland"
    },
];

export default function TrustedPartners() {
    const [productImages, setProductImages] = useState<string[]>([]);

    useEffect(() => {
        // Fetch random product images from MongoDB
        fetch('/api/products')
            .then(res => res.json())
            .then((data: any[]) => {
                if (Array.isArray(data) && data.length > 0) {
                    // Shuffle and pick images
                    const shuffled = [...data].sort(() => Math.random() - 0.5);
                    const images = shuffled
                        .map(p => p.image || (p.images && p.images[0]))
                        .filter(Boolean)
                        .slice(0, REVIEWS.length);
                    setProductImages(images);
                }
            })
            .catch(() => { });
    }, []);

    useEffect(() => {
        const track = document.getElementById('ia-track');
        if (!track) return;

        const intervalSpeed = 4500;
        let autoScroll: NodeJS.Timeout;

        function moveNext() {
            if (!track) return;
            const firstCard = track.firstElementChild as HTMLElement;
            if (!firstCard) return;

            const cardWidth = firstCard.getBoundingClientRect().width;
            const style = window.getComputedStyle(track);
            const gap = parseFloat(style.columnGap) || 20;
            const moveAmount = cardWidth + gap;

            track.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            track.style.transform = `translateX(-${moveAmount}px)`;

            const handleTransitionEnd = function () {
                track.style.transition = 'none';
                track.style.transform = 'translateX(0)';
                track.appendChild(firstCard);
                track.removeEventListener('transitionend', handleTransitionEnd);
            };

            track.addEventListener('transitionend', handleTransitionEnd);
        }

        autoScroll = setInterval(moveNext, intervalSpeed);

        const handleMouseEnter = () => clearInterval(autoScroll);
        const handleMouseLeave = () => {
            clearInterval(autoScroll);
            autoScroll = setInterval(moveNext, intervalSpeed);
        };

        track.addEventListener('mouseenter', handleMouseEnter);
        track.addEventListener('mouseleave', handleMouseLeave);

        let touchStartX = 0;

        const handleTouchStart = (e: TouchEvent) => {
            touchStartX = e.changedTouches[0].screenX;
            clearInterval(autoScroll);
        };

        const handleTouchEnd = (e: TouchEvent) => {
            const touchEndX = e.changedTouches[0].screenX;
            if (touchStartX - touchEndX > 50) moveNext();
            clearInterval(autoScroll);
            autoScroll = setInterval(moveNext, intervalSpeed);
        };

        track.addEventListener('touchstart', handleTouchStart, { passive: true });
        track.addEventListener('touchend', handleTouchEnd, { passive: true });

        let isDragging = false;
        let startX = 0;

        const handleMouseDown = (e: MouseEvent) => {
            isDragging = true;
            startX = e.pageX;
            clearInterval(autoScroll);
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;
            e.preventDefault();
        };

        const handleMouseUp = (e: MouseEvent) => {
            if (!isDragging) return;
            isDragging = false;
            const endX = e.pageX;
            if (startX - endX > 50) moveNext();
            autoScroll = setInterval(moveNext, intervalSpeed);
        };

        track.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            clearInterval(autoScroll);
            if (track) {
                track.removeEventListener('mouseenter', handleMouseEnter);
                track.removeEventListener('mouseleave', handleMouseLeave);
                track.removeEventListener('touchstart', handleTouchStart);
                track.removeEventListener('touchend', handleTouchEnd);
                track.removeEventListener('mousedown', handleMouseDown);
            }
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [productImages]);

    // Double the reviews for infinite scroll effect
    const allReviews = [...REVIEWS, ...REVIEWS];

    // Default fallback image
    const fallbackImg = '/images/collections/WhatsApp_Image_2026-03-04_at_4.35.54_PM.jpg';

    const getImage = (index: number) => {
        if (productImages.length > 0) {
            return productImages[index % productImages.length];
        }
        return fallbackImg;
    };

    return (
        <section className="section section--padding color-scheme-1" style={{ paddingTop: '0px', paddingBottom: '0px' }}>
            <div id="ia-reviews-editorial">
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', letterSpacing: '0.05em' }}>What Our Customers Say</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.5rem' }}>Real reviews from real customers worldwide</p>
                </div>

                <div className="ia-editorial-viewport">
                    <div className="ia-editorial-track" id="ia-track" style={{ transition: 'none', transform: 'translateX(0px)' }}>
                        {allReviews.map((review, i) => (
                            <div key={i} className="ia-editorial-card" style={{ backgroundImage: `url('${getImage(i)}')` }}>
                                <div className="ia-editorial-content">
                                    <div className="ia-editorial-header">
                                        <div className="ia-stars">★★★★★</div>
                                        <div className="ia-quote-icon">❝</div>
                                    </div>
                                    <p className="ia-review-text">{review.text}</p>
                                    <div className="ia-author">
                                        <div className="ia-avatar">{review.initials}</div>
                                        <div className="ia-meta">
                                            <h4>{review.name}</h4>
                                            <span>{review.role}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
