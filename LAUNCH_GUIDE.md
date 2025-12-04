# 🚀 Guide de Démarrage - Smart City Connect

Ce guide détaille les étapes pour lancer l'application complète (Base de données, 4 Microservices, Frontend).

## 📋 Prérequis

- **Java 21** ou supérieur (Testé avec Java 25)
- **Node.js** 18+ et **npm**
- **Docker** (pour la base de données MySQL)
- **Maven** (pour compiler si nécessaire)

---

## 🛠️ Étape 1 : Démarrer la Base de Données

Nous utilisons un conteneur Docker MySQL qui héberge les 3 bases de données (`smartcity_mobility`, `smartcity_airquality`, `smartcity_emergency`).

```bash
# Démarrer le conteneur existant
docker start smartcity-mysql

# VÉRIFICATION : S'assurer qu'il tourne sur le port 3307
docker ps | grep smartcity-mysql
```

> **Note** : Si le conteneur n'existe pas, créez-le avec :
> `docker run --name smartcity-mysql -e MYSQL_ROOT_PASSWORD=smartcity123 -p 3307:3306 -d mysql:8.0`

---

## ⚙️ Étape 2 : Démarrer les Services Backend

Il est recommandé d'ouvrir un terminal séparé pour chaque service pour voir les logs.

### 1. Mobility Service (REST) - Port 8080
```bash
cd mobility-service
# Option A : Lancer via Maven
./mvnw spring-boot:run

# Option B : Lancer le JAR (plus rapide si déjà compilé)
java -jar target/mobility-service-0.0.1-SNAPSHOT.jar
```

### 2. Air Quality Service (SOAP) - Port 8081
```bash
cd air-quality-service
java -jar target/air-quality-service-0.0.1-SNAPSHOT.jar
```

### 3. Emergency Service (gRPC) - Port 9093
```bash
cd emergency-service
java -jar target/emergency-service-0.0.1-SNAPSHOT.jar
```

### 4. Emergency Gateway (REST Proxy) - Port 8083
Ce service fait le pont entre le Frontend (REST) et le service Emergency (gRPC).
```bash
cd emergency-gateway
java -jar target/emergency-gateway-0.0.1-SNAPSHOT.jar
```

---

## 💻 Étape 3 : Démarrer le Frontend

### Smart City Frontend - Port 5173
```bash
cd smart-city-frontend
npm run dev
```

---

## ✅ Étape 4 : Vérification et Accès

Ouvrez votre navigateur à l'adresse : **http://localhost:5173**

### URLs des APIs pour test direct :
- **Mobility (REST)** : `http://localhost:8080/api/v1/transport/lines`
- **Air Quality (WSDL)** : `http://localhost:8081/ws/air-quality.wsdl`
- **Emergency Gateway** : `http://localhost:8083/api/emergency/resources`
- **Emergency Actuator** : `http://localhost:8082/actuator/health`

---

## 🛑 Arrêter l'application

Pour tout arrêter proprement :
1. `Ctrl+C` dans chaque terminal de service.
2. Arrêter la base de données : `docker stop smartcity-mysql`

---

## ⚡ Script de Démarrage Rapide (Optionnel)

Vous pouvez créer un fichier `start_all.sh` à la racine du projet :

```bash
#!/bin/bash
echo "🚀 Démarrage de Smart City Connect..."

echo "1. Démarrage de MySQL..."
docker start smartcity-mysql
sleep 5

echo "2. Démarrage des Services Backend..."
nohup java -jar mobility-service/target/mobility-service-0.0.1-SNAPSHOT.jar > logs/mobility.log 2>&1 &
nohup java -jar air-quality-service/target/air-quality-service-0.0.1-SNAPSHOT.jar > logs/airquality.log 2>&1 &
nohup java -jar emergency-service/target/emergency-service-0.0.1-SNAPSHOT.jar > logs/emergency.log 2>&1 &
sleep 10 # Attendre que le service gRPC soit prêt
nohup java -jar emergency-gateway/target/emergency-gateway-0.0.1-SNAPSHOT.jar > logs/gateway.log 2>&1 &

echo "3. Démarrage du Frontend..."
cd smart-city-frontend && npm run dev
```
