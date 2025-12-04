package com.smartcity.mobility_service.service;

import com.smartcity.mobility_service.dto.TransportLineDTO;
import com.smartcity.mobility_service.model.TransportLine;
import com.smartcity.mobility_service.repository.TransportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TransportService {

    private final TransportRepository repository;

    @Autowired
    public TransportService(TransportRepository repository) {
        this.repository = repository;
    }

    public List<TransportLineDTO> getAllLines() {
        return repository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public TransportLineDTO getLineById(Long id) {
        return repository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() -> new com.smartcity.mobility_service.exception.ResourceNotFoundException(
                        "TransportLine not found with id " + id));
    }

    public TransportLineDTO createLine(TransportLineDTO dto) {
        TransportLine entity = convertToEntity(dto);
        TransportLine saved = repository.save(entity);
        return convertToDTO(saved);
    }

    private TransportLineDTO convertToDTO(TransportLine entity) {
        return new TransportLineDTO(entity.getId(), entity.getName(), entity.getType(), entity.getStatus());
    }

    private TransportLine convertToEntity(TransportLineDTO dto) {
        return new TransportLine(dto.id(), dto.name(), dto.type(), dto.status());
    }
}
