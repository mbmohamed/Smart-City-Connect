import React, { useState, useEffect } from 'react';
import { Wind, RefreshCw, TrendingUp, AlertTriangle, MapPin, Thermometer, Droplets, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
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
            console.log('Loading zones...');
        }
    };

    const fetchAirQuality = async () => {
        try {
            setLoading(true);
            const data = await airQualityService.getAirQuality(selectedZone);
            setAirQualityData(data);
            setHistory(prev => [
                ...prev.slice(-9),
                { time: new Date().toLocaleTimeString(), aqi: data.aqi, pm25: data.pm25, pm10: data.pm10 }
            ]);
        } catch (error) {
            console.log('Error loading data');
        } finally {
            setLoading(false);
        }
    };

    const getAQIConfig = (aqi) => {
        if (aqi <= 50) return { label: 'Excellent', gradient: 'from-emerald-400 to-teal-500', color: '#34d399', bgClass: 'bg-emerald-500/20' };
        if (aqi <= 100) return { label: 'Bon', gradient: 'from-lime-400 to-green-500', color: '#a3e635', bgClass: 'bg-lime-500/20' };
        if (aqi <= 150) return { label: 'Modéré', gradient: 'from-amber-400 to-orange-500', color: '#fbbf24', bgClass: 'bg-amber-500/20' };
        return { label: 'Mauvais', gradient: 'from-rose-400 to-red-500', color: '#fb7185', bgClass: 'bg-rose-500/20' };
    };

    const pollutants = airQualityData ? [
        { name: 'PM2.5', value: airQualityData.pm25, unit: 'μg/m³', max: 100, color: '#fbbf24', gradient: 'from-amber-400 to-orange-500' },
        { name: 'PM10', value: airQualityData.pm10, unit: 'μg/m³', max: 150, color: '#f97316', gradient: 'from-orange-400 to-red-500' },
        { name: 'CO2', value: airQualityData.co2, unit: 'ppm', max: 1000, color: '#3b82f6', gradient: 'from-blue-400 to-indigo-500' }
    ] : [];

    const aqiConfig = airQualityData ? getAQIConfig(airQualityData.aqi) : null;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                        <Wind className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-text-primary">Qualité de l'Air</h1>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="badge badge-success">SOAP API</span>
                            <span className="text-text-secondary text-sm">Port 8081</span>
                        </div>
                    </div>
                </div>
                <button onClick={fetchAirQuality} disabled={loading} className="btn-primary">
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    <span>Actualiser</span>
                </button>
            </div>

            {/* Zone Selector */}
            <div className="card">
                <div className="flex items-center gap-3 mb-4">
                    <MapPin className="w-5 h-5 text-primary-light" />
                    <span className="font-medium text-text-primary">Sélectionner une zone</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {zones.map(zone => (
                        <button
                            key={zone.id}
                            onClick={() => setSelectedZone(zone.id)}
                            className={`p-4 rounded-xl border transition-all ${selectedZone === zone.id
                                    ? 'bg-primary/20 border-primary/50 text-text-primary'
                                    : 'bg-white/5 border-white/10 text-text-secondary hover:border-white/20'
                                }`}
                        >
                            <div className="font-medium">{zone.name}</div>
                            <div className="text-xs text-text-muted mt-1">{zone.id}</div>
                        </button>
                    ))}
                </div>
            </div>

            {airQualityData && aqiConfig && (
                <>
                    {/* Main AQI Display */}
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="md:col-span-1">
                            <div className={`card h-full ${aqiConfig.bgClass} border-0`}>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-semibold text-text-primary">Indice AQI</h2>
                                    <Activity className="w-5 h-5" style={{ color: aqiConfig.color }} />
                                </div>
                                <div className="text-center py-6">
                                    <div
                                        className="text-7xl font-bold mb-2"
                                        style={{ color: aqiConfig.color }}
                                    >
                                        {airQualityData.aqi}
                                    </div>
                                    <div
                                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${aqiConfig.gradient}`}
                                    >
                                        <span className="text-white font-semibold">{aqiConfig.label}</span>
                                    </div>
                                </div>
                                <div className="text-sm text-text-muted text-center mt-4">
                                    {new Date(airQualityData.timestamp).toLocaleString()}
                                </div>
                            </div>
                        </div>

                        {/* Pollutants */}
                        <div className="md:col-span-2">
                            <div className="card h-full">
                                <h2 className="text-lg font-semibold text-text-primary mb-6">Polluants</h2>
                                <div className="space-y-6">
                                    {pollutants.map((pollutant, idx) => (
                                        <div key={idx} className="animate-in" style={{ animationDelay: `${idx * 100}ms` }}>
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${pollutant.gradient}`} />
                                                    <span className="font-medium text-text-primary">{pollutant.name}</span>
                                                </div>
                                                <span className="text-lg font-bold" style={{ color: pollutant.color }}>
                                                    {pollutant.value} <span className="text-sm font-normal text-text-muted">{pollutant.unit}</span>
                                                </span>
                                            </div>
                                            <div className="progress-bar">
                                                <div
                                                    className="h-full rounded-full transition-all duration-500"
                                                    style={{
                                                        width: `${Math.min((pollutant.value / pollutant.max) * 100, 100)}%`,
                                                        background: `linear-gradient(90deg, ${pollutant.color}, ${pollutant.color}88)`
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Chart */}
                    {history.length > 0 && (
                        <div className="card">
                            <div className="flex items-center gap-3 mb-6">
                                <TrendingUp className="w-5 h-5 text-primary-light" />
                                <h2 className="text-lg font-semibold text-text-primary">Évolution Temporelle</h2>
                            </div>
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={history}>
                                    <defs>
                                        <linearGradient id="aqiGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                    <XAxis dataKey="time" stroke="#6B7280" fontSize={12} />
                                    <YAxis stroke="#6B7280" fontSize={12} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'rgba(17, 24, 39, 0.95)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '12px',
                                            backdropFilter: 'blur(10px)'
                                        }}
                                    />
                                    <Legend />
                                    <Area type="monotone" dataKey="aqi" stroke="#6366F1" fill="url(#aqiGradient)" strokeWidth={2} name="AQI" />
                                    <Line type="monotone" dataKey="pm25" stroke="#fbbf24" strokeWidth={2} dot={false} name="PM2.5" />
                                    <Line type="monotone" dataKey="pm10" stroke="#f97316" strokeWidth={2} dot={false} name="PM10" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </>
            )}

            {/* Info Box */}
            <div className="card bg-gradient-to-r from-primary/10 to-accent-cyan/10 border-primary/20">
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="w-5 h-5 text-primary-light" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-text-primary mb-1">Protocole SOAP</h3>
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
