package com.smartcity.mobility_service.controller;

import com.smartcity.mobility_service.dto.TransportLineDTO;
import com.smartcity.mobility_service.service.TransportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/transport/lines")
public class TransportController {

    private final TransportService service;

    @Autowired
    public TransportController(TransportService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<TransportLineDTO>> getAllLines() {
        return ResponseEntity.ok(service.getAllLines());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TransportLineDTO> getLineById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getLineById(id));
    }

    @PostMapping
    public ResponseEntity<TransportLineDTO> createLine(@RequestBody TransportLineDTO dto) {
        return new ResponseEntity<>(service.createLine(dto), HttpStatus.CREATED);
    }
}
