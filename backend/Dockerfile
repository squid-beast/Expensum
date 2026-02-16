# =============================================
# Budget Buddy Backend — Multi-stage Docker Build
# =============================================

# --- Build stage ---
FROM eclipse-temurin:21-jdk AS build
WORKDIR /app

COPY mvnw mvnw
COPY .mvn .mvn
COPY pom.xml .

# Download dependencies (cached layer)
RUN chmod +x mvnw && ./mvnw dependency:go-offline -B

COPY src src
RUN ./mvnw clean package -DskipTests -B

# --- Runtime stage ---
FROM eclipse-temurin:21-jre
WORKDIR /app

# Non-root user for security
RUN groupadd -r appuser && useradd -r -g appuser appuser

COPY --from=build /app/target/*.jar app.jar
RUN chown appuser:appuser app.jar

USER appuser

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]
