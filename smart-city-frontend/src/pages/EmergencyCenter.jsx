import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { Siren, Plus, Activity, Ambulance, Flame, Shield } from 'lucide-react';
import L from 'leaflet';
import emergencyService from '../services/emergencyService';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React-Leaflet
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
        latitude: 45.7578,
        longitude: 4.8320
    });

    const mapCenter = [45.7578, 4.8320]; // Lyon, France

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 10000); // Refresh every 10s
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
            console.error('Error fetching emergency data');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await emergencyService.createAlert(formData);
            setShowForm(false);
            setFormData({
                type: 'MEDICAL_EMERGENCY',
                location: '',
                severity: 'HIGH',
                description: '',
                latitude: 45.7578,
                longitude: 4.8320
            });
            fetchData();
        } catch (error) {
            alert('Erreur lors de la création de l\'alerte');
        }
    };

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'CRITICAL': return 'bg-red-500';
            case 'HIGH': return 'bg-orange-500';
            case 'MEDIUM': return 'bg-yellow-500';
            default: return 'bg-blue-500';
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'AMBULANCE': return Ambulance;
            case 'FIRE_TRUCK': return Flame;
            case 'POLICE': return Shield;
            default: return Activity;
        }
    };

    const getAlertIcon = (type) => {
        switch (type) {
            case 'MEDICAL_EMERGENCY': return '🚑';
            case 'FIRE': return '🔥';
            case 'ACCIDENT': return '🚗';
            default: return '⚠️';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Centre d'Urgences</h1>
                    <p className="text-text-secondary">Gestion des alertes critiques (gRPC avec REST proxy)</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="btn-accent flex items-center space-x-2"
                >
                    <Plus className="w-4 h-4" />
                    <span>Nouvelle Alerte</span>
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-4">
                <div className="card bg-red-900 bg-opacity-30 border border-red-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-text-secondary">Alertes Actives</p>
                            <p className="text-3xl font-bold text-red-400">{alerts.length}</p>
                        </div>
                        <Siren className="w-12 h-12 text-red-400" />
                    </div>
                </div>
                <div className="card bg-green-900 bg-opacity-30 border border-green-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-text-secondary">Ressources Disponibles</p>
                            <p className="text-3xl font-bold text-green-400">
                                {resources.filter(r => r.status === 'AVAILABLE').length}
                            </p>
                        </div>
                        <Activity className="w-12 h-12 text-green-400" />
                    </div>
                </div>
                <div className="card bg-orange-900 bg-opacity-30 border border-orange-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-text-secondary">En Intervention</p>
                            <p className="text-3xl font-bold text-orange-400">
                                {resources.filter(r => r.status === 'BUSY').length}
                            </p>
                        </div>
                        <Ambulance className="w-12 h-12 text-orange-400" />
                    </div>
                </div>
            </div>

            {/* Alert Form */}
            {showForm && (
                <div className="card">
                    <h2 className="text-2xl font-bold mb-4">Créer une Alerte</h2>
                    <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Type d'urgence</label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className="input-field w-full"
                            >
                                <option value="MEDICAL_EMERGENCY">Urgence Médicale</option>
                                <option value="FIRE">Incendie</option>
                                <option value="ACCIDENT">Accident</option>
                                <option value="PUBLIC_HEALTH_THREAT">Menace Sanitaire</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Sévérité</label>
                            <select
                                value={formData.severity}
                                onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                                className="input-field w-full"
                            >
                                <option value="CRITICAL">Critique</option>
                                <option value="HIGH">Élevée</option>
                                <option value="MEDIUM">Moyenne</option>
                                <option value="LOW">Basse</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2">Localisation</label>
                            <input
                                type="text"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                className="input-field w-full"
                                placeholder="Ex: Rue de la République, Lyon"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Latitude</label>
                            <input
                                type="number"
                                step="0.0001"
                                value={formData.latitude}
                                onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) })}
                                className="input-field w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Longitude</label>
                            <input
                                type="number"
                                step="0.0001"
                                value={formData.longitude}
                                onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) })}
                                className="input-field w-full"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2">Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="input-field w-full"
                                rows="3"
                                placeholder="Détails de l'urgence..."
                            />
                        </div>
                        <div className="md:col-span-2 flex space-x-2">
                            <button type="submit" className="btn-accent flex-1">
                                Créer l'Alerte
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg flex-1"
                            >
                                Annuler
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Map */}
            <div className="card">
                <h2 className="text-2xl font-bold mb-4">Carte Interactive</h2>
                <div className="h-96 rounded-lg overflow-hidden">
                    <MapContainer
                        center={mapCenter}
                        zoom={13}
                        style={{ height: '100%', width: '100%' }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        />

                        {/* Alert Markers */}
                        {alerts.map((alert) => (
                            <Marker
                                key={alert.id}
                                position={[alert.coordinates.latitude, alert.coordinates.longitude]}
                            >
                                <Popup>
                                    <div className="text-gray-900">
                                        <h3 className="font-bold text-lg">{getAlertIcon(alert.type)} {alert.type}</h3>
                                        <p><strong>Location:</strong> {alert.location}</p>
                                        <p><strong>Severity:</strong> {alert.severity}</p>
                                        <p><strong>Status:</strong> {alert.status}</p>
                                    </div>
                                </Popup>
                                <Circle
                                    center={[alert.coordinates.latitude, alert.coordinates.longitude]}
                                    radius={300}
                                    pathOptions={{
                                        color: alert.severity === 'CRITICAL' ? 'red' : 'orange',
                                        fillOpacity: 0.2
                                    }}
                                />
                            </Marker>
                        ))}

                        {/* Resource Markers */}
                        {resources.map((resource) => (
                            <Marker
                                key={resource.id}
                                position={[resource.coordinates.latitude, resource.coordinates.longitude]}
                            >
                                <Popup>
                                    <div className="text-gray-900">
                                        <h3 className="font-bold">{resource.type}</h3>
                                        <p><strong>ID:</strong> {resource.id}</p>
                                        <p><strong>Status:</strong> {resource.status}</p>
                                        <p><strong>Location:</strong> {resource.location}</p>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>
            </div>

            {/* Alerts List */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="card">
                    <h2 className="text-2xl font-bold mb-4">Alertes Récentes</h2>
                    <div className="space-y-3">
                        {alerts.map((alert) => (
                            <div key={alert.id} className="bg-gray-700 rounded-lg p-4">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-2xl">{getAlertIcon(alert.type)}</span>
                                        <div>
                                            <h3 className="font-bold">{alert.type}</h3>
                                            <p className="text-sm text-text-secondary">{alert.location}</p>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getSeverityColor(alert.severity)}`}>
                                        {alert.severity}
                                    </span>
                                </div>
                                <div className="text-sm text-text-secondary">
                                    {new Date(alert.timestamp).toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Resources */}
                <div className="card">
                    <h2 className="text-2xl font-bold mb-4">Ressources</h2>
                    <div className="space-y-3">
                        {resources.map((resource) => {
                            const Icon = getTypeIcon(resource.type);
                            return (
                                <div key={resource.id} className="bg-gray-700 rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className={`w-10 h-10 ${resource.status === 'AVAILABLE' ? 'bg-green-600' : 'bg-orange-600'} rounded-lg flex items-center justify-center`}>
                                                <Icon className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold">{resource.id}</h3>
                                                <p className="text-sm text-text-secondary">{resource.location}</p>
                                            </div>
                                        </div>
                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${resource.status === 'AVAILABLE' ? 'bg-green-600' : 'bg-orange-600'}`}>
                                            {resource.status}
                                        </span>
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
