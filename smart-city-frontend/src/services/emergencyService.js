import axios from 'axios';

const GATEWAY_URL = 'http://localhost:8083/api/emergency';

const emergencyService = {
    // Get all active alerts
    async getActiveAlerts() {
        try {
            const response = await axios.get(`${GATEWAY_URL}/alerts`);
            return response.data;
        } catch (error) {
            console.error('Error fetching alerts:', error);
            return [];
        }
    },

    // Create new alert
    async createAlert(alertData) {
        try {
            const response = await axios.post(`${GATEWAY_URL}/alerts`, alertData);
            return response.data;
        } catch (error) {
            console.error('Error creating alert:', error);
            throw error;
        }
    },

    // Get available resources
    async getAvailableResources(type = null) {
        try {
            const params = type ? { type } : {};
            const response = await axios.get(`${GATEWAY_URL}/resources`, { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching resources:', error);
            return [];
        }
    },

    // Get health status
    async getHealth() {
        try {
            const response = await axios.get('http://localhost:8083/actuator/health');
            return response.data;
        } catch (error) {
            console.error('Error checking health:', error);
            throw error;
        }
    }
};

export default emergencyService;
