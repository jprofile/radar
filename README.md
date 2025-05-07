# Radar de Tecnologías

Este proyecto es una visualización interactiva tipo **Tech Radar**, basada en el proyecto de [AOE Technology Radar](https://github.com/AOEpeople/aoe_technology_radar), adaptada y personalizada para uso interno.

## ¿Qué es un Radar de Tecnologías?

El radar representa visualmente el estado y madurez de distintas tecnologías, herramientas y prácticas dentro de una organización. Está dividido en:

- **Cuadrantes**: grandes categorías como Lenguajes, Herramientas, Plataformas, etc.
- **Anillos**: niveles de madurez
- **Blips**: cada tecnología individual representada en el radar.

## Requisitos

- Node.js 18+
- npm

## Instalación y despliegue local


```bash
cd .techradar
npm run build
npm run start
```

Esto compila y sirve la versión optimizada del radar.  Asegurarnos de estar en .techradar para lanzar el npm

## Despliegue en Azure Static Web Apps

Una vez generada la build, se puede desplegar el radar a Azure usando el CLI de Static Web Apps:

```bash
swa deploy   --app-name <nombre>   --resource-group <grupo>   --output-location build   --env production   --no-use-keychain
```

Asegúrate de haber ejecutado previamente `npm run build` para generar la carpeta `build/`.