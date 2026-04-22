"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
    id: string;
    name: string;
    email: string;
    password?: string; // Stored in simulated DB
    avatar: string;
    fidelityPoints: number;
    isExclusiveMember: boolean;
    exclusiveItems: string[];
    referralCode: string;
    totalReferrals: number;
    successfulReferrals: number;
}

export const VIP_COUPON_CODES = [
    "CRAFTLY-VIP50-ABC123", "CRAFTLY-VIP50-XYZ987", "CRAFTLY-VIP50-LMN456",
    "CRAFTLY-VIP50-OPQ321", "CRAFTLY-VIP50-RST000", "CRAFTLY-VIP50-UVW111",
    "CRAFTLY-VIP50-EFG222", "CRAFTLY-VIP50-HIJ333", "CRAFTLY-VIP50-KLM444",
    "CRAFTLY-VIP50-NOP555"
];

interface UserContextType {
    user: User | null;
    loginWithGoogle: () => void;
    login: (email: string, pass: string) => Promise<boolean>;
    register: (name: string, email: string, pass: string) => Promise<boolean>;
    logout: () => void;
    redeemPoints: () => string | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    // Initial load
    useEffect(() => {
        const activeEmail = localStorage.getItem('active_user_email');
        if (activeEmail) {
            const usersDB = JSON.parse(localStorage.getItem('users_db') || '{"users":[]}');
            const foundUser = usersDB.users.find((u: User) => u.email === activeEmail);
            if (foundUser) setUser(foundUser);
        }
    }, []);

    const _saveUser = (newUser: User) => {
        const usersDB = JSON.parse(localStorage.getItem('users_db') || '{"users":[]}');
        const existingIndex = usersDB.users.findIndex((u: User) => u.email === newUser.email);
        if (existingIndex >= 0) {
            usersDB.users[existingIndex] = newUser;
        } else {
            usersDB.users.push(newUser);
        }
        localStorage.setItem('users_db', JSON.stringify(usersDB));
        localStorage.setItem('active_user_email', newUser.email);
        setUser(newUser);
    };

    const loginWithGoogle = () => {
        const mockEmail = 'demo-' + Math.floor(Math.random() * 1000) + '@gmail.com';
        const mockUser: User = {
            id: 'google_oauth_' + Math.random().toString(36).substring(7),
            name: 'Demo User',
            email: mockEmail,
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
            fidelityPoints: 850,
            isExclusiveMember: false,
            exclusiveItems: [],
            referralCode: 'REF-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
            totalReferrals: 3,
            successfulReferrals: 1
        };
        _saveUser(mockUser);
    };

    const login = async (email: string, pass: string) => {
        const usersDB = JSON.parse(localStorage.getItem('users_db') || '{"users":[]}');
        const foundUser = usersDB.users.find((u: User) => u.email.toLowerCase() === email.toLowerCase() && u.password === pass);
        if (foundUser) {
            _saveUser(foundUser);
            return true;
        }
        return false;
    };

    const register = async (name: string, email: string, pass: string) => {
        const usersDB = JSON.parse(localStorage.getItem('users_db') || '{"users":[]}');
        if (usersDB.users.some((u: User) => u.email.toLowerCase() === email.toLowerCase())) {
            return false; // Email exists
        }

        const newUser: User = {
            id: 'local_' + Math.random().toString(36).substring(7),
            name,
            email,
            password: pass,
            avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${name}`,
            fidelityPoints: 100, // 100 points signup bonus
            isExclusiveMember: false,
            exclusiveItems: [],
            referralCode: 'REF-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
            totalReferrals: 0,
            successfulReferrals: 0
        };
        _saveUser(newUser);
        return true;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('active_user_email');
    };

    const redeemPoints = () => {
        if (user && user.fidelityPoints >= 1000) {
            const updatedUser = { ...user, fidelityPoints: user.fidelityPoints - 1000 };
            _saveUser(updatedUser);
            return VIP_COUPON_CODES[Math.floor(Math.random() * VIP_COUPON_CODES.length)];
        }
        return null;
    };

    return (
        <UserContext.Provider value={{ user, loginWithGoogle, login, register, logout, redeemPoints }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (!context) throw new Error('useUser must be used within a UserProvider');
    return context;
}
