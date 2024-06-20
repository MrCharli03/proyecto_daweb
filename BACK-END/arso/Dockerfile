# Construccion multietapa
# etapa transitoria que construye la imagen definitiva con las dependencias

FROM maven:3.8.5-jdk-8 AS builder

WORKDIR /app/
COPY pom.xml .
RUN mvn -e -B dependency:resolve
COPY src ./src
RUN mvn package


#Etapa de ejecucion (construccion artefacto sw WAR)
FROM tomcat:9-jdk8
WORKDIR /usr/local/tomcat/webapps/
COPY --from=builder /app/target/alquileres-CruzadoEsteban-0.0.1-SNAPSHOT.war ROOT.war

EXPOSE 8081

# Comando para ejecutar Tomcat
CMD ["catalina.sh", "run"]
