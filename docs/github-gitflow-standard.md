# GitFlow Enterprise para GitHub

## 1. Resumen ejecutivo del modelo

Se adopta un GitFlow moderno, simple y gobernable, orientado a GitHub como plataforma nativa de versionamiento y revisión.

El modelo usa solo dos ramas permanentes:

- `main`
- `develop`

Y cuatro tipos de ramas temporales:

- `feature/*`
- `bugfix/*`
- `release/*`
- `hotfix/*`

La estrategia prioriza PRs cortos, trazabilidad, branch protection fuerte y automatización con GitHub Actions.

## 2. Estrategia de ramas

### Ramas permanentes

#### `main`

- Contiene únicamente código estable y desplegable a `PROD`.
- Solo acepta merges desde `release/*` o `hotfix/*`.
- No permite push directo.
- Debe estar protegida con reglas estrictas.
- Cada merge a `main` debe generar un tag `vMAJOR.MINOR.PATCH`.

#### `develop`

- Es la rama principal de integración continua.
- Desde aquí nacen `feature/*`, `bugfix/*` y `release/*`.
- No permite push directo.
- Debe estar protegida.
- Representa el estado candidato para `DEV`.

### Ramas temporales

#### `feature/*`

- Proposito: nuevas funcionalidades.
- Rama origen: `develop`.
- Destino de merge: `develop`.
- Formato: `feature/{ticket}-{descripcion}`
- Ejemplo: `feature/20260517-standard-response`

#### `bugfix/*`

- Proposito: correcciones no críticas.
- Rama origen: `develop`.
- Destino de merge: `develop`.
- Formato: `bugfix/{ticket}-{descripcion}`
- Ejemplo: `bugfix/20260517-fix-trace-id`

#### `release/*`

- Proposito: estabilización breve antes de producción.
- Rama origen: `develop`.
- Destinos de merge: `main` y retorno obligatorio a `develop`.
- Formato: `release/v{version}`
- Ejemplo: `release/v1.2.0`

Cambios permitidos:

- fixes menores
- ajustes de configuración
- validaciones de QA
- endurecimiento de release

Cambios prohibidos:

- features nuevas
- refactors amplios
- cambios arquitectónicos tardíos

#### `hotfix/*`

- Proposito: incidentes críticos en producción.
- Rama origen: `main`.
- Destinos de merge: `main` y retorno obligatorio a `develop`.
- Formato: `hotfix/{ticket}-{descripcion}`
- Ejemplo: `hotfix/20260517-fix-prod-timeout`

## 3. Reglas por rama

### Reglas de `main`

- Push directo bloqueado.
- Merge solo por Pull Request.
- Aprobación mínima recomendada: `2`.
- Checks obligatorios: branch naming, CI Governance.
- Requerir resolución de conversaciones.
- Requerir branch actualizada antes del merge.
- Permitir solo merge desde `release/*` o `hotfix/*`.

### Reglas de `develop`

- Push directo bloqueado.
- Merge solo por Pull Request.
- Aprobación mínima recomendada: `1`.
- Checks obligatorios: branch naming, CI Governance.
- Permitir solo merge desde `feature/*`, `bugfix/*`, `release/*` y `hotfix/*`.

### Reglas de `release/*`

- Vida corta.
- Uso exclusivo para estabilización.
- Debe desplegarse a `CERT`.
- Al cerrar, merge a `main` y retorno a `develop`.

### Reglas de `hotfix/*`

- Uso solo para incidentes críticos reales.
- Debe salir de `main`.
- Debe volver a `main` y luego a `develop`.

## 4. Ambientes y estrategia de despliegue

Los ambientes son:

- `DEV`
- `CERT`
- `PROD`

Mapeo propuesto:

- `develop` -> `DEV`
- `release/*` -> `CERT`
- `main` -> `PROD`
- `hotfix/*` -> `CERT` y luego `PROD`

Principios:

- no crear ramas por ambiente
- promover cambios por pipeline, no por proliferación de ramas
- mantener secretos fuera del repositorio
- mantener trazabilidad ticket -> branch -> PR -> build -> tag

## 5. Versionamiento y tags

Se adopta `SemVer`:

- `vMAJOR.MINOR.PATCH`

Reglas:

- `release/*` nace con la versión objetivo ya definida
- el merge a `main` dispara tagging automático
- el workflow toma la versión desde `package.json`
- si el tag ya existe, no intenta recrearlo

## 6. Políticas de protección y calidad

### Estándar propuesto

#### Para `main`

- bloquear push directo
- requerir PR
- requerir `2` aprobaciones
- requerir conversaciones resueltas
- requerir status checks exitosos
- requerir branch actualizada antes del merge
- deshabilitar force push
- deshabilitar delete accidental

#### Para `develop`

- bloquear push directo
- requerir PR
- requerir `1` aprobación
- requerir status checks exitosos
- requerir conversaciones resueltas

### Status checks recomendados

- `validate-branch-name`
- `quality-gates`

### Calidad mínima del repositorio

- PR template obligatorio
- CODEOWNERS activo
- eliminación automática de ramas tras merge
- merge strategy consistente, preferiblemente `squash`
- commits idealmente bajo Conventional Commits

## 7. Estrategia de Pull Requests

Todo PR debe incluir:

- objetivo
- ticket relacionado
- impacto técnico
- validaciones realizadas
- evidencia si aplica
- checklist técnico

Además:

- PRs pequeños y enfocados
- no mezclar feature con cleanup no relacionado
- revisar primero seguridad, regresión y contrato público

## 8. Implementación nativa en GitHub

### Archivos incluidos en esta template

- `.github/PULL_REQUEST_TEMPLATE.md`
- `.github/CODEOWNERS`
- `.github/workflows/branch-name-validation.yml`
- `.github/workflows/ci-governance.yml`
- `.github/workflows/tag-main-release.yml`

### Configuración manual que debes aplicar en GitHub

#### Branch protection o rulesets para `main`

Configurar en GitHub:

1. `Settings`
2. `Rules`
3. `Rulesets` o `Branch protection rules`

Aplicar a `main`:

- restrict deletions
- block force pushes
- require a pull request before merging
- require approvals: `2`
- require review from code owners
- require conversation resolution
- require status checks:
  - `validate-branch-name`
  - `quality-gates`

#### Branch protection o rulesets para `develop`

Aplicar a `develop`:

- block force pushes
- require a pull request before merging
- require approvals: `1`
- require conversation resolution
- require status checks:
  - `validate-branch-name`
  - `quality-gates`

#### Recomendaciones adicionales del repositorio

- habilitar `Automatically delete head branches`
- usar `Squash merge`
- deshabilitar `Merge commits` si desean historial más limpio
- mantener `Rebase merge` solo si el equipo lo necesita explícitamente

## 9. Ejemplos prácticos

### Convención de commits

```text
feat: add global logging interceptor
fix: resolve trace id propagation
refactor: extract shared execution service
docs: document github gitflow standard
chore: update github workflows
```

### Nueva feature

```bash
git checkout develop
git pull origin develop
git checkout -b feature/20260517-standard-logging
git push -u origin feature/20260517-standard-logging
```

### Bugfix

```bash
git checkout develop
git pull origin develop
git checkout -b bugfix/20260517-fix-branch-validation
git push -u origin bugfix/20260517-fix-branch-validation
```

### Release

```bash
git checkout develop
git pull origin develop
git checkout -b release/v1.0.0
git push -u origin release/v1.0.0
```

### Hotfix

```bash
git checkout main
git pull origin main
git checkout -b hotfix/20260517-fix-prod-timeout
git push -u origin hotfix/20260517-fix-prod-timeout
```

## 10. Escenarios operativos end-to-end

### Escenario 1. Nueva feature

1. Crear `feature/*` desde `develop`.
2. Desarrollar y validar localmente.
3. Abrir PR hacia `develop`.
4. Ejecutar GitHub Actions.
5. Obtener aprobación.
6. Hacer merge.
7. Eliminar la rama.

### Escenario 2. Release controlada

1. Crear `release/vX.Y.Z` desde `develop`.
2. Ejecutar validaciones y QA en `CERT`.
3. Corregir solo defectos menores.
4. Abrir PR a `main`.
5. Aprobar y mergear.
6. Generar tag automático.
7. Abrir PR de retorno a `develop`.
8. Eliminar `release/*`.

### Escenario 3. Hotfix productivo

1. Crear `hotfix/*` desde `main`.
2. Corregir el incidente.
3. Validar por pipeline.
4. Abrir PR a `main`.
5. Aprobar y mergear.
6. Confirmar tag y despliegue a `PROD`.
7. Hacer retorno obligatorio a `develop`.

## 11. Checklist de implementación

- [ ] Crear ramas permanentes `main` y `develop`
- [ ] Subir `.github/PULL_REQUEST_TEMPLATE.md`
- [ ] Ajustar `.github/CODEOWNERS` con usuarios o equipos reales
- [ ] Activar branch protections o rulesets para `main`
- [ ] Activar branch protections o rulesets para `develop`
- [ ] Habilitar `Automatically delete head branches`
- [ ] Habilitar GitHub Actions en el repositorio
- [ ] Validar workflows:
  - `branch-name-validation`
  - `ci-governance`
  - `tag-main-release`
- [ ] Alinear la versión de `package.json` antes de cada release
- [ ] Comunicar la convención de ramas al equipo
