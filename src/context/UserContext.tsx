"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
    id: string;
    name: string;
    email: string;
    avatar: string;
    fidelityPoints: number;
    isExclusiveMember: boolean;
    exclusiveItems: string[];
    referralCode: string;
    totalReferrals: number;
    successfulReferrals: number;
}

export const VIP_COUPON_CODES = [
    "CRAFTLY-VIP50-ABC123",
    "CRAFTLY-VIP50-XYZ987",
    "CRAFTLY-VIP50-LMN456",
    "CRAFTLY-VIP50-OPQ321",
    "CRAFTLY-VIP50-RST000",
    "CRAFTLY-VIP50-UVW111",
    "CRAFTLY-VIP50-EFG222",
    "CRAFTLY-VIP50-HIJ333",
    "CRAFTLY-VIP50-KLM444",
    "CRAFTLY-VIP50-NOP555"
];

interface UserContextType {
    user: User | null;
    loginWithGoogle: () => void;
    logout: () => void;
    redeemPoints: () => string | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user] = useState<User | null>(null);

    // Real authentication coming soon — user accounts are disabled in this version.
    // When integrating a real auth provider (NextAuth, Supabase, etc.), replace this context.

    const loginWithGoogle = () => {
        // No-op in production — real auth not yet wired
        console.warn('User authentication is not yet enabled in production.');
    };

    const logout = () => {
        // No-op in production
    };

    const redeemPoints = (): string | null => {
        return null;
    };

    return (
        <UserContext.Provider value={{ user, loginWithGoogle, logout, redeemPoints }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}
