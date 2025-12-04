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

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "getAirQualityRequest")
    @ResponsePayload
    public GetAirQualityResponse getAirQuality(@RequestPayload GetAirQualityRequest request) {
        GetAirQualityResponse response = new GetAirQualityResponse();
        AirQualityData data = new AirQualityData();

        // Mock data for now
        data.setZoneId(request.getZoneId());
        data.setAqi(42);
        data.setPm25(12.5);
        data.setPm10(20.0);
        data.setNo2(15.0);
        data.setStatus("GOOD");
        data.setTimestamp(LocalDateTime.now().toString());

        response.setAirQualityData(data);
        return response;
    }
}
