# Whiskr

**A Scalable Full-Stack Social Platform for Cats & Their Humans**

🟢 **Live Frontend:** [rainbow-daifuku-f8f573.netlify.app](https://rainbow-daifuku-f8f573.netlify.app/)  
🟢 **Live Backend:** [whiskr-backend-gtdvk.ondigitalocean.app](https://whiskr-backend-gtdvk.ondigitalocean.app)



## 📖 Project Overview

Whiskr is a monolithic repository containing a production-ready social media platform engineered with a **Java Spring Boot** backend and a **React Native** (Expo) frontend. 

The core of this project is a robust, scalable backend architecture designed to handle complex relational data, secure authentication, and real-time communication. It uses **Supabase (PostgreSQL)** for persistence and **DigitalOcean** for containerized deployment.



## ⚙️ Backend Engineering Highlights

This project demonstrates enterprise-level backend practices, focusing on RESTful API design, stateless security, and cloud-native deployment.

### 🔧 Tech Stack
* **Language:** Java 17
* **Framework:** Spring Boot 3.5.7
* **Database:** PostgreSQL (via Supabase)
* **Security:** Spring Security, OAuth2 (GitHub/Google), JWT
* **Real-Time:** Spring WebSocket (STOMP)
* **Build Tool:** Gradle
* **Containerization:** Docker

### 🏗️ Architecture & Key Features

#### 1. Hybrid Authentication & Stateless Security
* Implemented a flexible auth system supporting **OAuth2 (Google/GitHub)** and standard credentials.
* Utilizes **JSON Web Tokens (JWT)** for session management, ensuring the API remains stateless and horizontally scalable.
* **Role-Based Access Control:** granular permission checks ensure users can only modify their own resources.

#### 2. Relational Database Design (PostgreSQL)
The database schema is highly normalized to ensure data integrity across the platform:
* **Complex Relationships:**
    * `AppUser` **1:N** `Cat` (Users can manage multiple cat profiles)
    * `Cat` **1:N** `Post` (Content is attributed to specific entities)
    * `Post` **1:N** `Interactions` (Likes, Comments)
* **Supabase Integration:** Leverages managed PostgreSQL for reliability and automated backups.

#### 3. Real-Time Chat Engine
* Built a persistent messaging system using **WebSockets** for instant delivery.
* Messages are persisted to PostgreSQL, allowing for complete chat history retrieval upon reconnection.

#### 4. Performance Optimization
* **Server-Side Image Compression:** Integrated `Thumbnailator` to resize and compress uploads before storage, reducing bandwidth usage and optimizing load times for mobile clients.
* **Memory Management:** JVM configured with specific heap size limits to run efficiently in resource-constrained cloud environments.


## 📂 Repository Structure

```text
whisker-monorepo/
├── backend/             # Spring Boot Application
│   ├── src/main/java    # REST Controllers, Services, JPA Repositories
│   ├── Dockerfile       # Multi-stage build for optimized production images
│   └── build.gradle     # Dependency management
├── frontend/            # React Native (Expo) Application
│   ├── app/             # File-based routing
│   └── utils/           # Typed API adapters & Auth hooks
└── supabase/            # Database schema and SQL scripts
```


## 🚀 Deployment Pipeline

### Backend (DigitalOcean)
The backend is containerized using **Docker**.

* **Build Stage:** Uses `eclipse-temurin:17-jdk` to compile the Gradle project and run tests.
* **Runtime Stage:** Uses a slim JRE image to reduce the container size.
* **Environment:** Configuration is injected via environment variables for security (DB credentials, API keys).

### Frontend (Netlify)
The React Native web build is deployed to **Netlify**. It communicates with the backend via REST and WebSocket Secure (WSS) protocols.



## 📬 Contact

**Gabriel Myers** | *Full-Stack Software Engineer* | [LinkedIn](https://www.linkedin.com/in/gabriel-myers-dev) | [GitHub](https://github.com/gabethemyers)
