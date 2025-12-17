package com.smartcity.emergency_service.dto;

public record AlertDTO(
        String id,
        String type,
        String location,
        String severity,
        String description,
        String status,
        String timestamp,
        String assignedUnit,
        CoordinatesDTO coordinates) {
}
