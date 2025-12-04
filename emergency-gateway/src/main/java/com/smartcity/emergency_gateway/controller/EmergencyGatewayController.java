package com.smartcity.emergency_gateway.controller;

import com.smartcity.emergency_gateway.dto.*;
import com.smartcity.emergency_service.grpc.*;
import net.devh.boot.grpc.client.inject.GrpcClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/emergency")
@CrossOrigin(origins = "*")
public class EmergencyGatewayController {

    @GrpcClient("emergency-service")
    private EmergencyServiceGrpc.EmergencyServiceBlockingStub emergencyStub;

    @PostMapping("/alerts")
    public ResponseEntity<AlertDTO> createAlert(
            @RequestBody com.smartcity.emergency_gateway.dto.CreateAlertDTO request) {
        try {
            com.smartcity.emergency_service.grpc.CreateAlertRequest grpcRequest = com.smartcity.emergency_service.grpc.CreateAlertRequest
                    .newBuilder()
                    .setType(AlertType.valueOf(request.type()))
                    .setLocation(request.location())
                    .setSeverity(Severity.valueOf(request.severity()))
                    .setDescription(request.description())
                    .setReportedBy(request.reportedBy() != null ? request.reportedBy() : "Web User")
                    .setCoordinates(Coordinates.newBuilder()
                            .setLatitude(request.coordinates().latitude())
                            .setLongitude(request.coordinates().longitude())
                            .build())
                    .build();

            AlertResponse response = emergencyStub.createAlert(grpcRequest);
            return ResponseEntity.ok(mapToAlertDTO(response));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/alerts/{id}")
    public ResponseEntity<AlertDTO> getAlert(@PathVariable String id) {
        try {
            GetAlertRequest request = GetAlertRequest.newBuilder()
                    .setAlertId(id)
                    .build();

            AlertResponse response = emergencyStub.getAlertStatus(request);
            return ResponseEntity.ok(mapToAlertDTO(response));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/alerts")
    public ResponseEntity<List<AlertDTO>> getActiveAlerts() {
        try {
            // Note: In real implementation, you'd need to implement a proper way to fetch
            // all alerts
            // For now, using a workaround by streaming with no filters
            List<AlertDTO> alerts = new ArrayList<>();

            StreamAlertsRequest request = StreamAlertsRequest.newBuilder().build();

            // Collect first 50 alerts from stream
            emergencyStub.streamAlerts(request).forEachRemaining(response -> {
                if (alerts.size() < 50) {
                    alerts.add(mapToAlertDTO(response));
                }
            });

            return ResponseEntity.ok(alerts);
        } catch (Exception e) {
            return ResponseEntity.ok(new ArrayList<>()); // Return empty list on error
        }
    }

    @GetMapping("/resources")
    public ResponseEntity<List<ResourceDTO>> getAvailableResources(
            @RequestParam(required = false) String type) {
        try {
            ResourceRequest.Builder builder = ResourceRequest.newBuilder();

            if (type != null && !type.isEmpty()) {
                builder.setType(ResourceType.valueOf(type));
            }

            ResourceResponse response = emergencyStub.getAvailableResources(builder.build());

            List<ResourceDTO> resources = response.getResourcesList().stream()
                    .map(this::mapToResourceDTO)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(resources);
        } catch (Exception e) {
            return ResponseEntity.ok(new ArrayList<>()); // Return empty list on error
        }
    }

    private AlertDTO mapToAlertDTO(AlertResponse response) {
        return new AlertDTO(
                response.getAlertId(),
                response.getType().name(),
                response.getLocation(),
                response.getSeverity().name(),
                response.getDescription(),
                response.getStatus().name(),
                response.getTimestamp(),
                response.getAssignedUnit(),
                null // coordinates not in response
        );
    }

    private ResourceDTO mapToResourceDTO(Resource resource) {
        return new ResourceDTO(
                resource.getResourceId(),
                resource.getType().name(),
                resource.getLocation(),
                resource.getStatus().name(),
                new CoordinatesDTO(
                        resource.getCoordinates().getLatitude(),
                        resource.getCoordinates().getLongitude()));
    }
}
