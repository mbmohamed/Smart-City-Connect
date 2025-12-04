import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Bus, Wind, Siren, Users, Sparkles } from 'lucide-react';

function Navbar() {
    const location = useLocation();

    const navItems = [
        { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/mobility', icon: Bus, label: 'Mobilité' },
        { path: '/air-quality', icon: Wind, label: 'Air Quality' },
        { path: '/emergency', icon: Siren, label: 'Urgences' },
        { path: '/citizen', icon: Users, label: 'Citoyens' },
    ];

    return (
        <nav className="sticky top-0 z-40 backdrop-blur-xl border-b border-white/10">
            <div className="absolute inset-0 bg-gradient-to-r from-bg-dark/95 via-bg-dark/90 to-bg-dark/95" />

            <div className="container mx-auto px-6 relative">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="relative">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent-cyan flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <div className="absolute -inset-1 bg-gradient-to-br from-primary to-accent-cyan rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-bold text-text-primary tracking-tight">
                                Smart City
                            </span>
                            <span className="text-xs font-medium text-text-secondary tracking-wider uppercase">
                                Connect Platform
                            </span>
                        </div>
                    </Link>

                    {/* Navigation Links */}
                    <div className="flex items-center gap-1">
                        {navItems.map(({ path, icon: Icon, label }) => {
                            const isActive = location.pathname === path;
                            return (
                                <Link
                                    key={path}
                                    to={path}
                                    className={`nav-link ${isActive ? 'active' : ''}`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="hidden lg:block">{label}</span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Status Indicator */}
                    <div className="hidden md:flex items-center gap-3">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                            <div className="w-2 h-2 rounded-full bg-accent-emerald pulse-dot" style={{ color: 'rgba(16, 185, 129, 0.5)' }} />
                            <span className="text-sm font-medium text-text-secondary">
                                System Online
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
