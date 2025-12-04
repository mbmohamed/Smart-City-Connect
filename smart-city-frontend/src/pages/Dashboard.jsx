import React, { useState, useEffect } from 'react';
import { Bus, Wind, Siren, Activity, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

function Dashboard() {
    const [stats, setStats] = useState({
        totalLines: 0,
        averageAQI: 0,
        activeAlerts: 0
    });

    // Fetch stats from all services
    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch from mobility service
                const mobilityRes = await fetch('http://localhost:8080/api/v1/transport/lines');
                const mobilityData = await mobilityRes.json();

                setStats(prev => ({
                    ...prev,
                    totalLines: mobilityData.length
                }));
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };

        fetchStats();
    }, []);

    const services = [
        {
            title: 'Mobilité Urbaine',
            description: 'Gestion des transports en commun',
            icon: Bus,
            color: 'from-blue-500 to-blue-700',
            stat: `${stats.totalLines} lignes`,
            path: '/mobility',
            protocol: 'REST'
        },
        {
            title: 'Qualité de l\'Air',
            description: 'Surveillance environnementale',
            icon: Wind,
            color: 'from-green-500 to-green-700',
            stat: 'Données en temps réel',
            path: '/air-quality',
            protocol: 'SOAP'
        },
        {
            title: 'Urgences & Santé',
            description: 'Gestion des alertes critiques',
            icon: Siren,
            color: 'from-red-500 to-red-700',
            stat: `${stats.activeAlerts} alertes actives`,
            path: '/emergency',
            protocol: 'gRPC'
        }
    ];

    return (
        <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center py-12">
                <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-green-400 to-red-400 bg-clip-text text-transparent">
                    Smart City Connect
                </h1>
                <p className="text-xl text-text-secondary max-w-2xl mx-auto">
                    Plateforme intelligente de gestion urbaine intégrant REST, SOAP et gRPC
                </p>
            </div>

            {/* Service Cards */}
            <div className="grid md:grid-cols-3 gap-6">
                {services.map((service) => (
                    <Link
                        key={service.path}
                        to={service.path}
                        className="group"
                    >
                        <div className="card hover:scale-105 transition-all duration-300 cursor-pointer h-full">
                            <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                <service.icon className="w-8 h-8 text-white" />
                            </div>

                            <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
                            <p className="text-text-secondary mb-4">{service.description}</p>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                                <span className="text-sm font-mono bg-gray-700 px-3 py-1 rounded">
                                    {service.protocol}
                                </span>
                                <span className="text-lg font-semibold text-blue-400">
                                    {service.stat}
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Quick Stats */}
            <div className="card">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                    <Activity className="w-6 h-6 mr-2 text-green-400" />
                    Statistiques en Direct
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-gray-700 rounded-lg">
                        <div className="text-4xl font-bold text-blue-400 mb-2">
                            {stats.totalLines}
                        </div>
                        <div className="text-sm text-text-secondary">
                            Lignes de transport
                        </div>
                    </div>
                    <div className="text-center p-4 bg-gray-700 rounded-lg">
                        <div className="text-4xl font-bold text-green-400 mb-2">
                            Bon
                        </div>
                        <div className="text-sm text-text-secondary">
                            Qualité de l'air moyenne
                        </div>
                    </div>
                    <div className="text-center p-4 bg-gray-700 rounded-lg">
                        <div className="text-4xl font-bold text-red-400 mb-2">
                            {stats.activeAlerts}
                        </div>
                        <div className="text-sm text-text-secondary">
                            Alertes actives
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
