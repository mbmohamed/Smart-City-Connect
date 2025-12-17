package com.smartcity.citizen_engagement.controller;

import com.smartcity.citizen_engagement.model.Event;
import com.smartcity.citizen_engagement.repository.EventRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/citizen")
@Tag(name = "Citizen Engagement", description = "REST endpoints for Citizen Engagement (Hybrid GraphQL/REST)")
public class CitizenEngagementRestController {

    private final EventRepository eventRepository;

    public CitizenEngagementRestController(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    @Operation(summary = "Get all events", description = "Retrieves a list of all events (REST alternative to GraphQL query).")
    @GetMapping("/events")
    public ResponseEntity<List<Event>> getAllEvents() {
        return ResponseEntity.ok(eventRepository.findAll());
    }
}
