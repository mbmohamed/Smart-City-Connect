# 🚀 Guide de Démarrage - Smart City Connect

Ce guide détaille les étapes pour lancer l'application complète (Base de données, Microservices, Frontend) en utilisant **Docker Compose**.

## 📋 Prérequis

- **Docker** et **Docker Compose** installés.
- **Java 21** et **Maven** installés (nécessaires pour compiler les microservices avant le build Docker).
- **Node.js** (optionnel, le frontend est construit dans Docker).

---

## ⚡ Démarrage Rapide

### 1. Compiler les Microservices
Les conteneurs Docker utilisent les fichiers JAR compilés. Vous devez donc d'abord construire les projets Java :

```bash
# À la racine du projet
for dir in mobility-service air-quality-service emergency-service emergency-gateway citizen-engagement-service api-gateway; do
  echo "Building $dir..."
  (cd $dir && mvn clean package -DskipTests)
done
```

> **Note** : Si vous n'avez pas Maven installé globalement, vous pouvez utiliser le wrapper `./mvnw` présent dans certains dossiers, ou installer Maven via votre gestionnaire de paquets (`apt install maven`, `brew install maven`, etc.).

### 2. Lancer l'application
Une fois la compilation terminée, lancez la stack Docker :

```bash
docker-compose up -d --build
```

Cette commande va :
- Construire les images Docker (en copiant les JARs générés).
- Démarrer la base de données MariaDB.
- Lancer tous les services.

### 3. Initialiser les Données (Seeding)
Une fois que tous les services sont démarrés (vérifiez avec `docker ps`), peuplez la base de données :

```bash
cat docker/seed_tunisia_data.sql | docker exec -i mysql-container mariadb -u root -proot
```

---

## 🌐 Accès à l'Application

Une fois démarré, vous pouvez accéder aux différents composants :

| Composant | URL | Description |
|-----------|-----|-------------|
| **Frontend** | **http://localhost:3000** | Interface utilisateur principale (Tableau de bord) |
| **API Gateway** | http://localhost:8080 | Point d'entrée unique pour toutes les APIs |
| **AI Orchestrator** | http://localhost:8000/docs | Documentation Swagger de l'IA |

### Endpoints API Utiles (via Gateway)

- **Mobility** : `http://localhost:8080/api/v1/transport/lines`
- **Air Quality** : `http://localhost:8080/ws` (SOAP)
- **Emergency** : `http://localhost:8080/api/emergency/alerts`
- **Citizen** : `http://localhost:8080/graphql`
- **Health Check** : `http://localhost:8080/actuator/health`

---

## 🛠️ Commandes Utiles

### Vérifier l'état des services
```bash
docker ps
```
Tous les services doivent être marqués comme `(healthy)`.

### Voir les logs d'un service
Pour déboguer un service spécifique (ex: `mobility-service`, `smart-city-frontend`) :
```bash
docker logs -f <nom_du_conteneur>
# Exemple :
docker logs -f mobility-service
```

### Arrêter l'application
Pour arrêter et supprimer les conteneurs :
```bash
docker-compose down
```

### Nettoyage complet (en cas de problème)
Si vous rencontrez des erreurs persistantes (ex: problèmes de base de données), vous pouvez tout nettoyer et recommencer :
```bash
# Attention : Supprime toutes les données de la DB !
docker-compose down -v
docker system prune -f
# N'oubliez pas de recompiler si vous avez supprimé les dossiers target/
docker-compose up -d --build
```

---

## ⚡ Script de Démarrage Automatique

Un script `start_all.sh` est fourni à la racine pour automatiser tout le processus (compilation, docker, seeding).

```bash
./start_all.sh
```

Ce script va :
1. Vérifier les prérequis.
2. Compiler tous les microservices avec Maven.
3. Lancer `docker-compose up`.
4. Attendre que la base de données soit prête.
5. Injecter les données de test.

