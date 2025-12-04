import React, { useState, useEffect } from 'react';
import { Bus, Wind, Siren, Users, Activity, TrendingUp, ArrowRight, Zap, Globe, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

function Dashboard() {
    const [stats, setStats] = useState({
        totalLines: 0,
        averageAQI: 0,
        activeAlerts: 0,
        totalEvents: 0
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const mobilityRes = await fetch('http://localhost:8080/api/v1/transport/lines');
                const mobilityData = await mobilityRes.json();
                setStats(prev => ({ ...prev, totalLines: mobilityData.length }));
            } catch (error) {
                console.log('Services loading...');
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, []);

    const services = [
        {
            title: 'Mobilité Urbaine',
            description: 'Gestion intelligente des transports publics en temps réel',
            icon: Bus,
            gradient: 'from-blue-500 via-blue-600 to-indigo-700',
            glowColor: 'rgba(59, 130, 246, 0.5)',
            stat: `${stats.totalLines} lignes`,
            path: '/mobility',
            protocol: 'REST'
        },
        {
            title: 'Qualité de l\'Air',
            description: 'Surveillance environnementale et indices de pollution',
            icon: Wind,
            gradient: 'from-emerald-400 via-teal-500 to-cyan-600',
            glowColor: 'rgba(16, 185, 129, 0.5)',
            stat: 'Temps réel',
            path: '/air-quality',
            protocol: 'SOAP'
        },
        {
            title: 'Centre d\'Urgences',
            description: 'Gestion des alertes critiques et ressources d\'urgence',
            icon: Siren,
            gradient: 'from-rose-500 via-red-500 to-orange-600',
            glowColor: 'rgba(244, 63, 94, 0.5)',
            stat: `${stats.activeAlerts} actives`,
            path: '/emergency',
            protocol: 'gRPC'
        },
        {
            title: 'Engagement Citoyen',
            description: 'Événements communautaires et signalements citoyens',
            icon: Users,
            gradient: 'from-violet-500 via-purple-500 to-fuchsia-600',
            glowColor: 'rgba(139, 92, 246, 0.5)',
            stat: `${stats.totalEvents} événements`,
            path: '/citizen',
            protocol: 'GraphQL'
        }
    ];

    const features = [
        { icon: Zap, title: 'Temps Réel', description: 'Données actualisées en continu' },
        { icon: Globe, title: 'Multi-Protocole', description: 'REST, SOAP, gRPC, GraphQL' },
        { icon: Shield, title: 'Sécurisé', description: 'Infrastructure fiable' }
    ];

    return (
        <div className="space-y-16 pb-12">
            {/* Hero Section */}
            <section className="relative pt-8 pb-16">
                {/* Background Effects */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
                    <div className="absolute top-20 right-1/4 w-80 h-80 bg-accent-cyan/20 rounded-full blur-3xl" />
                </div>

                <div className="relative text-center max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
                        <div className="w-2 h-2 rounded-full bg-accent-emerald animate-pulse" />
                        <span className="text-sm font-medium text-text-secondary">
                            Plateforme Active • Tunis Smart City
                        </span>
                    </div>

                    <h1 className="text-6xl md:text-7xl font-extrabold mb-6 leading-tight">
                        <span className="gradient-text">Smart City</span>
                        <br />
                        <span className="text-text-primary">Connect</span>
                    </h1>

                    <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
                        Plateforme de gestion urbaine intelligente unifiant
                        <span className="text-accent-cyan font-medium"> REST</span>,
                        <span className="text-accent-emerald font-medium"> SOAP</span>,
                        <span className="text-accent-rose font-medium"> gRPC</span> et
                        <span className="text-accent-violet font-medium"> GraphQL</span>
                    </p>

                    {/* Feature Pills */}
                    <div className="flex flex-wrap justify-center gap-4">
                        {features.map(({ icon: Icon, title, description }) => (
                            <div key={title} className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/5 border border-white/10">
                                <Icon className="w-5 h-5 text-primary-light" />
                                <div className="text-left">
                                    <div className="text-sm font-semibold text-text-primary">{title}</div>
                                    <div className="text-xs text-text-muted">{description}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Service Cards Grid */}
            <section>
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-text-primary">Services Disponibles</h2>
                        <p className="text-text-secondary mt-1">Accédez aux différents modules de la plateforme</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {services.map((service, index) => (
                        <Link
                            key={service.path}
                            to={service.path}
                            className="group animate-in"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className="card h-full transition-all duration-500 hover:-translate-y-2">
                                {/* Glow Effect */}
                                <div
                                    className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
                                    style={{ background: service.glowColor }}
                                />

                                <div className="relative">
                                    {/* Icon */}
                                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                                        <service.icon className="w-7 h-7 text-white" />
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-xl font-bold text-text-primary mb-2 group-hover:text-white transition-colors">
                                        {service.title}
                                    </h3>
                                    <p className="text-sm text-text-secondary mb-6 line-clamp-2">
                                        {service.description}
                                    </p>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                        <span className="badge badge-primary">
                                            {service.protocol}
                                        </span>
                                        <div className="flex items-center gap-2 text-sm font-medium text-text-secondary group-hover:text-primary-light transition-colors">
                                            <span>{service.stat}</span>
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Live Stats Section */}
            <section className="card">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-emerald to-accent-cyan flex items-center justify-center">
                        <Activity className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-text-primary">Statistiques en Direct</h2>
                        <p className="text-sm text-text-secondary">Aperçu des métriques clés de la ville</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-4 gap-6">
                    <div className="stat-card text-blue-400">
                        <div className="flex items-center gap-2 mb-3">
                            <Bus className="w-5 h-5" />
                            <span className="text-sm font-medium text-text-secondary">Transport</span>
                        </div>
                        <div className="text-3xl font-bold mb-1">{stats.totalLines}</div>
                        <div className="text-xs text-text-muted">Lignes actives</div>
                        <div className="mt-4 progress-bar">
                            <div className="progress-bar-fill" style={{ width: '75%' }} />
                        </div>
                    </div>

                    <div className="stat-card text-emerald-400">
                        <div className="flex items-center gap-2 mb-3">
                            <Wind className="w-5 h-5" />
                            <span className="text-sm font-medium text-text-secondary">Air Quality</span>
                        </div>
                        <div className="text-3xl font-bold mb-1">Bon</div>
                        <div className="text-xs text-text-muted">Indice moyen</div>
                        <div className="mt-4 progress-bar">
                            <div className="progress-bar-fill bg-gradient-to-r from-emerald-500 to-teal-500" style={{ width: '85%' }} />
                        </div>
                    </div>

                    <div className="stat-card text-rose-400">
                        <div className="flex items-center gap-2 mb-3">
                            <Siren className="w-5 h-5" />
                            <span className="text-sm font-medium text-text-secondary">Urgences</span>
                        </div>
                        <div className="text-3xl font-bold mb-1">{stats.activeAlerts}</div>
                        <div className="text-xs text-text-muted">Alertes actives</div>
                        <div className="mt-4 progress-bar">
                            <div className="progress-bar-fill bg-gradient-to-r from-rose-500 to-orange-500" style={{ width: '15%' }} />
                        </div>
                    </div>

                    <div className="stat-card text-violet-400">
                        <div className="flex items-center gap-2 mb-3">
                            <Users className="w-5 h-5" />
                            <span className="text-sm font-medium text-text-secondary">Citoyens</span>
                        </div>
                        <div className="text-3xl font-bold mb-1">{stats.totalEvents}</div>
                        <div className="text-xs text-text-muted">Événements</div>
                        <div className="mt-4 progress-bar">
                            <div className="progress-bar-fill bg-gradient-to-r from-violet-500 to-fuchsia-500" style={{ width: '60%' }} />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Dashboard;
