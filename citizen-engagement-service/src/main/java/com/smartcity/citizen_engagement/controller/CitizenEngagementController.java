package com.smartcity.citizen_engagement.controller;

import com.smartcity.citizen_engagement.model.Event;
import com.smartcity.citizen_engagement.model.Issue;
import com.smartcity.citizen_engagement.model.IssueStatus;
import com.smartcity.citizen_engagement.repository.EventRepository;
import com.smartcity.citizen_engagement.repository.IssueRepository;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;
import java.util.List;

@Controller
public class CitizenEngagementController {

    private final EventRepository eventRepository;
    private final IssueRepository issueRepository;

    public CitizenEngagementController(EventRepository eventRepository, IssueRepository issueRepository) {
        this.eventRepository = eventRepository;
        this.issueRepository = issueRepository;
    }

    @QueryMapping
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    @QueryMapping
    public Event getEventById(@Argument Long id) {
        return eventRepository.findById(id).orElse(null);
    }

    @QueryMapping
    public List<Issue> getAllIssues() {
        return issueRepository.findAll();
    }

    @QueryMapping
    public Issue getIssueById(@Argument Long id) {
        return issueRepository.findById(id).orElse(null);
    }

    @MutationMapping
    public Issue reportIssue(@Argument String title, @Argument String description, @Argument String reportedBy) {
        Issue issue = new Issue(title, description, reportedBy, LocalDateTime.now());
        return issueRepository.save(issue);
    }

    @MutationMapping
    public Issue updateIssueStatus(@Argument Long id, @Argument IssueStatus status) {
        Issue issue = issueRepository.findById(id).orElseThrow(() -> new RuntimeException("Issue not found"));
        issue.setStatus(status);
        return issueRepository.save(issue);
    }
}
