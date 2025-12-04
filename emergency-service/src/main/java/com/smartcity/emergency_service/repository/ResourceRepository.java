package com.smartcity.emergency_service.repository;

import com.smartcity.emergency_service.model.EmergencyResource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ResourceRepository extends JpaRepository<EmergencyResource, String> {

    List<EmergencyResource> findByTypeAndStatus(
            EmergencyResource.ResourceType type,
            EmergencyResource.ResourceStatus status);

    List<EmergencyResource> findByStatus(EmergencyResource.ResourceStatus status);

    // Find resources within a radius (simplified version using bounding box)
    @Query("SELECT r FROM EmergencyResource r WHERE " +
            "r.latitude BETWEEN :minLat AND :maxLat AND " +
            "r.longitude BETWEEN :minLon AND :maxLon AND " +
            "r.status = :status")
    List<EmergencyResource> findNearby(
            @Param("minLat") double minLat,
            @Param("maxLat") double maxLat,
            @Param("minLon") double minLon,
            @Param("maxLon") double maxLon,
            @Param("status") EmergencyResource.ResourceStatus status);
}
