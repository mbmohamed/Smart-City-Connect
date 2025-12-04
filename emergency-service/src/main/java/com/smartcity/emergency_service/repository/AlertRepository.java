package com.smartcity.emergency_service.repository;

import com.smartcity.emergency_service.model.Alert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AlertRepository extends JpaRepository<Alert, String> {

    List<Alert> findByStatus(Alert.AlertStatus status);

    List<Alert> findByType(Alert.AlertType type);

    List<Alert> findBySeverity(Alert.Severity severity);

    List<Alert> findByStatusOrderByTimestampDesc(Alert.AlertStatus status);
}
