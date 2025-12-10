-- Clean up existing data
DELETE FROM smartcity_mobility.transport_line;
DELETE FROM smartcity_emergency.alerts;
DELETE FROM smartcity_citizen.events;
DELETE FROM smartcity_citizen.issues;
DELETE FROM smartcity_airquality.air_quality_data;

-- ==========================================
-- MOBILITY SERVICE (Tunis Transport)
-- ==========================================
INSERT INTO smartcity_mobility.transport_line (name, type, status) VALUES 
('Metro Ligne 1', 'METRO', 'ACTIVE'), -- Tunis Marine - Ben Arous
('Metro Ligne 2', 'METRO', 'ACTIVE'), -- Place de la République - Ariana
('Metro Ligne 3', 'METRO', 'DELAYED'), -- Tunis Marine - Ibn Khaldoun
('Metro Ligne 4', 'METRO', 'ACTIVE'), -- Place de la République - Den Den
('Metro Ligne 5', 'METRO', 'ACTIVE'), -- Place de la République - Intilaka
('Metro Ligne 6', 'METRO', 'ACTIVE'), -- Tunis Marine - El Mourouj
('TGM', 'TRAIN', 'ACTIVE'),           -- Tunis - Goulette - Marsa
('RFR Ligne D', 'TRAIN', 'DELAYED'),  -- Tunis - Gobaa
('RFR Ligne E', 'TRAIN', 'ACTIVE'),   -- Tunis - Bougatfa
('Bus 20', 'BUS', 'ACTIVE'),          -- Tunis - Riadh El Andalus
('Bus 28', 'BUS', 'DELAYED'),         -- Tunis - Kram
('Bus 32', 'BUS', 'ACTIVE'),          -- Tunis - Ben Arous
('Bus 514', 'BUS', 'ACTIVE'),         -- Marsa - Ariana
('Bus 27', 'BUS', 'CANCELLED');       -- Tunis - Raoued

-- ==========================================
-- EMERGENCY SERVICE (Alerts in Tunis)
-- ==========================================
INSERT INTO smartcity_emergency.alerts (id, type, location, severity, description, status, timestamp) VALUES 
('ALERT-TN-001', 'ACCIDENT', 'Autoroute A1, Sortie Hammamet', 'HIGH', 'Accident grave impliquant 3 véhicules', 'DISPATCHED', '2025-12-08 10:00:00'),
('ALERT-TN-002', 'FIRE', 'Marché Central, Tunis', 'CRITICAL', 'Incendie signalé dans la zone des épices', 'PENDING', '2025-12-08 10:15:00'),
('ALERT-TN-003', 'MEDICAL_EMERGENCY', 'Stade Radès', 'MEDIUM', 'Malaise spectateur tribune nord', 'RESOLVED', '2025-12-08 10:30:00'),
('ALERT-TN-004', 'ACCIDENT', 'Place Pasteur', 'LOW', 'Embouteillage monstre suite à travaux', 'ACKNOWLEDGED', '2025-12-08 10:45:00'),
('ALERT-TN-005', 'NATURAL_DISASTER', 'Cité El Khadra', 'HIGH', 'Inondation sous le pont après fortes pluies', 'PENDING', '2025-12-08 11:00:00'),
('ALERT-TN-006', 'ACCIDENT', 'Route X, Bardo', 'MEDIUM', 'Collision légère, circulation ralentie', 'DISPATCHED', '2025-12-08 11:15:00');

-- ==========================================
-- CITIZEN ENGAGEMENT (Events & Issues)
-- ==========================================
-- Events
INSERT INTO smartcity_citizen.events (title, description, date, location, category) VALUES 
('Festival International de Carthage', 'Concert de clôture avec une star internationale', '2025-08-15 22:00:00', 'Amphithéâtre de Carthage', 'CULTURE'),
('JCC 2025', 'Journées Cinématographiques de Carthage - Ouverture', '2025-10-28 18:00:00', 'Théâtre Municipal de Tunis', 'CULTURE'),
('Marathon COMAR', 'Marathon annuel de Tunis-Carthage', '2025-12-05 08:00:00', 'Avenue Habib Bourguiba', 'SPORT'),
('Dream City', 'Festival d''art dans la Médina', '2025-09-20 10:00:00', 'Médina de Tunis', 'CULTURE'),
('Tunis Street Food', 'Découverte culinaire tunisienne', '2025-07-10 12:00:00', 'Lac 1', 'COMMUNITY'),
('Jazz à Carthage', 'Festival de Jazz annuel', '2025-04-05 20:00:00', 'Gammarth', 'MUSIC');

-- Issues
INSERT INTO smartcity_citizen.issues (title, description, date_reported, status, reported_by) VALUES 
('Nid de poule géant', 'Grand trou sur la route principale face à la poste', '2025-12-01 09:30:00', 'OPEN', 'Ahmed Tounsi'),
('Éclairage défaillant', 'Lampadaires éteints rue de la Liberté depuis 3 jours', '2025-12-02 20:15:00', 'IN_PROGRESS', 'Sarra Ben Ali'),
('Déchets non ramassés', 'Accumulation de poubelles Cité Ennasr 2', '2025-12-03 08:00:00', 'OPEN', 'Karim K.'),
('Fuite d''eau', 'Fuite d''eau potable importante Avenue Mohamed V', '2025-12-04 14:20:00', 'RESOLVED', 'Mouna R.'),
('Trottoir cassé', 'Danger pour les piétons devant l''école primaire', '2025-12-05 16:45:00', 'OPEN', 'Parents d''élèves');

-- ==========================================
-- AIR QUALITY (Zones & Readings)
-- ==========================================
INSERT INTO smartcity_airquality.air_quality_data (zone_id, aqi, no2, pm10, pm25, status, timestamp) VALUES 
('ZONE_TUNIS', 120, 45.5, 55.2, 35.8, 'MODERATE', '2025-12-08 10:00:00'),
('ZONE_RADES', 160, 50.0, 75.5, 45.2, 'POOR', '2025-12-08 10:00:00'),
('ZONE_CARTHAGE', 45, 38.0, 15.0, 10.0, 'GOOD', '2025-12-08 10:00:00'),
('ZONE_ENNASR', 85, 41.0, 35.0, 20.0, 'MODERATE', '2025-12-08 10:00:00'),
('ZONE_BAB_SAADOUN', 140, 48.0, 65.0, 40.0, 'UNHEALTHY_SENSITIVE', '2025-12-08 10:00:00');
