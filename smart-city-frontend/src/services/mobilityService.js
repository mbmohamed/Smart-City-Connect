import axios from 'axios';

const API_BASE_URL = '/api/v1/transport';

const mobilityService = {
    // Get all transport lines
    async getAllLines() {
        try {
            const response = await axios.get(`${API_BASE_URL}/lines`);
            return response.data;
        } catch (error) {
            console.error('Error fetching transport lines:', error);
            throw error;
        }
    },

    // Get line by ID
    async getLineById(id) {
        try {
            const response = await axios.get(`${API_BASE_URL}/lines/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching line ${id}:`, error);
            throw error;
        }
    },

    // Create new line
    async createLine(lineData) {
        try {
            const response = await axios.post(`${API_BASE_URL}/lines`, lineData);
            return response.data;
        } catch (error) {
            console.error('Error creating line:', error);
            throw error;
        }
    },

    // Update line
    async updateLine(id, lineData) {
        try {
            const response = await axios.put(`${API_BASE_URL}/lines/${id}`, lineData);
            return response.data;
        } catch (error) {
            console.error(`Error updating line ${id}:`, error);
            throw error;
        }
    },

    // Delete line
    async deleteLine(id) {
        try {
            await axios.delete(`${API_BASE_URL}/lines/${id}`);
            return true;
        } catch (error) {
            console.error(`Error deleting line ${id}:`, error);
            throw error;
        }
    }
};

export default mobilityService;
