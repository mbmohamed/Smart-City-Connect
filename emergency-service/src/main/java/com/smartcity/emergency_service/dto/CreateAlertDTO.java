package com.smartcity.emergency_service.dto;

public record CreateAlertDTO(
        String type,
        String location,
        String severity,
        String description,
        String reportedBy,
        CoordinatesDTO coordinates) {
}
