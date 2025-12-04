import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ALL_EVENTS, GET_ALL_ISSUES, REPORT_ISSUE } from '../services/citizenService';
import { Calendar, MapPin, AlertTriangle, CheckCircle, Clock, Send } from 'lucide-react';

const CitizenEngagement = () => {
    const { loading: loadingEvents, error: errorEvents, data: dataEvents } = useQuery(GET_ALL_EVENTS);
    const { loading: loadingIssues, error: errorIssues, data: dataIssues, refetch: refetchIssues } = useQuery(GET_ALL_ISSUES);
    const [reportIssue] = useMutation(REPORT_ISSUE);

    const [newIssue, setNewIssue] = useState({ title: '', description: '', reportedBy: '' });
    const [activeTab, setActiveTab] = useState('events');

    const handleSubmitIssue = async (e) => {
        e.preventDefault();
        try {
            await reportIssue({ variables: newIssue });
            setNewIssue({ title: '', description: '', reportedBy: '' });
            refetchIssues();
            alert('Signalement envoyé avec succès !');
        } catch (err) {
            console.error('Erreur lors du signalement:', err);
            alert('Erreur lors de l\'envoi du signalement.');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'OPEN': return 'text-red-400';
            case 'IN_PROGRESS': return 'text-yellow-400';
            case 'RESOLVED': return 'text-green-400';
            default: return 'text-gray-400';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'OPEN': return <AlertTriangle size={16} />;
            case 'IN_PROGRESS': return <Clock size={16} />;
            case 'RESOLVED': return <CheckCircle size={16} />;
            default: return null;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-text-primary">Engagement Citoyen</h1>
                <div className="flex space-x-2 bg-bg-card p-1 rounded-lg">
                    <button
                        onClick={() => setActiveTab('events')}
                        className={`px-4 py-2 rounded-md transition-colors ${activeTab === 'events' ? 'bg-primary-blue text-white' : 'text-text-secondary hover:text-white'}`}
                    >
                        Événements
                    </button>
                    <button
                        onClick={() => setActiveTab('issues')}
                        className={`px-4 py-2 rounded-md transition-colors ${activeTab === 'issues' ? 'bg-primary-blue text-white' : 'text-text-secondary hover:text-white'}`}
                    >
                        Signalements
                    </button>
                </div>
            </div>

            {activeTab === 'events' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loadingEvents && <p>Chargement des événements...</p>}
                    {errorEvents && <p className="text-red-500">Erreur : {errorEvents.message}</p>}
                    {dataEvents && dataEvents.getAllEvents.map((event) => (
                        <div key={event.id} className="card hover:border-primary-blue transition-colors group">
                            <div className="flex justify-between items-start mb-4">
                                <span className="bg-primary-dark text-primary-blue px-2 py-1 rounded text-xs font-semibold">
                                    {event.category}
                                </span>
                                <Calendar className="text-text-secondary group-hover:text-primary-blue transition-colors" size={20} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                            <p className="text-text-secondary text-sm mb-4 line-clamp-2">{event.description}</p>
                            <div className="flex items-center text-text-secondary text-sm space-x-4">
                                <div className="flex items-center space-x-1">
                                    <Clock size={14} />
                                    <span>{new Date(event.date).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <MapPin size={14} />
                                    <span>{event.location}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'issues' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Formulaire de signalement */}
                    <div className="lg:col-span-1">
                        <div className="card sticky top-6">
                            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <AlertTriangle className="text-accent-orange" />
                                Signaler un problème
                            </h2>
                            <form onSubmit={handleSubmitIssue} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-1">Titre</label>
                                    <input
                                        type="text"
                                        required
                                        className="input-field w-full"
                                        value={newIssue.title}
                                        onChange={(e) => setNewIssue({ ...newIssue, title: e.target.value })}
                                        placeholder="Ex: Nid de poule"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-1">Description</label>
                                    <textarea
                                        required
                                        className="input-field w-full h-24 resize-none"
                                        value={newIssue.description}
                                        onChange={(e) => setNewIssue({ ...newIssue, description: e.target.value })}
                                        placeholder="Détails du problème..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-1">Signalé par</label>
                                    <input
                                        type="text"
                                        required
                                        className="input-field w-full"
                                        value={newIssue.reportedBy}
                                        onChange={(e) => setNewIssue({ ...newIssue, reportedBy: e.target.value })}
                                        placeholder="Votre nom"
                                    />
                                </div>
                                <button type="submit" className="btn-primary w-full flex justify-center items-center gap-2">
                                    <Send size={18} />
                                    Envoyer
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Liste des signalements */}
                    <div className="lg:col-span-2 space-y-4">
                        <h2 className="text-xl font-bold text-white mb-4">Signalements Récents</h2>
                        {loadingIssues && <p>Chargement des signalements...</p>}
                        {errorIssues && <p className="text-red-500">Erreur : {errorIssues.message}</p>}
                        {dataIssues && dataIssues.getAllIssues.map((issue) => (
                            <div key={issue.id} className="card flex justify-between items-center">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="font-bold text-white">{issue.title}</h3>
                                        <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded bg-bg-dark ${getStatusColor(issue.status)}`}>
                                            {getStatusIcon(issue.status)}
                                            {issue.status}
                                        </span>
                                    </div>
                                    <p className="text-text-secondary text-sm mb-2">{issue.description}</p>
                                    <div className="text-xs text-gray-500">
                                        Signalé par {issue.reportedBy} le {new Date(issue.dateReported).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CitizenEngagement;
