package com.smartcity.air_quality_service.repository;

import com.smartcity.air_quality_service.model.AirQualityEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AirQualityRepository extends JpaRepository<AirQualityEntity, Long> {
    Optional<AirQualityEntity> findByZoneId(String zoneId);
}
