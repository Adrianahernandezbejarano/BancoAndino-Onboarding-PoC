# SIVD Backend - Sistema Inteligente de Validación Documental

Backend API para el sistema de onboarding del Banco Andino.

## 🚀 Tecnologías

- **Node.js** + **Express** + **TypeScript**
- **Prisma** (ORM)
- **PostgreSQL** (Base de datos)
- **JWT** (Autenticación)
- **Winston** (Logging)
- **Docker Compose** (Desarrollo local)

## 📋 Requisitos Previos

- Node.js v18+
- Docker y Docker Compose
- pnpm o npm

## 🛠️ Instalación

1. Instalar dependencias:

```bash
pnpm install
# o
npm install
```

2. Configurar variables de entorno:

```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

3. Iniciar servicios con Docker Compose:

```bash
docker-compose up -d
```

4. Ejecutar migraciones de Prisma:

```bash
pnpm prisma:migrate
# o
npm run prisma:migrate
```

5. Generar cliente de Prisma:

```bash
pnpm prisma:generate
# o
npm run prisma:generate
```

6. (Opcional) Ejecutar seed de datos de prueba:

```bash
pnpm db:seed
# o
npm run db:seed
```

## 🏃 Ejecutar en Desarrollo

```bash
pnpm dev
# o
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

## 📁 Estructura del Proyecto

```
src/
├── modules/
│   └── auth/
│       ├── controllers/
│       ├── services/
│       ├── repositories/
│       ├── dtos/
│       ├── validators/
│       └── routes.ts
├── shared/
│   ├── middleware/
│   ├── utils/
│   ├── types/
│   └── errors/
├── config/
│   ├── database.ts
│   └── env.ts
└── server.ts
```

## 🔌 Endpoints API

### Autenticación

- `POST /api/v1/auth/register` - Registrar nuevo usuario
- `GET /api/v1/auth/verify-email/:token` - Verificar email
- `POST /api/v1/auth/resend-verification` - Reenviar email de verificación
- `POST /api/v1/auth/login` - Iniciar sesión

### Health Check

- `GET /api/health` - Estado del servidor

## 🧪 Testing

```bash
pnpm test
# o
npm test
```

## 📝 Scripts Disponibles

- `dev` - Ejecutar en modo desarrollo con hot reload
- `build` - Compilar TypeScript
- `start` - Ejecutar versión compilada
- `test` - Ejecutar tests
- `lint` - Verificar código con ESLint
- `lint:fix` - Corregir problemas de linting
- `format` - Formatear código con Prettier
- `prisma:generate` - Generar cliente de Prisma
- `prisma:migrate` - Ejecutar migraciones
- `prisma:studio` - Abrir Prisma Studio
- `db:seed` - Ejecutar seed de datos

## 🔒 Seguridad

- Helmet para headers de seguridad
- CORS configurado
- Rate limiting implementado
- Bcrypt para hash de contraseñas
- Validación de datos de entrada

## 📚 Documentación

Ver documentación completa en `/docs` (próximamente)
