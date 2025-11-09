# SIVD - Sistema Inteligente de Validación Documental

Proyecto completo de onboarding digital para Banco Andino, compuesto por Backend (Node.js) y Frontend (React).

## 📁 Estructura del Proyecto

```
BancoAndino-Onboarding-PoC/
├── backend/          # API REST con Node.js + Express + TypeScript
├── src/             # Frontend React + Vite + TypeScript
├── README.md        # Documentación del frontend
└── PROJECT_SETUP.md # Este archivo
```

## 🚀 Inicio Rápido

### Prerrequisitos

- **Node.js** v18 o superior
- **Docker** y **Docker Compose** (para desarrollo local)
- **pnpm** o **npm**

### 1. Configurar Backend

```bash
cd backend

# Instalar dependencias
pnpm install
# o
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones

# Iniciar servicios (PostgreSQL + Redis)
docker-compose up -d

# Ejecutar migraciones de Prisma
pnpm prisma:migrate
# o
npm run prisma:migrate

# Generar cliente de Prisma
pnpm prisma:generate
# o
npm run prisma:generate

# (Opcional) Ejecutar seed de datos de prueba
pnpm db:seed
# o
npm run db:seed

# Iniciar servidor en modo desarrollo
pnpm dev
# o
npm run dev
```

El backend estará disponible en `http://localhost:3000`

### 2. Configurar Frontend

```bash
# Desde la raíz del proyecto
cd src

# Instalar dependencias
pnpm install
# o
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones

# Iniciar servidor de desarrollo
pnpm dev
# o
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

## 📚 Documentación

- **Backend**: Ver `backend/README.md`
- **Frontend**: Ver `README.md` (en la raíz)

## 🔧 Tecnologías Utilizadas

### Backend

- Node.js + Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT (Autenticación)
- Winston (Logging)
- Docker Compose

### Frontend

- React 18
- TypeScript
- Vite
- React Router v6
- React Hook Form + Yup
- TailwindCSS
- Axios
- Lucide React (Iconos)

## 📋 Endpoints API Disponibles

### Autenticación

- `POST /api/v1/auth/register` - Registrar nuevo usuario
- `GET /api/v1/auth/verify-email/:token` - Verificar email
- `POST /api/v1/auth/resend-verification` - Reenviar email de verificación
- `POST /api/v1/auth/login` - Iniciar sesión

### Health Check

- `GET /api/health` - Estado del servidor

## 🧪 Testing

### Backend

```bash
cd backend
pnpm test
```

### Frontend

```bash
cd src
pnpm test
```

## 🏗️ Build para Producción

### Backend

```bash
cd backend
pnpm build
pnpm start
```

### Frontend

```bash
cd src
pnpm build
# Los archivos estarán en dist/
```

## 📝 Scripts Útiles

### Backend

- `dev` - Desarrollo con hot reload
- `build` - Compilar TypeScript
- `start` - Ejecutar versión compilada
- `test` - Ejecutar tests
- `lint` - Verificar código
- `prisma:studio` - Abrir Prisma Studio (GUI para BD)

### Frontend

- `dev` - Desarrollo con Vite
- `build` - Compilar para producción
- `preview` - Previsualizar build
- `lint` - Verificar código
- `format` - Formatear código

## 🔒 Seguridad

- Helmet para headers de seguridad
- CORS configurado
- Rate limiting implementado
- Bcrypt para hash de contraseñas
- Validación de datos de entrada
- JWT para autenticación

## 📖 User Stories

Este proyecto implementa las User Stories definidas en `sivd_user_stories.md`:

- **US-001**: Iniciar proceso de onboarding ✅
- Y más...

## 🐛 Troubleshooting

### Backend no inicia

1. Verificar que PostgreSQL esté corriendo: `docker-compose ps`
2. Verificar variables de entorno en `.env`
3. Verificar que las migraciones se ejecutaron: `pnpm prisma:migrate`

### Frontend no se conecta al backend

1. Verificar que el backend esté corriendo en `http://localhost:3000`
2. Verificar `VITE_API_BASE_URL` en `.env` del frontend
3. Verificar CORS en el backend

### Errores de Prisma

1. Regenerar cliente: `pnpm prisma:generate`
2. Verificar conexión a BD: `pnpm prisma:studio`
3. Revisar logs: `docker-compose logs postgres`

## 📞 Soporte

Para más información, consultar la documentación en cada proyecto o los tickets Jira correspondientes.
