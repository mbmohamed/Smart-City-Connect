import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bus, Wind, Siren, Home } from 'lucide-react';

function Navbar() {
    const location = useLocation();

    const navItems = [
        { path: '/', icon: Home, label: 'Dashboard' },
        { path: '/mobility', icon: Bus, label: 'Mobilité', color: 'text-blue-400' },
        { path: '/air-quality', icon: Wind, label: 'Qualité de l\'Air', color: 'text-green-400' },
        { path: '/emergency', icon: Siren, label: 'Urgences', color: 'text-red-400' },
    ];

    return (
        <nav className="bg-bg-card border-b border-gray-700 shadow-lg">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-blue to-accent-orange rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xl">SC</span>
                        </div>
                        <span className="text-xl font-bold text-text-primary">
                            Smart City Connect
                        </span>
                    </div>

                    <div className="flex space-x-1">
                        {navItems.map(({ path, icon: Icon, label, color }) => (
                            <Link
                                key={path}
                                to={path}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${location.pathname === path
                                        ? 'bg-primary-blue text-white'
                                        : 'text-text-secondary hover:bg-gray-700 hover:text-text-primary'
                                    }`}
                            >
                                <Icon className={`w-5 h-5 ${location.pathname === path ? '' : color}`} />
                                <span className="font-medium">{label}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
