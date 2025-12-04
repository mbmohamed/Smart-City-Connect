package com.smartcity.citizen_engagement.repository;

import com.smartcity.citizen_engagement.model.Issue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IssueRepository extends JpaRepository<Issue, Long> {
}
