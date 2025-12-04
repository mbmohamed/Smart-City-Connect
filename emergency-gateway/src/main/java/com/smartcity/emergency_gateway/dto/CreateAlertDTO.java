package com.smartcity.emergency_gateway.dto;

public record CreateAlertDTO(
                String type,
                String location,
                String severity,
                String description,
                String reportedBy,
                CoordinatesDTO coordinates) {
}
