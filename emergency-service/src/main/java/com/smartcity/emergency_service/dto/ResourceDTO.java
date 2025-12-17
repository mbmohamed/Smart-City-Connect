package com.smartcity.emergency_service.dto;

public record ResourceDTO(
        String id,
        String type,
        String location,
        String status,
        CoordinatesDTO coordinates) {
}
