package com.smartcity.mobility_service.repository;

import com.smartcity.mobility_service.model.TransportLine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TransportRepository extends JpaRepository<TransportLine, Long> {
}
