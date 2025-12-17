package com.smartcity.air_quality_service.controller;

import com.smartcity.air_quality_service.model.AirQualityEntity;
import com.smartcity.air_quality_service.repository.AirQualityRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/admin/air-quality")
@Tag(name = "Air Quality Admin", description = "Administrative operations for Air Quality data")
public class AirQualityAdminController {

    private final AirQualityRepository repository;

    public AirQualityAdminController(AirQualityRepository repository) {
        this.repository = repository;
    }

    @Operation(summary = "Seed Air Quality Data", description = "Bulk insert air quality records.")
    @PostMapping("/seed")
    public ResponseEntity<String> seedData(@RequestBody List<AirQualityEntity> entities) {
        for (AirQualityEntity entity : entities) {
            if (entity.getTimestamp() == null) {
                entity.setTimestamp(LocalDateTime.now());
            }
            repository.save(entity);
        }
        return ResponseEntity.ok("Seeded " + entities.size() + " records");
    }
}
