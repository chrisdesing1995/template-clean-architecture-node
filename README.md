# template-clean-architecture-node

Base template enterprise reusable para proyectos Node.js modernos con NestJS + TypeScript, preparada para evolucionar hacia una arquitectura más completa sin arrastrar boilerplate de negocio.

## Objetivo

Esta template establece una base limpia para construir servicios backend siguiendo principios de Clean Architecture + DDD Lite.

Está pensada para crecer posteriormente con capacidades como Prisma, PostgreSQL, logging estructurado, Swagger, filtros globales, interceptores, CQRS, observabilidad y testing más avanzado.

## Arquitectura

La estructura separa responsabilidades por capas:

- `api`: punto de entrada HTTP y composición de módulos NestJS.
- `application`: casos de uso, orquestación y servicios de aplicación.
- `domain`: entidades, value objects, contratos y reglas de dominio.
- `infrastructure`: adaptadores externos e implementaciones técnicas.
- `shared`: utilidades transversales y componentes compartidos.

## Estructura de carpetas

```text
template-clean-architecture-node
├── src
│   ├── api
│   ├── application
│   ├── domain
│   ├── infrastructure
│   ├── shared
│   └── main.ts
├── prisma
├── test
├── docker
├── logs
├── README.md
├── .env
├── .env.development
├── .env.production
├── package.json
├── tsconfig.json
├── tsconfig.build.json
├── nest-cli.json
├── eslint.config.mjs
└── prettier.config.js
```

## Instalacion de dependencias

```bash
npm install
```

## Como ejecutar el proyecto

```bash
npm run start
```

## Como ejecutar en desarrollo

```bash
npm run start:dev
```

## Como compilar

```bash
npm run build
```

## Scripts disponibles

- `npm run start`
- `npm run start:dev`
- `npm run build`
- `npm run lint`
- `npm run format`
- `npm run test`
