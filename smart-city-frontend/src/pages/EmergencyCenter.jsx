import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { Siren, Plus, Activity, Ambulance, Flame, Shield, X, MapPin, Clock, AlertTriangle, Users } from 'lucide-react';
import L from 'leaflet';
import emergencyService from '../services/emergencyService';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function EmergencyCenter() {
    const [alerts, setAlerts] = useState([]);
    const [resources, setResources] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        type: 'MEDICAL_EMERGENCY',
        location: '',
        severity: 'HIGH',
        description: '',
        latitude: 36.8065,
        longitude: 10.1815
    });

    const mapCenter = [36.8065, 10.1815]; // Tunis

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, []);

    const fetchData = async () => {
        try {
            const [alertsData, resourcesData] = await Promise.all([
                emergencyService.getActiveAlerts(),
                emergencyService.getAvailableResources()
            ]);
            setAlerts(alertsData);
            setResources(resourcesData);
        } catch (error) {
            console.log('Loading emergency data...');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await emergencyService.createAlert(formData);
            setShowForm(false);
            setFormData({ type: 'MEDICAL_EMERGENCY', location: '', severity: 'HIGH', description: '', latitude: 36.8065, longitude: 10.1815 });
            fetchData();
        } catch (error) {
            alert('Erreur');
        }
    };

    const getSeverityConfig = (severity) => {
        const configs = {
            'CRITICAL': { badge: 'badge-danger', color: '#fb7185', bg: 'bg-rose-500/20' },
            'HIGH': { badge: 'badge-warning', color: '#fbbf24', bg: 'bg-amber-500/20' },
            'MEDIUM': { badge: 'badge-primary', color: '#818cf8', bg: 'bg-primary/20' },
            'LOW': { badge: 'badge-success', color: '#34d399', bg: 'bg-emerald-500/20' }
        };
        return configs[severity] || configs['MEDIUM'];
    };

    const getTypeConfig = (type) => {
        const configs = {
            'AMBULANCE': { icon: Ambulance, label: 'Ambulance', gradient: 'from-rose-500 to-red-600' },
            'FIRE_TRUCK': { icon: Flame, label: 'Pompiers', gradient: 'from-orange-500 to-red-600' },
            'POLICE': { icon: Shield, label: 'Police', gradient: 'from-blue-500 to-indigo-600' }
        };
        return configs[type] || { icon: Activity, label: type, gradient: 'from-gray-500 to-gray-600' };
    };

    const alertIcons = {
        'MEDICAL_EMERGENCY': '🚑',
        'FIRE': '🔥',
        'ACCIDENT': '🚗',
        'PUBLIC_HEALTH_THREAT': '⚠️'
    };

    const stats = [
        { label: 'Alertes Actives', value: alerts.length, icon: Siren, gradient: 'from-rose-500 to-red-600', color: '#fb7185' },
        { label: 'Disponibles', value: resources.filter(r => r.status === 'AVAILABLE').length, icon: Activity, gradient: 'from-emerald-400 to-teal-500', color: '#34d399' },
        { label: 'En Intervention', value: resources.filter(r => r.status === 'BUSY').length, icon: Ambulance, gradient: 'from-amber-400 to-orange-500', color: '#fbbf24' }
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center">
                        <Siren className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-text-primary">Centre d'Urgences</h1>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="badge badge-danger">gRPC</span>
                            <span className="text-text-secondary text-sm">Port 9093</span>
                        </div>
                    </div>
                </div>
                <button onClick={() => setShowForm(true)} className="btn-primary" style={{ background: 'linear-gradient(135deg, #f43f5e 0%, #dc2626 100%)' }}>
                    <Plus className="w-4 h-4" />
                    <span>Nouvelle Alerte</span>
                </button>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-6">
                {stats.map((stat, idx) => (
                    <div key={idx} className="stat-card animate-in" style={{ animationDelay: `${idx * 100}ms` }}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-text-muted mb-1">{stat.label}</p>
                                <p className="text-3xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
                            </div>
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}>
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="card w-full max-w-2xl animate-in">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-rose-500/20 flex items-center justify-center">
                                    <AlertTriangle className="w-5 h-5 text-rose-400" />
                                </div>
                                <h2 className="text-xl font-bold text-text-primary">Créer une Alerte</h2>
                            </div>
                            <button onClick={() => setShowForm(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                <X className="w-5 h-5 text-text-secondary" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-2">Type d'urgence</label>
                                <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="input-field">
                                    <option value="MEDICAL_EMERGENCY">Urgence Médicale</option>
                                    <option value="FIRE">Incendie</option>
                                    <option value="ACCIDENT">Accident</option>
                                    <option value="PUBLIC_HEALTH_THREAT">Menace Sanitaire</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-2">Sévérité</label>
                                <select value={formData.severity} onChange={(e) => setFormData({ ...formData, severity: e.target.value })} className="input-field">
                                    <option value="CRITICAL">Critique</option>
                                    <option value="HIGH">Élevée</option>
                                    <option value="MEDIUM">Moyenne</option>
                                    <option value="LOW">Basse</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-text-secondary mb-2">Localisation</label>
                                <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="input-field" placeholder="Ex: Avenue Habib Bourguiba, Tunis" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-2">Latitude</label>
                                <input type="number" step="0.0001" value={formData.latitude} onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) })} className="input-field" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-2">Longitude</label>
                                <input type="number" step="0.0001" value={formData.longitude} onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) })} className="input-field" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-text-secondary mb-2">Description</label>
                                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="input-field" rows="3" placeholder="Détails de l'urgence..." />
                            </div>
                            <div className="md:col-span-2 flex gap-3 pt-2">
                                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">Annuler</button>
                                <button type="submit" className="btn-primary flex-1" style={{ background: 'linear-gradient(135deg, #f43f5e 0%, #dc2626 100%)' }}>Créer l'Alerte</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Map */}
            <div className="card">
                <div className="flex items-center gap-3 mb-6">
                    <MapPin className="w-5 h-5 text-primary-light" />
                    <h2 className="text-lg font-semibold text-text-primary">Carte Interactive</h2>
                </div>
                <div className="h-96 rounded-xl overflow-hidden border border-white/10">
                    <MapContainer center={mapCenter} zoom={12} style={{ height: '100%', width: '100%' }}>
                        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" attribution='&copy; CartoDB' />
                        {alerts.map((alert) => (
                            <Marker key={alert.id} position={[alert.coordinates?.latitude || 36.8065, alert.coordinates?.longitude || 10.1815]}>
                                <Popup><div className="text-gray-900 p-2"><strong>{alertIcons[alert.type]} {alert.type}</strong><br />{alert.location}</div></Popup>
                                <Circle center={[alert.coordinates?.latitude || 36.8065, alert.coordinates?.longitude || 10.1815]} radius={400} pathOptions={{ color: alert.severity === 'CRITICAL' ? '#f43f5e' : '#f97316', fillOpacity: 0.2 }} />
                            </Marker>
                        ))}
                        {resources.map((resource) => (
                            <Marker key={resource.id} position={[resource.coordinates?.latitude || 36.8065, resource.coordinates?.longitude || 10.1815]}>
                                <Popup><div className="text-gray-900 p-2"><strong>{resource.type}</strong><br />Status: {resource.status}</div></Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>
            </div>

            {/* Alerts & Resources Grid */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Alerts */}
                <div className="card">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-text-primary">Alertes Récentes</h2>
                        <span className="badge badge-danger">{alerts.length}</span>
                    </div>
                    <div className="space-y-4 max-h-80 overflow-y-auto">
                        {alerts.length === 0 ? (
                            <div className="text-center py-8 text-text-muted">Aucune alerte active</div>
                        ) : alerts.map((alert, idx) => {
                            const sevConfig = getSeverityConfig(alert.severity);
                            return (
                                <div key={alert.id} className={`p-4 rounded-xl ${sevConfig.bg} border border-white/10 animate-in`} style={{ animationDelay: `${idx * 50}ms` }}>
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{alertIcons[alert.type] || '⚠️'}</span>
                                            <div>
                                                <h3 className="font-semibold text-text-primary">{alert.type?.replace(/_/g, ' ')}</h3>
                                                <p className="text-sm text-text-muted">{alert.location}</p>
                                            </div>
                                        </div>
                                        <span className={`badge ${sevConfig.badge}`}>{alert.severity}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-text-muted">
                                        <Clock className="w-3 h-3" />
                                        <span>{new Date(alert.timestamp).toLocaleString()}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Resources */}
                <div className="card">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-text-primary">Ressources</h2>
                        <span className="badge badge-success">{resources.filter(r => r.status === 'AVAILABLE').length} dispo</span>
                    </div>
                    <div className="space-y-4 max-h-80 overflow-y-auto">
                        {resources.length === 0 ? (
                            <div className="text-center py-8 text-text-muted">Aucune ressource</div>
                        ) : resources.map((resource, idx) => {
                            const config = getTypeConfig(resource.type);
                            const Icon = config.icon;
                            const isAvailable = resource.status === 'AVAILABLE';
                            return (
                                <div key={resource.id} className="p-4 rounded-xl bg-white/5 border border-white/10 animate-in" style={{ animationDelay: `${idx * 50}ms` }}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${config.gradient} flex items-center justify-center`}>
                                                <Icon className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-text-primary">{resource.id}</h3>
                                                <p className="text-sm text-text-muted">{resource.location}</p>
                                            </div>
                                        </div>
                                        <span className={`badge ${isAvailable ? 'badge-success' : 'badge-warning'}`}>{resource.status}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EmergencyCenter;
