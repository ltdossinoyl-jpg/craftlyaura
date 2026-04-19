"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './HeroSlideshow.module.css';

const SLIDES = [
    {
        subtitle: "Experience Authentic Craftsmanship",
        title: "Where Culture Meets Craftsmanship",
        buttonText: "EXPLORE",
        buttonLink: "/catalog",
        image: "/images/ai/hero_1.png"
    },
    {
        subtitle: "Ready to build an order?",
        title: "Crafted by Tradition, Inspired by Nature.",
        buttonText: "EXPLORE COLLECTIONS",
        buttonLink: "/catalog",
        image: "/images/ai/hero_2.png"
    },
    {
        subtitle: "Purely Moroccan Artisan Goods",
        title: "Handcrafted with Sustainable Practices",
        buttonText: "View Catalog",
        buttonLink: "/catalog",
        image: "/images/ai/hero_3.png"
    }
];

export default function HeroSlideshow() {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className={styles.hero}>
            {SLIDES.map((slide, index) => (
                <div
                    key={index}
                    className={`${styles.slide} ${index === currentSlide ? styles.active : ''}`}
                >
                    <div className={styles.heroOverlay}></div>
                    <Image
                        src={slide.image}
                        alt={slide.title}
                        className={styles.heroImage}
                        fill
                        priority={index === 0} // LCP optimization
                        sizes="100vw"
                    />
                    <div className={styles.heroContent}>
                        <p className={`${styles.heroSubtitle} ${index === currentSlide ? 'slide-up' : ''}`}>
                            {slide.subtitle}
                        </p>
                        <h1 className={`${styles.heroTitle} ${index === currentSlide ? 'slide-up delay-1' : ''}`}>
                            {slide.title}
                        </h1>
                        <div className={index === currentSlide ? 'fade-in delay-2' : ''}>
                            <Link href={slide.buttonLink} className={styles.heroBtn}>
                                {slide.buttonText}
                            </Link>
                        </div>
                    </div>
                </div>
            ))}

            <div className={styles.dots}>
                {SLIDES.map((_, index) => (
                    <button
                        key={index}
                        className={`${styles.dot} ${index === currentSlide ? styles.dotActive : ''}`}
                        onClick={() => setCurrentSlide(index)}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    );
}
