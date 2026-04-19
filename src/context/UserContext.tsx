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
    const [user, setUser] = useState<User | null>(null);

    // Initial load from local storage
    useEffect(() => {
        const storedUser = localStorage.getItem('craftly_aura_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const loginWithGoogle = () => {
        // Simulated Google Login
        const mockUser: User = {
            id: 'google_oauth_' + Math.random().toString(36).substring(7),
            name: 'Demo User',
            email: 'demo@gmail.com',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
            fidelityPoints: 850, // Starting with 850 points
            isExclusiveMember: false,
            exclusiveItems: [],
            referralCode: 'REF-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
            totalReferrals: 3,
            successfulReferrals: 1
        };
        setUser(mockUser);
        localStorage.setItem('craftly_aura_user', JSON.stringify(mockUser));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('craftly_aura_user');
    };

    const redeemPoints = () => {
        if (user && user.fidelityPoints >= 1000) {
            const updatedUser = { ...user, fidelityPoints: user.fidelityPoints - 1000 };
            setUser(updatedUser);
            localStorage.setItem('craftly_aura_user', JSON.stringify(updatedUser));
            return VIP_COUPON_CODES[Math.floor(Math.random() * VIP_COUPON_CODES.length)];
        }
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
