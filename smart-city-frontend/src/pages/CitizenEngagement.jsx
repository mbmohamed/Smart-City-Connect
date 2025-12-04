import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ALL_EVENTS, GET_ALL_ISSUES, REPORT_ISSUE } from '../services/citizenService';
import { Calendar, MapPin, AlertTriangle, CheckCircle, Clock, Send, Users, FileText, Sparkles, X } from 'lucide-react';

const CitizenEngagement = () => {
    const { loading: loadingEvents, error: errorEvents, data: dataEvents } = useQuery(GET_ALL_EVENTS);
    const { loading: loadingIssues, error: errorIssues, data: dataIssues, refetch: refetchIssues } = useQuery(GET_ALL_ISSUES);
    const [reportIssue] = useMutation(REPORT_ISSUE);

    const [newIssue, setNewIssue] = useState({ title: '', description: '', reportedBy: '' });
    const [activeTab, setActiveTab] = useState('events');
    const [showForm, setShowForm] = useState(false);

    const handleSubmitIssue = async (e) => {
        e.preventDefault();
        try {
            await reportIssue({ variables: newIssue });
            setNewIssue({ title: '', description: '', reportedBy: '' });
            setShowForm(false);
            refetchIssues();
        } catch (err) {
            console.error('Error:', err);
        }
    };

    const getStatusConfig = (status) => {
        const configs = {
            'OPEN': { badge: 'badge-danger', icon: AlertTriangle, label: 'Ouvert' },
            'IN_PROGRESS': { badge: 'badge-warning', icon: Clock, label: 'En cours' },
            'RESOLVED': { badge: 'badge-success', icon: CheckCircle, label: 'Résolu' }
        };
        return configs[status] || configs['OPEN'];
    };

    const getCategoryGradient = (category) => {
        const gradients = {
            'CULTURE': 'from-violet-500 to-purple-600',
            'SPORT': 'from-emerald-400 to-teal-500',
            'MUSIC': 'from-rose-400 to-pink-500',
            'COMMUNITY': 'from-blue-400 to-indigo-500',
        };
        return gradients[category] || 'from-primary to-primary-dark';
    };

    const events = dataEvents?.getAllEvents || [];
    const issues = dataIssues?.getAllIssues || [];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                        <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-text-primary">Engagement Citoyen</h1>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="badge" style={{ background: 'rgba(139, 92, 246, 0.2)', borderColor: 'rgba(139, 92, 246, 0.3)', color: '#a78bfa' }}>GraphQL</span>
                            <span className="text-text-secondary text-sm">Port 8084</span>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-2 p-1 rounded-xl bg-white/5 border border-white/10">
                    <button
                        onClick={() => setActiveTab('events')}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${activeTab === 'events'
                                ? 'bg-gradient-to-r from-primary/20 to-accent-violet/20 text-text-primary border border-primary/30'
                                : 'text-text-secondary hover:text-text-primary'
                            }`}
                    >
                        <Calendar className="w-4 h-4" />
                        <span>Événements</span>
                        <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs">{events.length}</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('issues')}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${activeTab === 'issues'
                                ? 'bg-gradient-to-r from-primary/20 to-accent-violet/20 text-text-primary border border-primary/30'
                                : 'text-text-secondary hover:text-text-primary'
                            }`}
                    >
                        <FileText className="w-4 h-4" />
                        <span>Signalements</span>
                        <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs">{issues.length}</span>
                    </button>
                </div>
            </div>

            {/* Events Tab */}
            {activeTab === 'events' && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loadingEvents && (
                        <div className="col-span-full flex items-center justify-center py-12">
                            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        </div>
                    )}
                    {errorEvents && (
                        <div className="col-span-full card bg-rose-500/10 border-rose-500/20">
                            <p className="text-rose-400">Erreur de connexion au service GraphQL</p>
                        </div>
                    )}
                    {events.map((event, idx) => (
                        <div key={event.id} className="group card hover:border-primary/30 transition-all duration-300 animate-in" style={{ animationDelay: `${idx * 50}ms` }}>
                            <div className="flex items-start justify-between mb-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getCategoryGradient(event.category)} text-white`}>
                                    {event.category}
                                </span>
                                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                    <Calendar className="w-5 h-5 text-text-secondary group-hover:text-primary-light transition-colors" />
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-text-primary mb-2 group-hover:text-white transition-colors">{event.title}</h3>
                            <p className="text-sm text-text-secondary mb-4 line-clamp-2">{event.description}</p>
                            <div className="flex items-center gap-4 pt-4 border-t border-white/10 text-sm text-text-muted">
                                <div className="flex items-center gap-1.5">
                                    <Clock className="w-4 h-4" />
                                    <span>{new Date(event.date).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <MapPin className="w-4 h-4" />
                                    <span className="truncate">{event.location}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Issues Tab */}
            {activeTab === 'issues' && (
                <div className="space-y-6">
                    {/* New Issue Button */}
                    <button onClick={() => setShowForm(true)} className="btn-primary" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' }}>
                        <AlertTriangle className="w-4 h-4" />
                        <span>Nouveau Signalement</span>
                    </button>

                    {/* Form Modal */}
                    {showForm && (
                        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                            <div className="card w-full max-w-md animate-in">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
                                            <AlertTriangle className="w-5 h-5 text-violet-400" />
                                        </div>
                                        <h2 className="text-xl font-bold text-text-primary">Signaler un problème</h2>
                                    </div>
                                    <button onClick={() => setShowForm(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                        <X className="w-5 h-5 text-text-secondary" />
                                    </button>
                                </div>
                                <form onSubmit={handleSubmitIssue} className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-2">Titre</label>
                                        <input type="text" required className="input-field" value={newIssue.title} onChange={(e) => setNewIssue({ ...newIssue, title: e.target.value })} placeholder="Ex: Nid-de-poule dangereux" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-2">Description</label>
                                        <textarea required className="input-field h-24 resize-none" value={newIssue.description} onChange={(e) => setNewIssue({ ...newIssue, description: e.target.value })} placeholder="Détails du problème..." />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-2">Votre nom</label>
                                        <input type="text" required className="input-field" value={newIssue.reportedBy} onChange={(e) => setNewIssue({ ...newIssue, reportedBy: e.target.value })} placeholder="Votre nom" />
                                    </div>
                                    <div className="flex gap-3 pt-2">
                                        <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">Annuler</button>
                                        <button type="submit" className="btn-primary flex-1" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' }}>
                                            <Send className="w-4 h-4" />
                                            <span>Envoyer</span>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Issues List */}
                    <div className="card">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-text-primary">Signalements Récents</h2>
                            <span className="badge badge-primary">{issues.length} signalements</span>
                        </div>

                        {loadingIssues && (
                            <div className="flex items-center justify-center py-12">
                                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                            </div>
                        )}

                        {errorIssues && (
                            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
                                <p className="text-rose-400">Erreur de connexion au service GraphQL</p>
                            </div>
                        )}

                        <div className="space-y-4">
                            {issues.map((issue, idx) => {
                                const statusConfig = getStatusConfig(issue.status);
                                const StatusIcon = statusConfig.icon;
                                return (
                                    <div key={issue.id} className="p-5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all animate-in" style={{ animationDelay: `${idx * 50}ms` }}>
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h3 className="font-semibold text-text-primary mb-1">{issue.title}</h3>
                                                <p className="text-sm text-text-secondary line-clamp-2">{issue.description}</p>
                                            </div>
                                            <span className={`badge ${statusConfig.badge} flex items-center gap-1.5`}>
                                                <StatusIcon className="w-3 h-3" />
                                                {statusConfig.label}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 pt-3 border-t border-white/10 text-xs text-text-muted">
                                            <div className="flex items-center gap-1.5">
                                                <Users className="w-3 h-3" />
                                                <span>{issue.reportedBy}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="w-3 h-3" />
                                                <span>{new Date(issue.dateReported).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CitizenEngagement;
