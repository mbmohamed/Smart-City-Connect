package com.smartcity.emergency_service.service;

import com.smartcity.emergency_service.model.EmergencyResource;
import com.smartcity.emergency_service.repository.ResourceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ResourceService {

    private final ResourceRepository resourceRepository;

    public ResourceService(ResourceRepository resourceRepository) {
        this.resourceRepository = resourceRepository;
    }

    @Transactional
    public EmergencyResource createResource(EmergencyResource resource) {
        return resourceRepository.save(resource);
    }

    public List<EmergencyResource> getAvailableResources(EmergencyResource.ResourceType type) {
        return resourceRepository.findByTypeAndStatus(type, EmergencyResource.ResourceStatus.AVAILABLE);
    }

    public List<EmergencyResource> getAllAvailableResources() {
        return resourceRepository.findByStatus(EmergencyResource.ResourceStatus.AVAILABLE);
    }

    /**
     * Find nearest available resource using simplified bounding box
     * radiusKm is converted to approximate lat/lon degrees
     */
    public List<EmergencyResource> findNearbyResources(
            double latitude,
            double longitude,
            double radiusKm,
            EmergencyResource.ResourceStatus status) {

        // Approximate: 1 degree latitude ≈ 111 km
        // 1 degree longitude ≈ 111 km * cos(latitude)
        double latDelta = radiusKm / 111.0;
        double lonDelta = radiusKm / (111.0 * Math.cos(Math.toRadians(latitude)));

        return resourceRepository.findNearby(
                latitude - latDelta,
                latitude + latDelta,
                longitude - lonDelta,
                longitude + lonDelta,
                status);
    }
}
