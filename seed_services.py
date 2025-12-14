import requests
import json
import time

GATEWAY_URL = "http://localhost:8080"

def seed_mobility():
    print("Seeding Mobility Service...")
    lines = [
        {"name": "Ligne 1", "type": "METRO", "route": "Tunis Marine - Ben Arous"},
        {"name": "Ligne 2", "type": "METRO", "route": "Place Barcelone - Ariana"},
        {"name": "Ligne 3", "type": "METRO", "route": "Place Barcelone - Ibn Khaldoun"},
        {"name": "Ligne 4", "type": "METRO", "route": "Place Barcelone - Kheireddine"},
        {"name": "Ligne 5", "type": "METRO", "route": "Place Barcelone - Intilaka"},
        {"name": "Ligne 6", "type": "METRO", "route": "Tunis Marine - El Mourouj"},
        {"name": "TGM", "type": "TRAIN", "route": "Tunis Marine - La Marsa"},
        {"name": "Bus 20", "type": "BUS", "route": "Tunis - La Marsa"},
        {"name": "Bus 28", "type": "BUS", "route": "Tunis - Carthage"},
        {"name": "Bus 32", "type": "BUS", "route": "Tunis - Kram"},
        {"name": "Bus 47", "type": "BUS", "route": "Ariana - Raoued"},
        {"name": "Bus 63", "type": "BUS", "route": "Tunis - Sidi Hassine"},
        {"name": "Bus 19", "type": "BUS", "route": "Tunis - Bardo"},
        {"name": "Bus 54", "type": "BUS", "route": "Menzah - Centre Ville"},
        {"name": "Bus 78", "type": "BUS", "route": "Tunis - Manouba"},
        {"name": "Bus 104", "type": "BUS", "route": "Ariana - Soukra"},
        {"name": "Bus 23", "type": "BUS", "route": "Tunis - La Goulette"},
        {"name": "Bus 514", "type": "BUS", "route": "Tunis - Ezzahra"},
        {"name": "Bus 26", "type": "BUS", "route": "Tunis - Hammam Lif"},
        {"name": "Bus 38", "type": "BUS", "route": "Tunis - Mornag"},
        {"name": "Bus 44", "type": "BUS", "route": "Tunis - Tebourba"},
        {"name": "Bus 116", "type": "BUS", "route": "Tunis - Mhamdia"},
        {"name": "Bus 88", "type": "BUS", "route": "Tunis - Cite El Khadra"},
        {"name": "Bus 99", "type": "BUS", "route": "Tunis - Cite Olympique"},
        {"name": "Bus 12", "type": "BUS", "route": "Tunis - Bab Saadoun"}
    ]
    
    for line in lines:
        try:
            requests.post(f"{GATEWAY_URL}/api/v1/transport/lines", json=line)
            print(f"  Added {line['name']}")
        except Exception as e:
            print(f"  Failed to add {line['name']}: {e}")

def seed_emergency():
    print("\nSeeding Emergency Service...")
    alerts = [
        {"type": "ACCIDENT", "location": "Lac 1, Tunis", "severity": "HIGH", "description": "Car collision near Berges du Lac", "reportedBy": "Ahmed Ben Ali", "coordinates": {"latitude": 36.83, "longitude": 10.23}},
        {"type": "FIRE", "location": "Ennasr 2", "severity": "CRITICAL", "description": "Apartment fire on 3rd floor", "reportedBy": "Sarra Tounsi", "coordinates": {"latitude": 36.85, "longitude": 10.15}},
        {"type": "MEDICAL", "location": "Sidi Bou Said", "severity": "MEDIUM", "description": "Tourist fainted near Café des Délices", "reportedBy": "Police", "coordinates": {"latitude": 36.87, "longitude": 10.34}},
        {"type": "FLOOD", "location": "Ariana", "severity": "HIGH", "description": "Heavy rain causing flooding in main street", "reportedBy": "Municipality", "coordinates": {"latitude": 36.86, "longitude": 10.19}},
        {"type": "ACCIDENT", "location": "Autoroute A1", "severity": "CRITICAL", "description": "Multi-vehicle pileup", "reportedBy": "Civil Protection", "coordinates": {"latitude": 36.75, "longitude": 10.25}},
        {"type": "MEDICAL", "location": "Marsa Plage", "severity": "LOW", "description": "Minor injury at beach", "reportedBy": "Lifeguard", "coordinates": {"latitude": 36.88, "longitude": 10.32}},
        {"type": "FIRE", "location": "Belvedere Park", "severity": "MEDIUM", "description": "Small bush fire", "reportedBy": "Park Ranger", "coordinates": {"latitude": 36.82, "longitude": 10.17}},
        {"type": "ACCIDENT", "location": "Place Pasteur", "severity": "MEDIUM", "description": "Motorcycle accident", "reportedBy": "Witness", "coordinates": {"latitude": 36.81, "longitude": 10.16}},
        {"type": "MEDICAL", "location": "Cite Olympique", "severity": "HIGH", "description": "Heart attack at stadium", "reportedBy": "Medic", "coordinates": {"latitude": 36.84, "longitude": 10.18}},
        {"type": "FLOOD", "location": "Bardo", "severity": "MEDIUM", "description": "Blocked drains causing water accumulation", "reportedBy": "Resident", "coordinates": {"latitude": 36.80, "longitude": 10.13}},
        {"type": "ACCIDENT", "location": "Centre Urbain Nord", "severity": "LOW", "description": "Fender bender", "reportedBy": "Driver", "coordinates": {"latitude": 36.84, "longitude": 10.20}},
        {"type": "FIRE", "location": "Medina", "severity": "HIGH", "description": "Smoke reported in souk", "reportedBy": "Shop owner", "coordinates": {"latitude": 36.79, "longitude": 10.17}},
        {"type": "MEDICAL", "location": "Carthage Hannibal", "severity": "MEDIUM", "description": "Heat stroke", "reportedBy": "Tourist", "coordinates": {"latitude": 36.85, "longitude": 10.32}},
        {"type": "ACCIDENT", "location": "La Goulette", "severity": "MEDIUM", "description": "Car hit pedestrian", "reportedBy": "Police", "coordinates": {"latitude": 36.81, "longitude": 10.30}},
        {"type": "FLOOD", "location": "Mhamdia", "severity": "HIGH", "description": "River overflowing", "reportedBy": "Civil Protection", "coordinates": {"latitude": 36.68, "longitude": 10.15}},
        {"type": "FIRE", "location": "Jebel Ressas", "severity": "CRITICAL", "description": "Forest fire spreading", "reportedBy": "Forestry", "coordinates": {"latitude": 36.60, "longitude": 10.35}},
        {"type": "MEDICAL", "location": "Manar 1", "severity": "LOW", "description": "Allergic reaction", "reportedBy": "Parent", "coordinates": {"latitude": 36.83, "longitude": 10.14}},
        {"type": "ACCIDENT", "location": "Route X", "severity": "HIGH", "description": "Truck overturned", "reportedBy": "Police", "coordinates": {"latitude": 36.82, "longitude": 10.12}},
        {"type": "FIRE", "location": "Zone Industrielle Charguia", "severity": "HIGH", "description": "Factory fire", "reportedBy": "Security", "coordinates": {"latitude": 36.84, "longitude": 10.21}},
        {"type": "MEDICAL", "location": "Gammarth", "severity": "MEDIUM", "description": "Drowning incident", "reportedBy": "Hotel Staff", "coordinates": {"latitude": 36.91, "longitude": 10.28}},
        {"type": "ACCIDENT", "location": "Bab Alioua", "severity": "MEDIUM", "description": "Bus collision", "reportedBy": "Driver", "coordinates": {"latitude": 36.78, "longitude": 10.18}},
        {"type": "FLOOD", "location": "Ezzahra", "severity": "MEDIUM", "description": "Street flooding", "reportedBy": "Resident", "coordinates": {"latitude": 36.74, "longitude": 10.30}},
        {"type": "FIRE", "location": "Radès", "severity": "LOW", "description": "Trash bin fire", "reportedBy": "Passerby", "coordinates": {"latitude": 36.76, "longitude": 10.27}},
        {"type": "MEDICAL", "location": "Menzah 6", "severity": "HIGH", "description": "Stroke suspected", "reportedBy": "Family", "coordinates": {"latitude": 36.84, "longitude": 10.16}},
        {"type": "ACCIDENT", "location": "Aouina", "severity": "LOW", "description": "Minor scrape", "reportedBy": "Driver", "coordinates": {"latitude": 36.85, "longitude": 10.26}}
    ]

    for alert in alerts:
        try:
            requests.post(f"{GATEWAY_URL}/api/emergency/alerts", json=alert)
            print(f"  Added Alert: {alert['type']} at {alert['location']}")
        except Exception as e:
            print(f"  Failed to add alert: {e}")

def seed_citizen():
    print("\nSeeding Citizen Engagement Service...")
    query = """
    mutation ReportIssue($title: String!, $description: String!, $reportedBy: String!) {
        reportIssue(title: $title, description: $description, reportedBy: $reportedBy) {
            id
        }
    }
    """
    
    issues = [
        {"title": "Pothole in Menzah 6", "description": "Large pothole causing traffic", "reportedBy": "Karim"},
        {"title": "Trash in Sidi Bou Said", "description": "Overflowing bins near cafe", "reportedBy": "Leila"},
        {"title": "Broken Streetlight in Ariana", "description": "Dark street dangerous at night", "reportedBy": "Mohamed"},
        {"title": "Water Leak in Bardo", "description": "Pipe burst on main road", "reportedBy": "Amine"},
        {"title": "Graffiti on Historic Wall", "description": "Medina wall defaced", "reportedBy": "Heritage Assoc"},
        {"title": "Noise Complaint", "description": "Loud music in residential area", "reportedBy": "Sonia"},
        {"title": "Illegal Parking", "description": "Cars blocking sidewalk in Lac 2", "reportedBy": "Pedestrian"},
        {"title": "Stray Dogs", "description": "Pack of dogs in Carthage", "reportedBy": "Resident"},
        {"title": "Broken Bench", "description": "Park bench damaged in Marsa", "reportedBy": "Walker"},
        {"title": "Traffic Light Malfunction", "description": "Red light stuck at Place Pasteur", "reportedBy": "Driver"},
        {"title": "Fallen Tree", "description": "Blocking road in Belvedere", "reportedBy": "Park Guard"},
        {"title": "Sewage Smell", "description": "Strong odor in La Goulette", "reportedBy": "Tourist"},
        {"title": "Sidewalk Repair", "description": "Cracked pavement in Ennasr", "reportedBy": "Elderly"},
        {"title": "Overgrown Grass", "description": "Blocking view at intersection", "reportedBy": "Driver"},
        {"title": "Missing Sign", "description": "Stop sign gone in Manar", "reportedBy": "Resident"},
        {"title": "Construction Debris", "description": "Left on sidewalk in Kram", "reportedBy": "Neighbor"},
        {"title": "Bus Stop Damaged", "description": "Glass broken in Centre Ville", "reportedBy": "Commuter"},
        {"title": "Public Wifi Down", "description": "No signal in Habib Bourguiba Ave", "reportedBy": "Student"},
        {"title": "Fountain Not Working", "description": "Dry fountain in municipal square", "reportedBy": "Citizen"},
        {"title": "Playground Unsafe", "description": "Broken swing in neighborhood park", "reportedBy": "Parent"},
        {"title": "Dead Animal", "description": "On highway shoulder", "reportedBy": "Driver"},
        {"title": "Illegal Dumping", "description": "Construction waste in open lot", "reportedBy": "Neighbor"},
        {"title": "Street Flooding", "description": "Drains clogged in Raoued", "reportedBy": "Resident"},
        {"title": "Vandalism", "description": "Bus shelter smashed", "reportedBy": "Witness"},
        {"title": "Air Pollution", "description": "Black smoke from factory", "reportedBy": "Activist"}
    ]

    for issue in issues:
        try:
            requests.post(f"{GATEWAY_URL}/graphql", json={"query": query, "variables": issue})
            print(f"  Added Issue: {issue['title']}")
        except Exception as e:
            print(f"  Failed to add issue: {e}")

def seed_air_quality():
    print("\nSeeding Air Quality Service (via Admin REST API)...")
    # Data for 25+ zones/sensors
    data = [
        {"zoneId": "ZONE_TUNIS", "aqi": 45, "pm25": 12.5, "pm10": 20.0, "no2": 15.0, "status": "GOOD"},
        {"zoneId": "ZONE_RADES", "aqi": 110, "pm25": 40.0, "pm10": 55.0, "no2": 35.0, "status": "UNHEALTHY"},
        {"zoneId": "ZONE_CARTHAGE", "aqi": 30, "pm25": 8.0, "pm10": 15.0, "no2": 10.0, "status": "GOOD"},
        {"zoneId": "ZONE_ENNASR", "aqi": 55, "pm25": 18.0, "pm10": 25.0, "no2": 20.0, "status": "MODERATE"},
        {"zoneId": "ZONE_BAB_SAADOUN", "aqi": 85, "pm25": 28.0, "pm10": 40.0, "no2": 30.0, "status": "MODERATE"},
        {"zoneId": "ZONE_MARSA", "aqi": 25, "pm25": 5.0, "pm10": 10.0, "no2": 5.0, "status": "GOOD"},
        {"zoneId": "ZONE_LAC_1", "aqi": 50, "pm25": 15.0, "pm10": 22.0, "no2": 18.0, "status": "GOOD"},
        {"zoneId": "ZONE_LAC_2", "aqi": 48, "pm25": 14.0, "pm10": 21.0, "no2": 17.0, "status": "GOOD"},
        {"zoneId": "ZONE_BARDO", "aqi": 75, "pm25": 25.0, "pm10": 35.0, "no2": 28.0, "status": "MODERATE"},
        {"zoneId": "ZONE_ARIANA", "aqi": 60, "pm25": 20.0, "pm10": 30.0, "no2": 22.0, "status": "MODERATE"},
        {"zoneId": "ZONE_MANOUBA", "aqi": 65, "pm25": 22.0, "pm10": 32.0, "no2": 25.0, "status": "MODERATE"},
        {"zoneId": "ZONE_EZZAHRA", "aqi": 55, "pm25": 19.0, "pm10": 28.0, "no2": 21.0, "status": "MODERATE"},
        {"zoneId": "ZONE_HAMMAM_LIF", "aqi": 58, "pm25": 20.0, "pm10": 29.0, "no2": 23.0, "status": "MODERATE"},
        {"zoneId": "ZONE_MOURAL", "aqi": 90, "pm25": 35.0, "pm10": 45.0, "no2": 32.0, "status": "UNHEALTHY"},
        {"zoneId": "ZONE_SIDI_BOU", "aqi": 20, "pm25": 4.0, "pm10": 8.0, "no2": 4.0, "status": "GOOD"},
        {"zoneId": "ZONE_GOULETTE", "aqi": 70, "pm25": 24.0, "pm10": 34.0, "no2": 26.0, "status": "MODERATE"},
        {"zoneId": "ZONE_KRAM", "aqi": 40, "pm25": 10.0, "pm10": 18.0, "no2": 12.0, "status": "GOOD"},
        {"zoneId": "ZONE_SOUKRA", "aqi": 52, "pm25": 16.0, "pm10": 24.0, "no2": 19.0, "status": "MODERATE"},
        {"zoneId": "ZONE_CHARGUIA", "aqi": 120, "pm25": 45.0, "pm10": 60.0, "no2": 40.0, "status": "UNHEALTHY_SENSITIVE"},
        {"zoneId": "ZONE_CENTRE_VILLE", "aqi": 95, "pm25": 32.0, "pm10": 48.0, "no2": 38.0, "status": "MODERATE"},
        {"zoneId": "ZONE_MENZAH_1", "aqi": 50, "pm25": 15.0, "pm10": 22.0, "no2": 18.0, "status": "GOOD"},
        {"zoneId": "ZONE_MENZAH_6", "aqi": 48, "pm25": 14.0, "pm10": 21.0, "no2": 17.0, "status": "GOOD"},
        {"zoneId": "ZONE_MANAR_1", "aqi": 55, "pm25": 18.0, "pm10": 25.0, "no2": 20.0, "status": "MODERATE"},
        {"zoneId": "ZONE_MANAR_2", "aqi": 53, "pm25": 17.0, "pm10": 24.0, "no2": 19.0, "status": "MODERATE"},
        {"zoneId": "ZONE_AGBA", "aqi": 62, "pm25": 21.0, "pm10": 31.0, "no2": 24.0, "status": "MODERATE"},
        {"zoneId": "ZONE_001", "aqi": 35, "pm25": 9.0, "pm10": 16.0, "no2": 11.0, "status": "GOOD"}
    ]
    
    try:
        requests.post(f"{GATEWAY_URL}/api/admin/air-quality/seed", json=data)
        print(f"  Seeded {len(data)} Air Quality records.")
    except Exception as e:
        print(f"  Failed to seed Air Quality: {e}")

if __name__ == "__main__":
    seed_mobility()
    seed_emergency()
    seed_citizen()
    seed_air_quality()
    print("\nSeeding Complete!")
