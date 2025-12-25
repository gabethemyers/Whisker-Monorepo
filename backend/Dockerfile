FROM eclipse-temurin:17-jdk-jammy AS build
WORKDIR /app

# Copy the Gradle wrapper and configuration files
COPY gradlew .
COPY gradle ./gradle
COPY build.gradle settings.gradle ./

# Ensure the wrapper has execution permissions
RUN chmod +x gradlew

# Copy the source code
COPY src ./src

# Build the application
RUN ./gradlew bootJar -x test --no-daemon

# Runtime
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Copy the jar from the build stage
# Note: Ensure the path matches where Gradle outputs your jar (usually build/libs)
COPY --from=build /app/build/libs/Project3Backend-*.jar app.jar

# Expose Spring Boot's default port
EXPOSE 8080

# Run with memory optimizations for low-resource environments
ENTRYPOINT ["java", "-Xmx400m", "-Xms256m", "-XX:+UseSerialGC", "-jar", "app.jar"]