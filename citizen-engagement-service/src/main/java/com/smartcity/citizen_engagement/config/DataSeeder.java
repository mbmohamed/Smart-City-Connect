package com.smartcity.citizen_engagement.config;

import com.smartcity.citizen_engagement.model.Event;
import com.smartcity.citizen_engagement.model.Issue;
import com.smartcity.citizen_engagement.model.IssueStatus;
import com.smartcity.citizen_engagement.repository.EventRepository;
import com.smartcity.citizen_engagement.repository.IssueRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner initData(EventRepository eventRepository, IssueRepository issueRepository) {
        return args -> {
            if (eventRepository.count() == 0) {
                eventRepository.save(new Event(
                        "Festival International de Carthage",
                        "58ème édition du festival avec des artistes internationaux et locaux.",
                        LocalDateTime.now().plusDays(10),
                        "Amphithéâtre de Carthage",
                        "Culture"));
                eventRepository.save(new Event(
                        "Marathon COMAR de Tunis-Carthage",
                        "Le rendez-vous sportif incontournable de la capitale.",
                        LocalDateTime.now().plusDays(25),
                        "Avenue Habib Bourguiba",
                        "Sport"));
                eventRepository.save(new Event(
                        "Journées Cinématographiques de Carthage (JCC)",
                        "Festival de cinéma célébrant les films d'Afrique et du monde arabe.",
                        LocalDateTime.now().plusMonths(2),
                        "Cité de la Culture",
                        "Cinéma"));
                eventRepository.save(new Event(
                        "Tunis Medina Light Festival",
                        "Illumination artistique des monuments de la Médina.",
                        LocalDateTime.now().plusDays(5),
                        "Médina de Tunis",
                        "Art"));
            }

            if (issueRepository.count() == 0) {
                Issue issue1 = new Issue(
                        "Eclairage public en panne",
                        "Plusieurs lampadaires ne fonctionnent pas sur l'Avenue Habib Bourguiba.",
                        "Ahmed Ben Ali",
                        LocalDateTime.now().minusDays(2));
                issue1.setStatus(IssueStatus.IN_PROGRESS);
                issueRepository.save(issue1);

                Issue issue2 = new Issue(
                        "Nid de poule dangereux",
                        "Grand trou sur la chaussée Rue de Marseille, risque d'accident.",
                        "Sarra Tounsi",
                        LocalDateTime.now().minusDays(1));
                issueRepository.save(issue2);

                Issue issue3 = new Issue(
                        "Déchets non ramassés",
                        "Accumulation de déchets près du Parc du Belvédère.",
                        "Karim Jlassi",
                        LocalDateTime.now().minusHours(5));
                issueRepository.save(issue3);
            }
        };
    }
}
