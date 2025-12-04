import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, RefreshCw, Bus, Train, MapPin, Clock, ArrowRight, X } from 'lucide-react';
import mobilityService from '../services/mobilityService';

function MobilityHub() {
    const [lines, setLines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingLine, setEditingLine] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        type: 'BUS',
        status: 'ON_TIME'
    });

    useEffect(() => {
        fetchLines();
    }, []);

    const fetchLines = async () => {
        try {
            setLoading(true);
            const data = await mobilityService.getAllLines();
            setLines(data);
        } catch (error) {
            console.log('Loading...');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingLine) {
                await mobilityService.updateLine(editingLine.id, formData);
            } else {
                await mobilityService.createLine(formData);
            }
            setShowForm(false);
            setEditingLine(null);
            setFormData({ name: '', type: 'BUS', status: 'ON_TIME' });
            fetchLines();
        } catch (error) {
            alert('Erreur lors de la sauvegarde');
        }
    };

    const handleEdit = (line) => {
        setEditingLine(line);
        setFormData({ name: line.name, type: line.type, status: line.status });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Supprimer cette ligne ?')) {
            try {
                await mobilityService.deleteLine(id);
                fetchLines();
            } catch (error) {
                alert('Erreur');
            }
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            'ON_TIME': { class: 'badge-success', label: 'À l\'heure' },
            'DELAYED': { class: 'badge-warning', label: 'Retard' },
            'CANCELLED': { class: 'badge-danger', label: 'Annulé' }
        };
        return badges[status] || badges['ON_TIME'];
    };

    const getTypeConfig = (type) => {
        const configs = {
            'BUS': { icon: Bus, gradient: 'from-blue-500 to-indigo-600', label: 'Bus' },
            'METRO': { icon: Train, gradient: 'from-violet-500 to-purple-600', label: 'Métro' },
            'TRAM': { icon: Train, gradient: 'from-emerald-500 to-teal-600', label: 'Tramway' }
        };
        return configs[type] || configs['BUS'];
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                            <Bus className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-text-primary">Mobilité Urbaine</h1>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="badge badge-primary">REST API</span>
                                <span className="text-text-secondary text-sm">Port 8080</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button onClick={fetchLines} className="btn-secondary">
                        <RefreshCw className="w-4 h-4" />
                        <span>Actualiser</span>
                    </button>
                    <button
                        onClick={() => {
                            setEditingLine(null);
                            setFormData({ name: '', type: 'BUS', status: 'ON_TIME' });
                            setShowForm(true);
                        }}
                        className="btn-primary"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Nouvelle Ligne</span>
                    </button>
                </div>
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="card w-full max-w-md animate-in">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-text-primary">
                                {editingLine ? 'Modifier la ligne' : 'Nouvelle ligne'}
                            </h2>
                            <button onClick={() => setShowForm(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                <X className="w-5 h-5 text-text-secondary" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-2">Nom de la ligne</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="input-field"
                                    placeholder="Ex: Bus 42, Metro Ligne 1"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-2">Type</label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        className="input-field"
                                    >
                                        <option value="BUS">Bus</option>
                                        <option value="METRO">Métro</option>
                                        <option value="TRAM">Tramway</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-2">Statut</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="input-field"
                                    >
                                        <option value="ON_TIME">À l'heure</option>
                                        <option value="DELAYED">Retard</option>
                                        <option value="CANCELLED">Annulé</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">
                                    Annuler
                                </button>
                                <button type="submit" className="btn-primary flex-1">
                                    {editingLine ? 'Mettre à jour' : 'Créer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Lignes', value: lines.length, color: 'text-blue-400' },
                    { label: 'À l\'heure', value: lines.filter(l => l.status === 'ON_TIME').length, color: 'text-emerald-400' },
                    { label: 'En retard', value: lines.filter(l => l.status === 'DELAYED').length, color: 'text-amber-400' },
                    { label: 'Annulées', value: lines.filter(l => l.status === 'CANCELLED').length, color: 'text-rose-400' }
                ].map((stat, idx) => (
                    <div key={idx} className="stat-card">
                        <div className="text-2xl font-bold mb-1" style={{ color: stat.color.replace('text-', '').includes('blue') ? '#60a5fa' : stat.color.includes('emerald') ? '#34d399' : stat.color.includes('amber') ? '#fbbf24' : '#fb7185' }}>
                            {stat.value}
                        </div>
                        <div className="text-xs text-text-muted">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Lines Grid */}
            <div className="card">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-text-primary">Lignes de Transport</h2>
                    <span className="text-sm text-text-secondary">{lines.length} lignes</span>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : lines.length === 0 ? (
                    <div className="text-center py-12">
                        <Bus className="w-12 h-12 text-text-muted mx-auto mb-4" />
                        <p className="text-text-secondary">Aucune ligne. Créez-en une !</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {lines.map((line, idx) => {
                            const typeConfig = getTypeConfig(line.type);
                            const statusBadge = getStatusBadge(line.status);
                            const Icon = typeConfig.icon;

                            return (
                                <div
                                    key={line.id}
                                    className="group relative p-5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 animate-in"
                                    style={{ animationDelay: `${idx * 50}ms` }}
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${typeConfig.gradient} flex items-center justify-center`}>
                                                <Icon className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-text-primary">{line.name}</h3>
                                                <p className="text-xs text-text-muted">{typeConfig.label}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleEdit(line)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                                <Edit2 className="w-4 h-4 text-text-secondary" />
                                            </button>
                                            <button onClick={() => handleDelete(line.id)} className="p-2 hover:bg-rose-500/20 rounded-lg transition-colors">
                                                <Trash2 className="w-4 h-4 text-rose-400" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className={`badge ${statusBadge.class}`}>
                                            {statusBadge.label}
                                        </span>
                                        <div className="flex items-center gap-1 text-xs text-text-muted">
                                            <Clock className="w-3 h-3" />
                                            <span>En service</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MobilityHub;
