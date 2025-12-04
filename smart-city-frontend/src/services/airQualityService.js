import axios from 'axios';

const SOAP_ENDPOINT = 'http://localhost:8081/ws';

const airQualityService = {
    // Get air quality for a zone (SOAP request)
    async getAirQuality(zoneId) {
        const soapEnvelope = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
                        xmlns:gs="http://smartcity.com/air-quality-service/schema">
        <soapenv:Header/>
        <soapenv:Body>
          <gs:getAirQualityRequest>
            <gs:zoneId>${zoneId}</gs:zoneId>
          </gs:getAirQualityRequest>
        </soapenv:Body>
      </soapenv:Envelope>
    `;

        try {
            const response = await axios.post(SOAP_ENDPOINT, soapEnvelope, {
                headers: {
                    'Content-Type': 'text/xml',
                    'SOAPAction': ''
                }
            });

            // Parse SOAP XML response
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(response.data, 'text/xml');

            // Extract data from XML
            const getData = (tagName) => {
                const element = xmlDoc.getElementsByTagNameNS('*', tagName)[0];
                return element ? element.textContent : null;
            };

            return {
                zoneId: getData('zoneId'),
                aqi: parseInt(getData('aqi')),
                quality: getData('quality'),
                pm25: parseFloat(getData('pm25')),
                pm10: parseFloat(getData('pm10')),
                co2: parseFloat(getData('co2')),
                timestamp: getData('timestamp')
            };
        } catch (error) {
            console.error('Error fetching air quality:', error);
            throw error;
        }
    },

    // Get all zones
    async getAllZones() {
        const soapEnvelope = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
                        xmlns:gs="http://smartcity.com/air-quality-service/schema">
        <soapenv:Header/>
        <soapenv:Body>
          <gs:getAllZonesRequest/>
        </soapenv:Body>
      </soapenv:Envelope>
    `;

        try {
            const response = await axios.post(SOAP_ENDPOINT, soapEnvelope, {
                headers: {
                    'Content-Type': 'text/xml',
                    'SOAPAction': ''
                }
            });

            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(response.data, 'text/xml');
            const zones = xmlDoc.getElementsByTagNameNS('*', 'zone');

            return Array.from(zones).map(zone => ({
                id: zone.getElementsByTagNameNS('*', 'zoneId')[0]?.textContent,
                name: zone.getElementsByTagNameNS('*', 'name')[0]?.textContent
            }));
        } catch (error) {
            console.error('Error fetching zones:', error);
            // Return default zones if SOAP fails
            return [
                { id: 'ZONE_001', name: 'Centre Ville' },
                { id: 'ZONE_002', name: 'Zone Industrielle' },
                { id: 'ZONE_003', name: 'Quartier Résidentiel' }
            ];
        }
    }
};

export default airQualityService;
