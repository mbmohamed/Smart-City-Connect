import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, RefreshCw, Bus, Train } from 'lucide-react';
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
            alert('Erreur lors du chargement des lignes');
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
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette ligne ?')) {
            try {
                await mobilityService.deleteLine(id);
                fetchLines();
            } catch (error) {
                alert('Erreur lors de la suppression');
            }
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'ON_TIME': return 'bg-green-500';
            case 'DELAYED': return 'bg-yellow-500';
            case 'CANCELLED': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    const getTypeIcon = (type) => {
        return type === 'METRO' || type === 'TRAM' ? Train : Bus;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Mobilité Urbaine</h1>
                    <p className="text-text-secondary">Gestion des lignes de transport en commun (REST API)</p>
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={fetchLines}
                        className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition"
                    >
                        <RefreshCw className="w-4 h-4" />
                        <span>Actualiser</span>
                    </button>
                    <button
                        onClick={() => {
                            setEditingLine(null);
                            setFormData({ name: '', type: 'BUS', status: 'ON_TIME' });
                            setShowForm(true);
                        }}
                        className="btn-primary flex items-center space-x-2"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Nouvelle Ligne</span>
                    </button>
                </div>
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="card">
                    <h2 className="text-2xl font-bold mb-4">
                        {editingLine ? 'Modifier la ligne' : 'Nouvelle ligne'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Nom de la ligne</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="input-field w-full"
                                placeholder="Ex: Bus 42, Metro Ligne 1"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Type</label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className="input-field w-full"
                            >
                                <option value="BUS">Bus</option>
                                <option value="METRO">Métro</option>
                                <option value="TRAM">Tramway</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Statut</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="input-field w-full"
                            >
                                <option value="ON_TIME">À l'heure</option>
                                <option value="DELAYED">Retard</option>
                                <option value="CANCELLED">Annulé</option>
                            </select>
                        </div>
                        <div className="flex space-x-2 pt-4">
                            <button type="submit" className="btn-primary flex-1">
                                {editingLine ? 'Mettre à jour' : 'Créer'}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowForm(false);
                                    setEditingLine(null);
                                }}
                                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg flex-1"
                            >
                                Annuler
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Lines List */}
            <div className="card">
                <h2 className="text-2xl font-bold mb-4">Lignes actives ({lines.length})</h2>
                {loading ? (
                    <div className="text-center py-8 text-text-secondary">Chargement...</div>
                ) : lines.length === 0 ? (
                    <div className="text-center py-8 text-text-secondary">
                        Aucune ligne disponible. Créez-en une !
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {lines.map((line) => {
                            const Icon = getTypeIcon(line.type);
                            return (
                                <div
                                    key={line.id}
                                    className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-primary-blue rounded-lg flex items-center justify-center">
                                                <Icon className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg">{line.name}</h3>
                                                <p className="text-sm text-text-secondary">{line.type}</p>
                                            </div>
                                        </div>
                                        <div className="flex space-x-1">
                                            <button
                                                onClick={() => handleEdit(line)}
                                                className="p-2 hover:bg-gray-500 rounded transition"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(line.id)}
                                                className="p-2 hover:bg-red-600 rounded transition"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className={`w-3 h-3 rounded-full ${getStatusColor(line.status)}`} />
                                        <span className="text-sm">
                                            {line.status === 'ON_TIME' && 'À l\'heure'}
                                            {line.status === 'DELAYED' && 'Retard'}
                                            {line.status === 'CANCELLED' && 'Annulé'}
                                        </span>
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
