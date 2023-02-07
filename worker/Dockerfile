# Build stage
FROM  maven:3.8.4-jdk-11-slim AS builder

COPY src /home/worker/src

COPY pom.xml /home/worker

# - mvn dependency:resolve, from within the folder containing pom.xml;
# - then, mvn package, from within the folder containing the src folder.

RUN mvn -X -f /home/worker/pom.xml clean package
# RUN mvn dependency:resolve
# 
# RUN mvn package


# Package stage
FROM openjdk:11-jre-slim

COPY --from=builder /home/worker/target/worker-jar-with-dependencies.jar .

EXPOSE 80

ENTRYPOINT ["java","-jar","worker-jar-with-dependencies.jar"]


# FROM  maven:3.8.7-eclipse-temurin-8-alpine as builder

# WORKDIR /app

# COPY . /app

# RUN mvn dependency:resolve

# RUN mvn package

# FROM openjdk:8-jre-alpine


# COPY --from=builder /target/worker-jar-with-dependencies.jar .


# CMD ["java", "-jar", "worker-jar-with-dependencies.jar"]