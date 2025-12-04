package com.smartcity.emergency_gateway.dto;

public record AlertDTO(
        String id,
        String type,
        String location,
        String severity,
        String description,
        String status,
        Long timestamp,
        String assignedUnit,
        CoordinatesDTO coordinates) {
}
