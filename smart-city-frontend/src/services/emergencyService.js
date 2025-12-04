import axios from 'axios';

// For now, we'll use REST API as a proxy to gRPC
// In production, you could use grpc-web or a dedicated REST gateway
const API_BASE_URL = 'http://localhost:8082';

const emergencyService = {
    // Get health status
    async getHealth() {
        try {
            const response = await axios.get(`${API_BASE_URL}/actuator/health`);
            return response.data;
        } catch (error) {
            console.error('Error checking health:', error);
            throw error;
        }
    },

    // Mock alerts for demonstration (in production, use gRPC-Web or REST gateway)
    async getActiveAlerts() {
        // Simulating data that would come from gRPC StreamAlerts
        return [
            {
                id: '1',
                type: 'MEDICAL_EMERGENCY',
                location: 'Rue de la République, Lyon',
                severity: 'CRITICAL',
                status: 'DISPATCHED',
                coordinates: { latitude: 45.7578, longitude: 4.8320 },
                timestamp: new Date().toISOString()
            },
            {
                id: '2',
                type: 'FIRE',
                location: 'Avenue Jean Jaurès, Lyon',
                severity: 'HIGH',
                status: 'ON_SITE',
                coordinates: { latitude: 45.7640, longitude: 4.8357 },
                timestamp: new Date(Date.now() - 300000).toISOString()
            }
        ];
    },

    // Mock create alert
    async createAlert(alertData) {
        console.log('Creating alert (mock):', alertData);
        return {
            id: Math.random().toString(36).substr(2, 9),
            ...alertData,
            status: 'PENDING',
            timestamp: new Date().toISOString()
        };
    },

    // Mock resources
    async getAvailableResources() {
        return [
            {
                id: 'AMB-001',
                type: 'AMBULANCE',
                location: 'Station Centrale',
                status: 'AVAILABLE',
                coordinates: { latitude: 45.7500, longitude: 4.8500 }
            },
            {
                id: 'FIRE-001',
                type: 'FIRE_TRUCK',
                location: 'Caserne Nord',
                status: 'AVAILABLE',
                coordinates: { latitude: 45.7700, longitude: 4.8400 }
            },
            {
                id: 'POL-001',
                type: 'POLICE',
                location: 'Commissariat Centre',
                status: 'BUSY',
                coordinates: { latitude: 45.7600, longitude: 4.8300 }
            }
        ];
    }
};

export default emergencyService;
