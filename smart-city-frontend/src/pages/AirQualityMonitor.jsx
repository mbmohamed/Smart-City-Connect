import React, { useState, useEffect } from 'react';
import { Wind, RefreshCw, TrendingUp, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import airQualityService from '../services/airQualityService';

function AirQualityMonitor() {
    const [zones, setZones] = useState([]);
    const [selectedZone, setSelectedZone] = useState('ZONE_001');
    const [airQualityData, setAirQualityData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        loadZones();
    }, []);

    useEffect(() => {
        if (selectedZone) {
            fetchAirQuality();
        }
    }, [selectedZone]);

    const loadZones = async () => {
        try {
            const data = await airQualityService.getAllZones();
            setZones(data);
        } catch (error) {
            console.error('Error loading zones');
        }
    };

    const fetchAirQuality = async () => {
        try {
            setLoading(true);
            const data = await airQualityService.getAirQuality(selectedZone);
            setAirQualityData(data);

            // Add to history for chart
            setHistory(prev => [
                ...prev.slice(-9), // Keep last 9
                {
                    time: new Date().toLocaleTimeString(),
                    aqi: data.aqi,
                    pm25: data.pm25,
                    pm10: data.pm10
                }
            ]);
        } catch (error) {
            alert('Erreur lors du chargement des données SOAP');
        } finally {
            setLoading(false);
        }
    };

    const getAQIColor = (aqi) => {
        if (aqi <= 50) return 'text-green-400';
        if (aqi <= 100) return 'text-yellow-400';
        if (aqi <= 150) return 'text-orange-400';
        return 'text-red-400';
    };

    const getAQIBgColor = (aqi) => {
        if (aqi <= 50) return 'from-green-500 to-green-700';
        if (aqi <= 100) return 'from-yellow-500 to-yellow-700';
        if (aqi <= 150) return 'from-orange-500 to-orange-700';
        return 'from-red-500 to-red-700';
    };

    const getQualityLabel = (quality) => {
        const labels = {
            GOOD: 'Bon',
            MODERATE: 'Modéré',
            UNHEALTHY: 'Mauvais',
            HAZARDOUS: 'Dangereux'
        };
        return labels[quality] || quality;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Qualité de l'Air</h1>
                    <p className="text-text-secondary">Surveillance environnementale en temps réel (SOAP API)</p>
                </div>
                <button
                    onClick={fetchAirQuality}
                    disabled={loading}
                    className="flex items-center space-x-2 btn-primary"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    <span>Actualiser</span>
                </button>
            </div>

            {/* Zone Selector */}
            <div className="card">
                <label className="block text-sm font-medium mb-2">Sélectionner une zone</label>
                <select
                    value={selectedZone}
                    onChange={(e) => setSelectedZone(e.target.value)}
                    className="input-field w-full max-w-md"
                >
                    {zones.map(zone => (
                        <option key={zone.id} value={zone.id}>
                            {zone.name} ({zone.id})
                        </option>
                    ))}
                </select>
            </div>

            {/* AQI Display */}
            {airQualityData && (
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Main AQI Gauge */}
                    <div className="card">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold">Indice de Qualité de l'Air</h2>
                            <Wind className="w-8 h-8 text-blue-400" />
                        </div>
                        <div className={`text-center py-8 bg-gradient-to-r ${getAQIBgColor(airQualityData.aqi)} rounded-lg mb-4`}>
                            <div className="text-7xl font-bold text-white mb-2">
                                {airQualityData.aqi}
                            </div>
                            <div className="text-2xl text-white font-semibold">
                                {getQualityLabel(airQualityData.quality)}
                            </div>
                        </div>
                        <div className="text-sm text-text-secondary text-center">
                            Dernière mise à jour : {new Date(airQualityData.timestamp).toLocaleString()}
                        </div>
                    </div>

                    {/* Pollutants */}
                    <div className="card">
                        <h2 className="text-2xl font-bold mb-4">Polluants</h2>
                        <div className="space-y-4">
                            <div className="bg-gray-700 rounded-lg p-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-text-secondary">PM2.5</span>
                                    <span className="text-2xl font-bold">{airQualityData.pm25} μg/m³</span>
                                </div>
                                <div className="w-full bg-gray-600 rounded-full h-2">
                                    <div
                                        className="bg-yellow-400 h-2 rounded-full"
                                        style={{ width: `${Math.min((airQualityData.pm25 / 100) * 100, 100)}%` }}
                                    />
                                </div>
                            </div>

                            <div className="bg-gray-700 rounded-lg p-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-text-secondary">PM10</span>
                                    <span className="text-2xl font-bold">{airQualityData.pm10} μg/m³</span>
                                </div>
                                <div className="w-full bg-gray-600 rounded-full h-2">
                                    <div
                                        className="bg-orange-400 h-2 rounded-full"
                                        style={{ width: `${Math.min((airQualityData.pm10 / 150) * 100, 100)}%` }}
                                    />
                                </div>
                            </div>

                            <div className="bg-gray-700 rounded-lg p-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-text-secondary">CO2</span>
                                    <span className="text-2xl font-bold">{airQualityData.co2} ppm</span>
                                </div>
                                <div className="w-full bg-gray-600 rounded-full h-2">
                                    <div
                                        className="bg-blue-400 h-2 rounded-full"
                                        style={{ width: `${Math.min((airQualityData.co2 / 1000) * 100, 100)}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Historical Chart */}
            {history.length > 0 && (
                <div className="card">
                    <h2 className="text-2xl font-bold mb-4 flex items-center">
                        <TrendingUp className="w-6 h-6 mr-2 text-blue-400" />
                        Évolution (10 dernières mesures)
                    </h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={history}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="time" stroke="#94A3B8" />
                            <YAxis stroke="#94A3B8" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1E293B',
                                    border: '1px solid #374151',
                                    borderRadius: '8px'
                                }}
                            />
                            <Legend />
                            <Line type="monotone" dataKey="aqi" stroke="#3B82F6" strokeWidth={2} name="AQI" />
                            <Line type="monotone" dataKey="pm25" stroke="#F59E0B" strokeWidth={2} name="PM2.5" />
                            <Line type="monotone" dataKey="pm10" stroke="#F97316" strokeWidth={2} name="PM10" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* Info */}
            <div className="card bg-blue-900 bg-opacity-30 border border-blue-700">
                <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                    <div>
                        <h3 className="font-bold mb-1">Protocole SOAP</h3>
                        <p className="text-sm text-text-secondary">
                            Cette page utilise des requêtes SOAP XML pour communiquer avec le service de qualité de l'air.
                            Les données sont parsées depuis les réponses XML et affichées en temps réel.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AirQualityMonitor;
