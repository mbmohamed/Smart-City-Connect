package com.smartcity.emergency_service.grpc;

import com.smartcity.emergency_service.model.Alert;
import com.smartcity.emergency_service.model.EmergencyResource;
import com.smartcity.emergency_service.service.AlertService;
import com.smartcity.emergency_service.service.ResourceService;
import io.grpc.stub.StreamObserver;
import net.devh.boot.grpc.server.service.GrpcService;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@GrpcService
public class EmergencyGrpcServiceImpl extends EmergencyServiceGrpc.EmergencyServiceImplBase {

    private final AlertService alertService;
    private final ResourceService resourceService;
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

    @Autowired
    public EmergencyGrpcServiceImpl(AlertService alertService, ResourceService resourceService) {
        this.alertService = alertService;
        this.resourceService = resourceService;
    }

    @Override
    public void createAlert(CreateAlertRequest request, StreamObserver<AlertResponse> responseObserver) {
        try {
            // Convert gRPC request to JPA entity
            Alert alert = new Alert();
            alert.setType(mapAlertType(request.getType()));
            alert.setLocation(request.getLocation());
            alert.setSeverity(mapSeverity(request.getSeverity()));
            alert.setDescription(request.getDescription());
            alert.setReportedBy(request.getReportedBy());

            if (request.hasCoordinates()) {
                alert.setLatitude(request.getCoordinates().getLatitude());
                alert.setLongitude(request.getCoordinates().getLongitude());
            }

            // Save alert
            Alert savedAlert = alertService.createAlert(alert);

            // Convert entity to gRPC response
            AlertResponse response = mapToAlertResponse(savedAlert);

            responseObserver.onNext(response);
            responseObserver.onCompleted();
        } catch (Exception e) {
            responseObserver.onError(io.grpc.Status.INTERNAL
                    .withDescription("Failed to create alert: " + e.getMessage())
                    .asRuntimeException());
        }
    }

    @Override
    public void getAlertStatus(GetAlertRequest request, StreamObserver<AlertResponse> responseObserver) {
        try {
            Optional<Alert> alert = alertService.getAlertById(request.getAlertId());

            if (alert.isPresent()) {
                AlertResponse response = mapToAlertResponse(alert.get());
                responseObserver.onNext(response);
                responseObserver.onCompleted();
            } else {
                responseObserver.onError(io.grpc.Status.NOT_FOUND
                        .withDescription("Alert not found: " + request.getAlertId())
                        .asRuntimeException());
            }
        } catch (Exception e) {
            responseObserver.onError(io.grpc.Status.INTERNAL
                    .withDescription("Failed to get alert: " + e.getMessage())
                    .asRuntimeException());
        }
    }

    @Override
    public void updateAlertStatus(UpdateAlertRequest request, StreamObserver<AlertResponse> responseObserver) {
        try {
            Optional<Alert> updated = alertService.updateAlertStatus(
                    request.getAlertId(),
                    mapAlertStatus(request.getNewStatus()),
                    request.getAssignedUnit());

            if (updated.isPresent()) {
                AlertResponse response = mapToAlertResponse(updated.get());
                responseObserver.onNext(response);
                responseObserver.onCompleted();
            } else {
                responseObserver.onError(io.grpc.Status.NOT_FOUND
                        .withDescription("Alert not found: " + request.getAlertId())
                        .asRuntimeException());
            }
        } catch (Exception e) {
            responseObserver.onError(io.grpc.Status.INTERNAL
                    .withDescription("Failed to update alert: " + e.getMessage())
                    .asRuntimeException());
        }
    }

    @Override
    public void streamAlerts(StreamAlertsRequest request, StreamObserver<AlertResponse> responseObserver) {
        // Stream alerts in real-time every 2 seconds
        scheduler.scheduleAtFixedRate(() -> {
            try {
                List<Alert> alerts = alertService.getAllAlerts();

                for (Alert alert : alerts) {
                    // Apply filters if specified
                    if (request.getTypeFilter() != AlertType.ALERT_TYPE_UNSPECIFIED &&
                            mapAlertType(request.getTypeFilter()) != alert.getType()) {
                        continue;
                    }

                    if (request.getMinSeverity() != Severity.SEVERITY_UNSPECIFIED &&
                            alert.getSeverity().ordinal() < mapSeverity(request.getMinSeverity()).ordinal()) {
                        continue;
                    }

                    AlertResponse response = mapToAlertResponse(alert);
                    responseObserver.onNext(response);
                }
            } catch (Exception e) {
                responseObserver.onError(io.grpc.Status.INTERNAL
                        .withDescription("Stream error: " + e.getMessage())
                        .asRuntimeException());
            }
        }, 0, 2, TimeUnit.SECONDS);
    }

    @Override
    public void getAvailableResources(ResourceRequest request, StreamObserver<ResourceResponse> responseObserver) {
        try {
            List<EmergencyResource> resources;

            // Check if location coordinates are provided
            if (request.getLocation() != null &&
                    request.getLocation().getLatitude() != 0.0 &&
                    request.getRadiusKm() > 0) {
                // Find nearby resources
                resources = resourceService.findNearbyResources(
                        request.getLocation().getLatitude(),
                        request.getLocation().getLongitude(),
                        request.getRadiusKm(),
                        EmergencyResource.ResourceStatus.AVAILABLE);
            } else if (request.getType() != ResourceType.RESOURCE_TYPE_UNSPECIFIED) {
                // Find by type
                resources = resourceService.getAvailableResources(mapResourceType(request.getType()));
            } else {
                // Get all available
                resources = resourceService.getAllAvailableResources();
            }

            // Build response
            ResourceResponse.Builder responseBuilder = ResourceResponse.newBuilder();
            for (EmergencyResource res : resources) {
                Resource grpcResource = Resource.newBuilder()
                        .setResourceId(res.getId())
                        .setType(mapToGrpcResourceType(res.getType()))
                        .setLocation(res.getLocation())
                        .setStatus(mapToGrpcResourceStatus(res.getStatus()))
                        .setCoordinates(Coordinates.newBuilder()
                                .setLatitude(res.getLatitude() != null ? res.getLatitude() : 0.0)
                                .setLongitude(res.getLongitude() != null ? res.getLongitude() : 0.0)
                                .build())
                        .build();
                responseBuilder.addResources(grpcResource);
            }

            responseObserver.onNext(responseBuilder.build());
            responseObserver.onCompleted();
        } catch (Exception e) {
            responseObserver.onError(io.grpc.Status.INTERNAL
                    .withDescription("Failed to get resources: " + e.getMessage())
                    .asRuntimeException());
        }
    }

    // Mapping helpers
    private AlertResponse mapToAlertResponse(Alert alert) {
        return AlertResponse.newBuilder()
                .setAlertId(alert.getId())
                .setType(mapToGrpcAlertType(alert.getType()))
                .setLocation(alert.getLocation())
                .setSeverity(mapToGrpcSeverity(alert.getSeverity()))
                .setDescription(alert.getDescription() != null ? alert.getDescription() : "")
                .setStatus(mapToGrpcAlertStatus(alert.getStatus()))
                .setTimestamp(alert.getTimestamp().toEpochMilli())
                .setAssignedUnit(alert.getAssignedUnit() != null ? alert.getAssignedUnit() : "")
                .build();
    }

    private Alert.AlertType mapAlertType(AlertType grpcType) {
        return switch (grpcType) {
            case MEDICAL_EMERGENCY -> Alert.AlertType.MEDICAL_EMERGENCY;
            case FIRE -> Alert.AlertType.FIRE;
            case ACCIDENT -> Alert.AlertType.ACCIDENT;
            case PUBLIC_HEALTH_THREAT -> Alert.AlertType.PUBLIC_HEALTH_THREAT;
            case NATURAL_DISASTER -> Alert.AlertType.NATURAL_DISASTER;
            default -> Alert.AlertType.MEDICAL_EMERGENCY;
        };
    }

    private AlertType mapToGrpcAlertType(Alert.AlertType jpaType) {
        return switch (jpaType) {
            case MEDICAL_EMERGENCY -> AlertType.MEDICAL_EMERGENCY;
            case FIRE -> AlertType.FIRE;
            case ACCIDENT -> AlertType.ACCIDENT;
            case PUBLIC_HEALTH_THREAT -> AlertType.PUBLIC_HEALTH_THREAT;
            case NATURAL_DISASTER -> AlertType.NATURAL_DISASTER;
        };
    }

    private Alert.Severity mapSeverity(Severity grpcSeverity) {
        return switch (grpcSeverity) {
            case LOW -> Alert.Severity.LOW;
            case MEDIUM -> Alert.Severity.MEDIUM;
            case HIGH -> Alert.Severity.HIGH;
            case CRITICAL -> Alert.Severity.CRITICAL;
            default -> Alert.Severity.MEDIUM;
        };
    }

    private Severity mapToGrpcSeverity(Alert.Severity jpaSeverity) {
        return switch (jpaSeverity) {
            case LOW -> Severity.LOW;
            case MEDIUM -> Severity.MEDIUM;
            case HIGH -> Severity.HIGH;
            case CRITICAL -> Severity.CRITICAL;
        };
    }

    private Alert.AlertStatus mapAlertStatus(AlertStatus grpcStatus) {
        return switch (grpcStatus) {
            case PENDING -> Alert.AlertStatus.PENDING;
            case ACKNOWLEDGED -> Alert.AlertStatus.ACKNOWLEDGED;
            case DISPATCHED -> Alert.AlertStatus.DISPATCHED;
            case ON_SITE -> Alert.AlertStatus.ON_SITE;
            case RESOLVED -> Alert.AlertStatus.RESOLVED;
            case CANCELLED -> Alert.AlertStatus.CANCELLED;
            default -> Alert.AlertStatus.PENDING;
        };
    }

    private AlertStatus mapToGrpcAlertStatus(Alert.AlertStatus jpaStatus) {
        return switch (jpaStatus) {
            case PENDING -> AlertStatus.PENDING;
            case ACKNOWLEDGED -> AlertStatus.ACKNOWLEDGED;
            case DISPATCHED -> AlertStatus.DISPATCHED;
            case ON_SITE -> AlertStatus.ON_SITE;
            case RESOLVED -> AlertStatus.RESOLVED;
            case CANCELLED -> AlertStatus.CANCELLED;
        };
    }

    private EmergencyResource.ResourceType mapResourceType(ResourceType grpcType) {
        return switch (grpcType) {
            case AMBULANCE -> EmergencyResource.ResourceType.AMBULANCE;
            case FIRE_TRUCK -> EmergencyResource.ResourceType.FIRE_TRUCK;
            case POLICE -> EmergencyResource.ResourceType.POLICE;
            case HELICOPTER -> EmergencyResource.ResourceType.HELICOPTER;
            default -> EmergencyResource.ResourceType.AMBULANCE;
        };
    }

    private ResourceType mapToGrpcResourceType(EmergencyResource.ResourceType jpaType) {
        return switch (jpaType) {
            case AMBULANCE -> ResourceType.AMBULANCE;
            case FIRE_TRUCK -> ResourceType.FIRE_TRUCK;
            case POLICE -> ResourceType.POLICE;
            case HELICOPTER -> ResourceType.HELICOPTER;
        };
    }

    private ResourceStatus mapToGrpcResourceStatus(EmergencyResource.ResourceStatus jpaStatus) {
        return switch (jpaStatus) {
            case AVAILABLE -> ResourceStatus.AVAILABLE;
            case BUSY -> ResourceStatus.BUSY;
            case OFFLINE -> ResourceStatus.OFFLINE;
        };
    }
}
