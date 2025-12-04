package com.smartcity.emergency_gateway.dto;

import java.util.List;

public record ResourceDTO(
        String id,
        String type,
        String location,
        String status,
        CoordinatesDTO coordinates) {
}
