package com.smartcity.mobility_service.controller;

import com.smartcity.mobility_service.dto.TransportLineDTO;
import com.smartcity.mobility_service.service.TransportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/v1/transport/lines")
@Tag(name = "Mobility", description = "Operations related to transport lines")
public class TransportController {

    private final TransportService service;

    @Autowired
    public TransportController(TransportService service) {
        this.service = service;
    }

    @Operation(summary = "Get all transport lines", description = "Retrieves a list of all available transport lines.")
    @GetMapping
    public ResponseEntity<List<TransportLineDTO>> getAllLines() {
        return ResponseEntity.ok(service.getAllLines());
    }

    @Operation(summary = "Get a line by ID", description = "Retrieves a specific transport line by its unique identifier.")
    @GetMapping("/{id}")
    public ResponseEntity<TransportLineDTO> getLineById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getLineById(id));
    }

    @Operation(summary = "Create a new line", description = "Creates a new transport line with the provided details.")
    @PostMapping
    public ResponseEntity<TransportLineDTO> createLine(@RequestBody TransportLineDTO dto) {
        return new ResponseEntity<>(service.createLine(dto), HttpStatus.CREATED);
    }
}
