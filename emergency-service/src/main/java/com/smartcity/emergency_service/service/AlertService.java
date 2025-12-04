package com.smartcity.emergency_service.service;

import com.smartcity.emergency_service.model.Alert;
import com.smartcity.emergency_service.repository.AlertRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
public class AlertService {

    private final AlertRepository alertRepository;

    public AlertService(AlertRepository alertRepository) {
        this.alertRepository = alertRepository;
    }

    @Transactional
    public Alert createAlert(Alert alert) {
        alert.setTimestamp(Instant.now());
        if (alert.getStatus() == null) {
            alert.setStatus(Alert.AlertStatus.PENDING);
        }
        return alertRepository.save(alert);
    }

    public Optional<Alert> getAlertById(String id) {
        return alertRepository.findById(id);
    }

    @Transactional
    public Optional<Alert> updateAlertStatus(String id, Alert.AlertStatus newStatus, String assignedUnit) {
        Optional<Alert> optionalAlert = alertRepository.findById(id);
        if (optionalAlert.isPresent()) {
            Alert alert = optionalAlert.get();
            alert.setStatus(newStatus);
            if (assignedUnit != null && !assignedUnit.isEmpty()) {
                alert.setAssignedUnit(assignedUnit);
            }
            return Optional.of(alertRepository.save(alert));
        }
        return Optional.empty();
    }

    public List<Alert> getAlertsByStatus(Alert.AlertStatus status) {
        return alertRepository.findByStatusOrderByTimestampDesc(status);
    }

    public List<Alert> getAlertsByType(Alert.AlertType type) {
        return alertRepository.findByType(type);
    }

    public List<Alert> getAllAlerts() {
        return alertRepository.findAll();
    }
}
