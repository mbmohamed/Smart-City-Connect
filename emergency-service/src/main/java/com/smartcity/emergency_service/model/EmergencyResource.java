package com.smartcity.emergency_service.model;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "emergency_resources")
public class EmergencyResource {

    @Id
    private String id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ResourceType type;

    @Column(nullable = false)
    private String location;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ResourceStatus status;

    // Coordinates
    private Double latitude;
    private Double longitude;

    public EmergencyResource() {
        this.id = UUID.randomUUID().toString();
        this.status = ResourceStatus.AVAILABLE;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public ResourceType getType() {
        return type;
    }

    public void setType(ResourceType type) {
        this.type = type;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public ResourceStatus getStatus() {
        return status;
    }

    public void setStatus(ResourceStatus status) {
        this.status = status;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    // Enums
    public enum ResourceType {
        AMBULANCE,
        FIRE_TRUCK,
        POLICE,
        HELICOPTER
    }

    public enum ResourceStatus {
        AVAILABLE,
        BUSY,
        OFFLINE
    }
}
