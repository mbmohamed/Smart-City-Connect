package com.smartcity.air_quality_service.endpoint;

import com.smartcity.air_quality_service.schema.GetAirQualityRequest;
import com.smartcity.air_quality_service.schema.GetAirQualityResponse;
import com.smartcity.air_quality_service.schema.AirQualityData;
import org.springframework.ws.server.endpoint.annotation.Endpoint;
import org.springframework.ws.server.endpoint.annotation.PayloadRoot;
import org.springframework.ws.server.endpoint.annotation.RequestPayload;
import org.springframework.ws.server.endpoint.annotation.ResponsePayload;

import java.time.LocalDateTime;

@Endpoint
public class AirQualityEndpoint {

    private static final String NAMESPACE_URI = "http://smartcity.com/air-quality-service/schema";

    private final com.smartcity.air_quality_service.repository.AirQualityRepository airQualityRepository;

    @org.springframework.beans.factory.annotation.Autowired
    public AirQualityEndpoint(com.smartcity.air_quality_service.repository.AirQualityRepository airQualityRepository) {
        this.airQualityRepository = airQualityRepository;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "getAirQualityRequest")
    @ResponsePayload
    public GetAirQualityResponse getAirQuality(@RequestPayload GetAirQualityRequest request) {
        GetAirQualityResponse response = new GetAirQualityResponse();
        AirQualityData data = new AirQualityData();

        com.smartcity.air_quality_service.model.AirQualityEntity entity = airQualityRepository
                .findByZoneId(request.getZoneId())
                .orElse(null);

        if (entity != null) {
            data.setZoneId(entity.getZoneId());
            data.setAqi(entity.getAqi());
            data.setPm25(entity.getPm25());
            data.setPm10(entity.getPm10());
            data.setNo2(entity.getNo2());
            data.setStatus(entity.getStatus());
            data.setTimestamp(entity.getTimestamp().toString());
        } else {
            // Handle case where zone is not found - return empty or default
            data.setZoneId(request.getZoneId());
            data.setStatus("UNKNOWN_ZONE");
            data.setTimestamp(LocalDateTime.now().toString());
        }

        response.setAirQualityData(data);
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "getAllZonesRequest")
    @ResponsePayload
    public com.smartcity.air_quality_service.schema.GetAllZonesResponse getAllZones(
            @RequestPayload com.smartcity.air_quality_service.schema.GetAllZonesRequest request) {
        com.smartcity.air_quality_service.schema.GetAllZonesResponse response = new com.smartcity.air_quality_service.schema.GetAllZonesResponse();

        java.util.List<com.smartcity.air_quality_service.model.AirQualityEntity> entities = airQualityRepository
                .findAll();
        java.util.Set<String> processedZones = new java.util.HashSet<>();

        for (com.smartcity.air_quality_service.model.AirQualityEntity entity : entities) {
            if (!processedZones.contains(entity.getZoneId())) {
                com.smartcity.air_quality_service.schema.Zone zone = new com.smartcity.air_quality_service.schema.Zone();
                zone.setZoneId(entity.getZoneId());
                zone.setName(formatZoneName(entity.getZoneId()));
                response.getZone().add(zone);
                processedZones.add(entity.getZoneId());
            }
        }

        return response;
    }

    private String formatZoneName(String zoneId) {
        switch (zoneId) {
            case "ZONE_TUNIS":
                return "Tunis Centre";
            case "ZONE_RADES":
                return "Radès";
            case "ZONE_CARTHAGE":
                return "Carthage";
            case "ZONE_ENNASR":
                return "Ennasr";
            case "ZONE_BAB_SAADOUN":
                return "Bab Saadoun";
            default:
                return zoneId.replace("ZONE_", "").replace("_", " ");
        }
    }
}
