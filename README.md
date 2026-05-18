# template-clean-architecture-node

Base template enterprise reusable para proyectos Node.js modernos con NestJS + TypeScript, preparada para evolucionar hacia una arquitectura más completa sin arrastrar boilerplate de negocio.

## Objetivo

Esta template establece una base limpia para construir servicios backend siguiendo principios de Clean Architecture + DDD Lite.

Actualmente incluye:

- Swagger enterprise centralizado.
- Response estándar global.
- Validation global.
- Exception filter global.
- TraceId por request.
- CRUD básico `Person` en memoria.
- Pino logging reusable.
- Logs diarios en archivo.
- Logging interceptor global.
- ExecutionService reusable.

Está pensada para crecer posteriormente con capacidades como Prisma, PostgreSQL, logging estructurado, CQRS, observabilidad y testing más avanzado.

## Arquitectura

La estructura separa responsabilidades por capas:

- `api`: punto de entrada HTTP y composición de módulos NestJS.
- `application`: casos de uso, orquestación y servicios de aplicación.
- `domain`: entidades, value objects, contratos y reglas de dominio.
- `infrastructure`: adaptadores externos e implementaciones técnicas.
- `shared`: utilidades transversales y componentes compartidos.

## Capacidades transversales

### Pino logging

La template usa `nestjs-pino` sobre `pino` con configuración reusable para:

- logs estructurados
- logs en consola
- pretty logs en desarrollo
- logs diarios en archivos dentro de `logs/`
- `traceId` y `requestId` en todo el ciclo del request

Los archivos diarios siguen este formato:

```text
logs/
├── log-20260517.txt
├── log-20260518.txt
└── log-20260519.txt
```

### Swagger

Swagger se configura de forma centralizada y queda disponible en:

```text
/swagger
```

Incluye documentación de:

- DTOs de request.
- DTOs de response.
- Respuestas 200, 400 y 500.
- Validaciones visibles en la documentación.

### Response estándar

Todas las respuestas exitosas y de error siguen esta estructura:

```json
{
  "traceId": "xxx",
  "success": true,
  "code": 200,
  "message": "Operation successful.",
  "data": {},
  "errors": null
}
```

### Validation

La aplicación usa `ValidationPipe` global con:

- `whitelist`
- `forbidNonWhitelisted`
- `transform`

### Exception Filter

Las excepciones HTTP y técnicas son transformadas a una respuesta estándar global con `traceId`, `code`, `message` y `errors`.

Además, el filtro global registra:

- error
- stack trace
- método HTTP
- path
- traceId

### Logging interceptor

Existe un interceptor global reusable para registrar:

- request start
- response end
- status code
- elapsed time
- traceId

### ExecutionService

La capa `shared/logging` incluye `ExecutionService`, un componente reusable para centralizar:

- logs de inicio
- logs de fin
- logs de error
- serialización segura de request/response
- elapsed time
- relanzamiento de errores

Esto evita repetir `try/catch`, `logger.info`, `logger.error` y serialización en servicios de aplicación.

El ejemplo `PersonsService` ya usa este patrón.

## Modulo Person

La template incluye un ejemplo CRUD básico `Person` para mostrar cómo escalar la arquitectura sin romper las capas:

- `api/persons`: controller y módulo HTTP.
- `application/persons`: DTOs, casos de uso y mapeo.
- `domain/persons`: entidad y contrato de repositorio.
- `infrastructure/persons`: repositorio en memoria.

## Estructura de carpetas

```text
template-clean-architecture-node
├── src
│   ├── api
│   │   └── persons
│   ├── application
│   │   └── persons
│   ├── domain
│   │   └── persons
│   ├── infrastructure
│   │   └── persons
│   ├── shared
│   │   ├── exceptions
│   │   ├── logging
│   │   ├── interceptors
│   │   ├── middleware
│   │   ├── responses
│   │   └── swagger
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

Al iniciar, la aplicación imprime por consola la ruta del proyecto y las URLs principales.

## Como ejecutar en desarrollo

```bash
npm run start:dev
```

## Como compilar

```bash
npm run build
```

## Como abrir Swagger

1. Levanta la aplicación:

```bash
npm run start:dev
```

2. Abre:

```text
http://localhost:3000/swagger
```

## Scripts disponibles

- `npm run start`
- `npm run start:dev`
- `npm run build`
- `npm run lint`
- `npm run format`
- `npm run test`

## GitFlow para GitHub

La template incluye una base de gobernanza GitFlow adaptada a GitHub:

- [GitFlow Enterprise para GitHub](/Users/macuser/Repos/template-clean-architecture-node/docs/github-gitflow-standard.md)
- [PR Template](/Users/macuser/Repos/template-clean-architecture-node/.github/PULL_REQUEST_TEMPLATE.md)
- [CODEOWNERS](/Users/macuser/Repos/template-clean-architecture-node/.github/CODEOWNERS)
- workflows de validación y tagging en `.github/workflows/`
