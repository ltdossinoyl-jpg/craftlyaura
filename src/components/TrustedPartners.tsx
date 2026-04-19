"use client";

import { useEffect } from 'react';
import './TrustedPartners.css';

export default function TrustedPartners() {
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
        let touchEndX = 0;

        const handleTouchStart = (e: TouchEvent) => {
            touchStartX = e.changedTouches[0].screenX;
            clearInterval(autoScroll);
        };

        const handleTouchEnd = (e: TouchEvent) => {
            touchEndX = e.changedTouches[0].screenX;
            if (touchStartX - touchEndX > 50) moveNext();
            clearInterval(autoScroll);
            autoScroll = setInterval(moveNext, intervalSpeed);
        };

        track.addEventListener('touchstart', handleTouchStart, { passive: true });
        track.addEventListener('touchend', handleTouchEnd, { passive: true });

        // Mouse Drag Support
        let isDragging = false;
        let startX = 0;
        let scrollLeft = 0;

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
    }, []);

    return (
        <section className="section section--padding color-scheme-1" style={{ paddingTop: '0px', paddingBottom: '0px' }}>
            <div id="ia-reviews-editorial">
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', letterSpacing: '0.05em' }}>Testimonials</h2>
                </div>

                <div className="ia-editorial-viewport">
                    <div className="ia-editorial-track" id="ia-track" style={{ transition: 'none', transform: 'translateX(0px)' }}>

                        <div className="ia-editorial-card" style={{ backgroundImage: "url('/images/collections/WhatsApp_Image_2026-03-04_at_4.35.54_PM.jpg')" }}>
                            <div className="ia-editorial-content">
                                <div className="ia-editorial-header">
                                    <div className="ia-stars">★★★★★</div>
                                    <div className="ia-quote-icon">❝</div>
                                </div>
                                <p className="ia-review-text">"I recently ordered a few baskets from HandMadeBestSeller and was so impressed! The craftsmanship is truly lovely – each piece feels carefully and thoughtfully made. Their customer service was also excellent. A beautiful shopping experience all around!"</p>
                                <div className="ia-author">
                                    <div className="ia-avatar">L</div>
                                    <div className="ia-meta">
                                        <h4>Lisa</h4>
                                        <span>Customer</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="ia-editorial-card" style={{ backgroundImage: "url('/images/collections/457a26993f776af9db8a2a2f083770e9f5f63aa6bc75a8f5423d614cfa76f37f.jpg')" }}>
                            <div className="ia-editorial-content">
                                <div className="ia-editorial-header">
                                    <div className="ia-stars">★★★★★</div>
                                    <div className="ia-quote-icon">❝</div>
                                </div>
                                <p className="ia-review-text">"We ordered these baskets and they are absolutely gorgeous! We’re using them as gift baskets for our hotel guests, and they have been a perfect fit for our property. Beautifully made, high-quality, and thoughtfully crafted. We’ll definitely be ordering again!"</p>
                                <div className="ia-author">
                                    <div className="ia-avatar">AB</div>
                                    <div className="ia-meta">
                                        <h4>Amy Bauer</h4>
                                        <span>Eco-friendly Resort</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="ia-editorial-card" style={{ backgroundImage: "url('/images/collections/85e5f139d8cd064303760ea154676dcdd1494d2929d04815bd030b8ed5c576e1_1600x.webp')" }}>
                            <div className="ia-editorial-content">
                                <div className="ia-editorial-header">
                                    <div className="ia-stars">★★★★★</div>
                                    <div className="ia-quote-icon">❝</div>
                                </div>
                                <p className="ia-review-text">"With an absolutely extensive communication, we felt highly appreciated as a customer of this supplier. The products were real artisan-made and so soft and lovely leather, and well made. Perfect!"</p>
                                <div className="ia-author">
                                    <div className="ia-avatar">MG</div>
                                    <div className="ia-meta">
                                        <h4>Martha Greene</h4>
                                        <span>Retailer, Norway</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Duplicated for scroll effect */}
                        <div className="ia-editorial-card" style={{ backgroundImage: "url('/images/collections/WhatsApp_Image_2026-03-04_at_4.35.54_PM.jpg')" }}>
                            <div className="ia-editorial-content">
                                <div className="ia-editorial-header">
                                    <div className="ia-stars">★★★★★</div>
                                    <div className="ia-quote-icon">❝</div>
                                </div>
                                <p className="ia-review-text">"I recently ordered a few baskets from HandMadeBestSeller and was so impressed! The craftsmanship is truly lovely – each piece feels carefully and thoughtfully made. Their customer service was also excellent. A beautiful shopping experience all around!"</p>
                                <div className="ia-author">
                                    <div className="ia-avatar">L</div>
                                    <div className="ia-meta">
                                        <h4>Lisa</h4>
                                        <span>Customer</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="ia-editorial-card" style={{ backgroundImage: "url('/images/collections/457a26993f776af9db8a2a2f083770e9f5f63aa6bc75a8f5423d614cfa76f37f.jpg')" }}>
                            <div className="ia-editorial-content">
                                <div className="ia-editorial-header">
                                    <div className="ia-stars">★★★★★</div>
                                    <div className="ia-quote-icon">❝</div>
                                </div>
                                <p className="ia-review-text">"We ordered these baskets and they are absolutely gorgeous! We’re using them as gift baskets for our hotel guests, and they have been a perfect fit for our property. Beautifully made, high-quality, and thoughtfully crafted. We’ll definitely be ordering again!"</p>
                                <div className="ia-author">
                                    <div className="ia-avatar">AB</div>
                                    <div className="ia-meta">
                                        <h4>Amy Bauer</h4>
                                        <span>Eco-friendly Resort</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="ia-editorial-card" style={{ backgroundImage: "url('/images/collections/85e5f139d8cd064303760ea154676dcdd1494d2929d04815bd030b8ed5c576e1_1600x.webp')" }}>
                            <div className="ia-editorial-content">
                                <div className="ia-editorial-header">
                                    <div className="ia-stars">★★★★★</div>
                                    <div className="ia-quote-icon">❝</div>
                                </div>
                                <p className="ia-review-text">"With an absolutely extensive communication, we felt highly appreciated as a customer of this supplier. The products were real artisan-made and so soft and lovely leather, and well made. Perfect!"</p>
                                <div className="ia-author">
                                    <div className="ia-avatar">MG</div>
                                    <div className="ia-meta">
                                        <h4>Martha Greene</h4>
                                        <span>Retailer, Norway</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}
