"use client";

import Image from 'next/image';
import { useState } from 'react';

const PLACEHOLDER = '/images/placeholder.svg';

interface ProductImageProps {
    src: string;
    alt: string;
    className?: string;
    fill?: boolean;
    width?: number;
    height?: number;
    sizes?: string;
    priority?: boolean;
    style?: React.CSSProperties;
    onClick?: () => void;
}

/**
 * A wrapper around next/image that:
 * 1. Handles external URLs (https://) with unoptimized mode
 * 2. Falls back to a placeholder on load error (404, broken images)
 * 3. Handles empty/invalid src gracefully
 */
export default function ProductImage({
    src,
    alt,
    className,
    fill,
    width,
    height,
    sizes,
    priority,
    style,
    onClick,
}: ProductImageProps) {
    const [imgSrc, setImgSrc] = useState(src || PLACEHOLDER);
    const [hasError, setHasError] = useState(false);

    const handleError = () => {
        if (!hasError) {
            setHasError(true);
            setImgSrc(PLACEHOLDER);
        }
    };

    // Use the source as-is — next/image with unoptimized handles both local and external
    const safeSrc = imgSrc || PLACEHOLDER;

    return (
        <Image
            src={safeSrc}
            alt={alt}
            className={className}
            fill={fill}
            width={!fill ? width : undefined}
            height={!fill ? height : undefined}
            sizes={sizes}
            priority={priority}
            style={style}
            onClick={onClick}
            onError={handleError}
            unoptimized
        />
    );
}
