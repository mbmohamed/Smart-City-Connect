package com.smartcity.air_quality_service.controller;

import com.smartcity.air_quality_service.model.AirQualityEntity;
import com.smartcity.air_quality_service.repository.AirQualityRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/admin/air-quality")
public class AirQualityAdminController {

    private final AirQualityRepository repository;

    public AirQualityAdminController(AirQualityRepository repository) {
        this.repository = repository;
    }

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
