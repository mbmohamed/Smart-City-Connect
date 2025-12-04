# 🌆 Guide de Démonstration - Smart City Platform

## 📋 Prérequis

Avant de commencer la démo, assurez-vous que :
- ✅ Le conteneur MySQL est démarré
- ✅ Les deux services sont en cours d'exécution

## 🚀 Démarrage Rapide

### Étape 1 : Démarrer MySQL (si ce n'est pas déjà fait)
```bash
docker start smartcity-mysql
```

### Étape 2 : Démarrer Mobility Service
```bash
cd /mnt/data2/projet-soc/mobility-service
JAVA_HOME=/usr/lib/jvm/jdk-25+36 java -jar target/mobility-service-0.0.1-SNAPSHOT.jar
```
**Port** : 8080

### Étape 3 : Démarrer Air Quality Service (dans un autre terminal)
```bash
cd /mnt/data2/projet-soc
JAVA_HOME=/usr/lib/jvm/jdk-25+36 java -jar air-quality-service/target/air-quality-service-0.0.1-SNAPSHOT.jar
```
**Port** : 8081

### Étape 4 : Ouvrir la Démo dans le Navigateur
```bash
# Option 1: Double-cliquer sur le fichier
Ouvrez /mnt/data2/projet-soc/demo.html dans votre navigateur

# Option 2: Via la ligne de commande
xdg-open /mnt/data2/projet-soc/demo.html
# ou
firefox /mnt/data2/projet-soc/demo.html
```

## 🎯 Comment Utiliser la Démo

### Service Mobilité (REST)
1. **Voir toutes les lignes** : Cliquez sur "📋 Obtenir toutes les lignes"
2. **Créer une nouvelle ligne** :
   - Entrez un nom (ex: "Tram A")
   - Sélectionnez un type (Bus/Métro/Train)
   - Choisissez un statut (À l'heure/Retardé/Annulé)
   - Cliquez sur "➕ Créer une nouvelle ligne"

### Service Qualité de l'Air (SOAP)
1. **Voir le WSDL** : Cliquez sur "📄 Voir le WSDL"
2. **Obtenir les données** :
   - Entrez une zone (ex: "downtown", "suburbs", "industrial")
   - Cliquez sur "🌫️ Obtenir Qualité de l'Air"

## 🔍 Test Manuel (Alternative)

### REST API (curl)
```bash
# GET - Obtenir toutes les lignes
curl http://localhost:8080/api/v1/transport/lines

# POST - Créer une ligne
curl -X POST http://localhost:8080/api/v1/transport/lines \
  -H "Content-Type: application/json" \
  -d '{"name":"Tram B", "type":"METRO", "status":"ON_TIME"}'
```

### SOAP API (curl)
```bash
# WSDL
curl http://localhost:8081/ws/air-quality.wsdl

# SOAP Request
curl -X POST http://localhost:8081/ws \
  -H "Content-Type: text/xml" \
  -d '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
       xmlns:air="http://smartcity.com/air-quality-service/schema">
       <soapenv:Body>
         <air:getAirQualityRequest>
           <air:zoneId>downtown</air:zoneId>
         </air:getAirQualityRequest>
       </soapenv:Body>
     </soapenv:Envelope>'
```

## 🗄️ Vérifier la Base de Données MySQL

```bash
# Se connecter à MySQL
docker exec -it smartcity-mysql mysql -uroot -psmartcity123

# Dans MySQL
USE smartcity_mobility;
SELECT * FROM transport_line;

USE smartcity_airquality;
SHOW TABLES;

EXIT;
```

## ❓ Dépannage

### Les services ne démarrent pas ?
1. Vérifiez que MySQL tourne : `docker ps | grep smartcity-mysql`
2. Vérifiez les ports : `netstat -tuln | grep -E '8080|8081|3307'`
3. Regardez les logs du service

### Erreur CORS dans le navigateur ?
C'est normal si vous ouvrez `demo.html` en tant que fichier local (`file://`).
Vous pouvez ignorer les avertissements CORS, les requêtes devraient quand même fonctionner.

### Port déjà utilisé ?
```bash
# Trouver le processus
lsof -i :8080
lsof -i :8081

# Tuer le processus si nécessaire
kill -9 <PID>
```

## 📊 Données de Test Disponibles

Le service Mobility contient déjà :
- Metro Ligne 1 (ON_TIME)
- Bus 42 (DELAYED)

Vous pouvez créer plus de données via la démo !

## 🎓 Points Techniques à Démontrer

1. **Architecture Microservices** : Deux services indépendants
2. **Protocoles Différents** : REST vs SOAP
3. **Persistance MySQL** : Données sauvegardées entre redémarrages
4. **Java 25** : Compilation avec JDK 25, bytecode Java 21
5. **Spring Boot 3.4** : Framework moderne
6. **Contract-First SOAP** : XSD défini avant le code
