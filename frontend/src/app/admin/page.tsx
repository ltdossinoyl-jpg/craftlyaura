"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './dashboard.module.css';

export default function AdminDashboardOverview() {
    const router = useRouter();
    const [stats, setStats] = useState({
        totalProducts: 0,
        publishedProducts: 0,
        draftProducts: 0,
        loading: true
    });

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        // Fetch actual product stats
        fetch('/api/products-admin')
            .then(res => res.json())
            .then(data => {
                const published = data.filter((p: any) => p.status === 'published' || p.status === undefined).length;
                const draft = data.filter((p: any) => p.status === 'draft').length;
                setStats({
                    totalProducts: data.length,
                    publishedProducts: published,
                    draftProducts: draft,
                    loading: false
                });
            })
            .catch(err => {
                console.error(err);
                setStats(s => ({ ...s, loading: false }));
            });
    }, []);

    const handleLogout = async () => {
        await fetch('/api/admin-logout', { method: 'POST' });
        router.push('/admin/login');
    };

    // Fake mock data for the dashboard to look premium and active
    const recentOrders = [
        { id: "#ORD-8921", customer: "Sarah Jenkins", email: "sarah.j**@gmail.com", date: "Just now", amount: "£245.00", status: "processing" },
        { id: "#ORD-8920", customer: "Michael Chen", email: "m.chen**@outlook.com", date: "2 hours ago", amount: "£1,120.00", status: "completed" },
        { id: "#ORD-8919", customer: "Emma Roberts", email: "emma.r**@icloud.com", date: "5 hours ago", amount: "£85.50", status: "shipped" },
        { id: "#ORD-8918", customer: "James Wilson", email: "wilson_j**@yahoo.com", date: "Yesterday", amount: "£450.00", status: "completed" },
        { id: "#ORD-8917", customer: "Olivia Davis", email: "olivia.d**@gmail.com", date: "Yesterday", amount: "£320.00", status: "completed" }
    ];

    const chartData = [12, 19, 15, 25, 22, 30, 28, 35, 42, 40, 55, 60];

    if (stats.loading) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
            Loading Craftly Aura Dashboard...
        </div>
    );

    return (
        <div className={styles.container}>
            {/* Top Navigation */}
            <header className={styles.header}>
                <div className={styles.logoArea}>
                    <div className={styles.logoIcon}>CA</div>
                    <h1 className={styles.headerTitle}>CRAFTLY AURA</h1>
                </div>

                <div style={{ display: 'none' }} className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    Menu
                </div>

                <div className={styles.headerActions}>
                    <Link href="/admin/products" className={styles.btnSecondary} style={{ marginRight: '1rem' }}>
                        📦 Manage Products
                    </Link>
                    <Link href="/" className={styles.btnSecondary} target="_blank">
                        👁️ View Live Store
                    </Link>
                    <button
                        onClick={handleLogout}
                        className={styles.btnDanger}
                    >
                        🔓 Logout
                    </button>
                </div>
            </header>

            <main className={styles.main}>
                <h2 className={styles.pageTitle}>Dashboard Overview</h2>
                <p className={styles.pageSubtitle}>Welcome back. Here is what is happening with your store today.</p>

                {/* Stats Grid */}
                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <div className={styles.statHeader}>
                            <span className={styles.statTitle}>Total Revenue</span>
                            <div className={`${styles.statIcon} ${styles.blue}`}>💰</div>
                        </div>
                        <div className={styles.statValue}>£24,592.50</div>
                        <div className={`${styles.statChange} ${styles.positive}`}>↑ 12.5% from last month</div>
                    </div>

                    <div className={styles.statCard}>
                        <div className={styles.statHeader}>
                            <span className={styles.statTitle}>Total Orders</span>
                            <div className={`${styles.statIcon} ${styles.green}`}>🛍️</div>
                        </div>
                        <div className={styles.statValue}>1,248</div>
                        <div className={`${styles.statChange} ${styles.positive}`}>↑ 8.2% from last month</div>
                    </div>

                    <div className={styles.statCard}>
                        <div className={styles.statHeader}>
                            <span className={styles.statTitle}>Catalog Products</span>
                            <div className={`${styles.statIcon} ${styles.purple}`}>📦</div>
                        </div>
                        <div className={styles.statValue}>{stats.totalProducts}</div>
                        <div className={styles.statChange}>
                            <span style={{ color: '#10b981', marginRight: '8px' }}>{stats.publishedProducts} Live</span>
                            <span style={{ color: '#f59e0b' }}>{stats.draftProducts} Draft</span>
                        </div>
                    </div>

                    <div className={styles.statCard}>
                        <div className={styles.statHeader}>
                            <span className={styles.statTitle}>Active Customers</span>
                            <div className={`${styles.statIcon} ${styles.orange}`}>👥</div>
                        </div>
                        <div className={styles.statValue}>892</div>
                        <div className={`${styles.statChange} ${styles.positive}`}>↑ 15% new users</div>
                    </div>
                </div>

                <div className={styles.contentGrid}>
                    {/* Left Column - Revenue Chart & Recent Orders */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div className={styles.card}>
                            <div className={styles.cardHeader}>
                                <h3 className={styles.cardTitle}>Sales Overview (Last 12 Months)</h3>
                            </div>
                            <div className={styles.cardBody}>
                                <div className={styles.chartContainer}>
                                    {chartData.map((val, idx) => (
                                        <div key={idx} className={styles.chartBar} style={{ height: `${val}%` }}>
                                            <div className={styles.chartLabel}>M{idx + 1}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className={styles.card}>
                            <div className={styles.cardHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 className={styles.cardTitle}>Recent Orders</h3>
                                <button className={styles.btnSecondary} style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem' }}>View All</button>
                            </div>
                            <div style={{ overflowX: 'auto' }}>
                                <table className={styles.table}>
                                    <thead>
                                        <tr>
                                            <th>Order ID</th>
                                            <th>Customer</th>
                                            <th>Date</th>
                                            <th>Amount</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentOrders.map((order, idx) => (
                                            <tr key={idx}>
                                                <td style={{ fontWeight: 500, color: '#4f46e5' }}>{order.id}</td>
                                                <td>
                                                    <div className={styles.customerInfo}>
                                                        <div className={styles.customerAvatar}>
                                                            {order.customer.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div style={{ fontWeight: 500 }}>{order.customer}</div>
                                                            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{order.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style={{ color: '#6b7280' }}>{order.date}</td>
                                                <td style={{ fontWeight: 600 }}>{order.amount}</td>
                                                <td>
                                                    <span className={`${styles.badge} ${styles[order.status]}`}>
                                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Store Activity & Quick Actions */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                        <div className={styles.card}>
                            <div className={styles.cardHeader}>
                                <h3 className={styles.cardTitle}>Quick Actions</h3>
                            </div>
                            <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <Link href="/admin/products" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', textDecoration: 'none', color: 'inherit', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.borderColor = '#4f46e5'} onMouseOut={e => e.currentTarget.style.borderColor = '#e5e7eb'}>
                                    <div style={{ fontSize: '1.5rem' }}>➕</div>
                                    <div>
                                        <div style={{ fontWeight: 600 }}>Add New Product</div>
                                        <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Create a new listing in your catalog</div>
                                    </div>
                                </Link>
                                <Link href="/admin/products" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', textDecoration: 'none', color: 'inherit', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.borderColor = '#4f46e5'} onMouseOut={e => e.currentTarget.style.borderColor = '#e5e7eb'}>
                                    <div style={{ fontSize: '1.5rem' }}>⚙️</div>
                                    <div>
                                        <div style={{ fontWeight: 600 }}>Store Settings</div>
                                        <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Manage navigation and API keys</div>
                                    </div>
                                </Link>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', opacity: 0.6, cursor: 'not-allowed' }}>
                                    <div style={{ fontSize: '1.5rem' }}>📈</div>
                                    <div>
                                        <div style={{ fontWeight: 600 }}>Marketing Center</div>
                                        <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Integration coming soon</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.card}>
                            <div className={styles.cardHeader}>
                                <h3 className={styles.cardTitle}>Recent Store Activity</h3>
                            </div>
                            <div className={styles.cardBody}>
                                <div className={styles.activityList}>
                                    <div className={styles.activityItem}>
                                        <div className={styles.activityIcon}>🔄</div>
                                        <div className={styles.activityContent}>
                                            <div className={styles.activityText}>Inventory synced successfully</div>
                                            <div className={styles.activityTime}>Just now</div>
                                        </div>
                                    </div>
                                    <div className={styles.activityItem}>
                                        <div className={styles.activityIcon}>📝</div>
                                        <div className={styles.activityContent}>
                                            <div className={styles.activityText}>Product "Handcrafted Leather Bag" updated</div>
                                            <div className={styles.activityTime}>2 hours ago</div>
                                        </div>
                                    </div>
                                    <div className={styles.activityItem}>
                                        <div className={styles.activityIcon}>👤</div>
                                        <div className={styles.activityContent}>
                                            <div className={styles.activityText}>New merchant account "Sarah J." registered</div>
                                            <div className={styles.activityTime}>1 day ago</div>
                                        </div>
                                    </div>
                                    <div className={styles.activityItem}>
                                        <div className={styles.activityIcon}>🚀</div>
                                        <div className={styles.activityContent}>
                                            <div className={styles.activityText}>Store performance optimizations deployed</div>
                                            <div className={styles.activityTime}>2 days ago</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}
