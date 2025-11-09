# Tickets Jira - US-001: Iniciar Proceso de Onboarding

## Sistema Inteligente de Validación Documental (SIVD) - Banco Andino

**User Story:** US-001  
**Epic:** Registro y Formulario Digital  
**Sprint:** Sprint 1  
**Story Points:** 5  
**Total Estimado:** 96 horas

---

## 🏗️ ARQUITECTURA Y CONFIGURACIÓN

### SIVD-101: Configuración inicial del proyecto Frontend

**ID del Ticket:** SIVD-101  
**Título del Ticket:** Setup inicial de proyecto React para módulo de onboarding  
**Tipo:** Technical Task  
**Componente:** Frontend

**Descripción:**
Configurar la estructura base del proyecto React para el módulo de onboarding del SIVD, incluyendo configuración de herramientas de desarrollo, estructura de carpetas, librerías esenciales y configuración de variables de entorno.

**Criterios de Aceptación:**

- [ ] Proyecto React 18+ inicializado con Vite o Create React App
- [ ] Estructura de carpetas siguiendo arquitectura feature-based:
  ```
  src/
  ├── features/
  │   └── onboarding/
  │       ├── components/
  │       ├── pages/
  │       ├── hooks/
  │       ├── services/
  │       └── types/
  ├── shared/
  │   ├── components/
  │   ├── utils/
  │   └── constants/
  ├── config/
  └── styles/
  ```
- [ ] ESLint y Prettier configurados según guía de estilo del equipo
- [ ] TypeScript configurado con strict mode
- [ ] Librerías instaladas: React Router v6, React Hook Form, Yup, Axios, TailwindCSS
- [ ] Variables de entorno configuradas (.env.example creado)
- [ ] Git hooks con Husky para pre-commit (lint + format)
- [ ] README.md con instrucciones de setup
- [ ] Scripts npm configurados (dev, build, test, lint)

**Prioridad:** Highest  
**Estimación de Esfuerzo:** 4 horas

**Tareas Técnicas:**

1. Inicializar proyecto con `npm create vite@latest` y template React + TypeScript
2. Instalar dependencias principales y dev dependencies
3. Configurar tsconfig.json con paths aliases (@features, @shared, @config)
4. Configurar TailwindCSS con Design System tokens del Banco Andino
5. Crear estructura de carpetas base
6. Configurar ESLint con reglas: react-hooks, typescript-eslint, prettier
7. Configurar Husky con lint-staged
8. Crear archivos .env.example y .env.development
9. Configurar Axios instance con interceptors base
10. Crear archivo de constantes de configuración
11. Documentar estructura y decisiones en README.md

**Notas:**

- Usar Vite por mejor performance en desarrollo
- Asegurar compatibilidad con Node.js v18+
- Variables de entorno: VITE_API_BASE_URL, VITE_ENVIRONMENT
- Considerar configurar absolute imports para evitar "../../../"

**Dependencias:** Ninguna  
**Bloqueadores:** Ninguno  
**Assignee:** Frontend Lead

---

### SIVD-102: Configuración inicial del proyecto Backend

**ID del Ticket:** SIVD-102  
**Título del Ticket:** Setup API REST con Node.js + Express para módulo de autenticación  
**Tipo:** Technical Task  
**Componente:** Backend

**Descripción:**
Configurar la estructura base del backend para el módulo de autenticación y onboarding, incluyendo Express server, configuración de base de datos PostgreSQL, middleware de seguridad y estructura modular.

**Criterios de Aceptación:**

- [ ] Proyecto Node.js + Express inicializado con TypeScript
- [ ] Estructura de carpetas siguiendo arquitectura limpia:
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
- [ ] PostgreSQL connection configurada con TypeORM o Prisma
- [ ] Middleware de seguridad configurado: helmet, cors, rate-limit
- [ ] Sistema de logging configurado (Winston o Pino)
- [ ] Manejo centralizado de errores implementado
- [ ] Health check endpoint: GET /api/health
- [ ] Variables de entorno configuradas
- [ ] Docker Compose para desarrollo local (PostgreSQL + Redis)
- [ ] Migraciones de BD configuradas

**Prioridad:** Highest  
**Estimación de Esfuerzo:** 6 horas

**Tareas Técnicas:**

1. Inicializar proyecto: `npm init -y` y configurar TypeScript
2. Instalar dependencias: express, cors, helmet, express-rate-limit, dotenv, bcrypt, jsonwebtoken
3. Instalar Prisma: `npm install prisma @prisma/client`
4. Configurar estructura de carpetas modular
5. Crear middleware de error handling centralizado
6. Configurar Winston para logging (info, error, debug)
7. Configurar CORS permitiendo solo dominios autorizados
8. Implementar rate limiting: 100 req/15min por IP
9. Crear docker-compose.yml con PostgreSQL 15 + Redis 7
10. Inicializar Prisma: `npx prisma init`
11. Configurar variables de entorno (.env.example)
12. Crear endpoint de health check
13. Documentar arquitectura en README.md

**Notas:**

- Usar Prisma por mejor DX con TypeScript
- PostgreSQL en Docker para desarrollo, RDS en producción
- Rate limiting global + específico por endpoint crítico
- Variables: DATABASE_URL, JWT_SECRET, JWT_EXPIRATION, PORT, NODE_ENV
- Considerar usar pnpm en lugar de npm para mejor performance

**Dependencias:** Ninguna  
**Bloqueadores:** Ninguno  
**Assignee:** Backend Lead

---

### SIVD-103: Configuración de base de datos y esquema inicial

**ID del Ticket:** SIVD-103  
**Título del Ticket:** Diseñar e implementar esquema de BD para módulo de autenticación  
**Tipo:** Technical Task  
**Componente:** Database

**Descripción:**
Crear el esquema de base de datos inicial para el módulo de autenticación, incluyendo tabla de clientes, auditoría y configuración de índices para optimización.

**Criterios de Aceptación:**

- [ ] Esquema Prisma creado con modelo Cliente
- [ ] Tabla `clientes` con todos los campos requeridos
- [ ] Tabla `auditoria_auth` para trazabilidad
- [ ] Índices creados en campos de búsqueda frecuente
- [ ] Constraints de unicidad configurados
- [ ] Valores por defecto establecidos
- [ ] Migración inicial creada y probada
- [ ] Seed data para desarrollo creado (usuarios de prueba)
- [ ] Documentación del modelo de datos

**Prioridad:** Highest  
**Estimación de Esfuerzo:** 4 horas

**Tareas Técnicas:**

1. Crear schema.prisma con modelo Cliente:
   ```prisma
   model Cliente {
     id                  String    @id @default(uuid())
     email               String    @unique
     telefono            String?
     passwordHash        String    @map("password_hash")
     estadoOnboarding    String    @default("REGISTRO_COMPLETADO") @map("estado_onboarding")
     emailVerificado     Boolean   @default(false) @map("email_verificado")
     tokenVerificacion   String?   @map("token_verificacion")
     tokenExpiracion     DateTime? @map("token_expiracion")
     fechaRegistro       DateTime  @default(now()) @map("fecha_registro")
     ipRegistro          String?   @map("ip_registro")
     dispositivoRegistro String?   @map("dispositivo_registro")
     origenRegistro      String?   @map("origen_registro")
     ultimoAcceso        DateTime? @map("ultimo_acceso")
     intentosFallidos    Int       @default(0) @map("intentos_fallidos")
     bloqueadoHasta      DateTime? @map("bloqueado_hasta")
     createdAt           DateTime  @default(now()) @map("created_at")
     updatedAt           DateTime  @updatedAt @map("updated_at")

     @@index([email])
     @@index([estadoOnboarding])
     @@index([fechaRegistro])
     @@map("clientes")
   }
   ```
2. Crear modelo AuditoriaAuth para logs
3. Configurar enum para estadoOnboarding
4. Crear índices compuestos si necesario
5. Ejecutar `npx prisma migrate dev --name init`
6. Crear archivo seed.ts con 5 usuarios de prueba
7. Ejecutar seed: `npx prisma db seed`
8. Generar diagrama ER del esquema
9. Documentar modelo en docs/database/schema.md

**Notas:**

- Usar UUID v4 para IDs (mejor seguridad que auto-increment)
- passwordHash con bcrypt (nunca almacenar password plano)
- tokenVerificacion para verificación de email
- intentosFallidos + bloqueadoHasta para prevenir brute force
- Todos los timestamps en UTC
- Considerar particionamiento por fecha si volumen es alto

**Dependencias:** SIVD-102  
**Bloqueadores:** Ninguno  
**Assignee:** Backend Developer

---

## 🎨 FRONTEND - UI COMPONENTS

### SIVD-104: Implementar componente Landing Page

**ID del Ticket:** SIVD-104  
**Título del Ticket:** Desarrollar landing page de onboarding con información y CTA  
**Tipo:** Development  
**Componente:** Frontend

**Descripción:**
Desarrollar la landing page inicial del proceso de onboarding que presente información clara sobre requisitos, beneficios y CTA principal para iniciar el proceso. Debe ser responsive y seguir el Design System del Banco Andino.

**Criterios de Aceptación:**

- [ ] Componente `LandingPage.tsx` creado en `features/onboarding/pages/`
- [ ] Responsive en breakpoints: mobile (320px), tablet (768px), desktop (1024px+)
- [ ] Sección hero con título principal y CTA destacado
- [ ] Lista de beneficios con iconos (lucide-react)
- [ ] Sección de requisitos clara y legible
- [ ] Tiempo estimado del proceso visible
- [ ] Footer con enlaces a términos y políticas
- [ ] Botón "Comenzar ahora" con estado hover y loading
- [ ] Link "¿Ya iniciaste? Ingresar" visible
- [ ] Imágenes optimizadas (WebP con fallback)
- [ ] Accesibilidad: landmarks, alt texts, contraste WCAG AA
- [ ] Lighthouse score > 90

**Prioridad:** High  
**Estimación de Esfuerzo:** 8 horas

**Tareas Técnicas:**

1. Crear componente `LandingPage.tsx` con TypeScript
2. Crear sub-componentes reutilizables:
   - `HeroSection.tsx`
   - `BenefitsSection.tsx`
   - `RequirementsSection.tsx`
   - `Footer.tsx`
3. Implementar layout con TailwindCSS Grid/Flexbox
4. Agregar iconos de lucide-react (Check, Clock, Shield, FileText)
5. Implementar animaciones sutiles con Framer Motion (opcional)
6. Optimizar imágenes con lazy loading
7. Agregar meta tags para SEO
8. Implementar tracking de eventos: `page_view_landing`, `click_start_onboarding`
9. Crear tests con React Testing Library
10. Validar responsive en Chrome DevTools + dispositivos reales
11. Verificar accesibilidad con Axe DevTools
12. Optimizar performance (code splitting si necesario)

**Notas:**

- Copy text debe venir de archivo de constantes (i18n-ready)
- Usar lazy loading para imágenes below the fold
- Considerar A/B testing de diferentes CTAs (preparar estructura)
- Hero image: ilustración de persona con celular
- Colores: Azul #0052CC (primario), Verde #00875A (success)
- Font: Roboto 700 (headings), Open Sans 400 (body)

**Dependencias:** SIVD-101  
**Bloqueadores:** Pendiente aprobación de diseños finales  
**Assignee:** Frontend Developer 1

---

### SIVD-105: Implementar formulario de registro

**ID del Ticket:** SIVD-105  
**Título del Ticket:** Crear formulario de registro con validaciones en tiempo real  
**Tipo:** Development  
**Componente:** Frontend

**Descripción:**
Desarrollar el formulario de registro de nueva cuenta con campos de email, contraseña, teléfono y aceptación de términos. Incluir validaciones en tiempo real, indicadores visuales de error y fortaleza de contraseña.

**Criterios de Aceptación:**

- [ ] Componente `RegisterForm.tsx` con React Hook Form
- [ ] Campos implementados: email, password, confirmPassword, telefono, termsAccepted
- [ ] Validaciones en tiempo real con Yup schema
- [ ] Indicador visual de fortaleza de contraseña (débil/media/fuerte)
- [ ] Mensajes de error específicos por campo
- [ ] Botón "Registrarse" deshabilitado si form inválido
- [ ] Loading state durante envío de formulario
- [ ] Manejo de errores de API (email duplicado, server error)
- [ ] Links a términos y políticas abren en modal
- [ ] Accesibilidad: labels asociados, error messages con aria-describedby
- [ ] Tests unitarios para validaciones

**Prioridad:** High  
**Estimación de Esfuerzo:** 10 horas

**Tareas Técnicas:**

1. Crear componente `RegisterForm.tsx` con useForm de React Hook Form
2. Crear schema de validación con Yup:
   ```typescript
   const registerSchema = yup.object({
     email: yup.string().email('Email inválido').required('Email requerido'),
     password: yup
       .string()
       .min(8, 'Mínimo 8 caracteres')
       .matches(/[A-Z]/, 'Requiere mayúscula')
       .matches(/[a-z]/, 'Requiere minúscula')
       .matches(/[0-9]/, 'Requiere número')
       .required('Contraseña requerida'),
     confirmPassword: yup.string().oneOf([yup.ref('password')], 'Contraseñas no coinciden'),
     telefono: yup
       .string()
       .matches(/^\+57[0-9]{10}$/, 'Formato: +57XXXXXXXXXX')
       .required('Teléfono requerido'),
     termsAccepted: yup.boolean().oneOf([true], 'Debes aceptar términos y condiciones'),
   });
   ```
3. Crear componente `PasswordStrengthIndicator.tsx`
4. Implementar lógica de cálculo de fortaleza (zxcvbn library)
5. Crear componente `Input.tsx` reutilizable con estados error/success
6. Implementar input type="tel" con máscara para teléfono
7. Crear componente `Checkbox.tsx` con link a términos
8. Implementar modal de términos con `TermsModal.tsx`
9. Integrar con API de registro (POST /api/v1/auth/register)
10. Manejar estados: idle, loading, success, error
11. Implementar feedback visual: toast/alert de éxito o error
12. Agregar tracking: `form_started`, `form_error`, `registration_completed`
13. Crear tests con React Testing Library + MSW para mock API

**Notas:**

- Usar debounce en validación de email para no saturar
- Password no debe ser visible por defecto (toggle eye icon)
- Validar email disponible con API antes de submit (optional)
- Guardar datos en sessionStorage si abandona para recuperar
- Considerar Google reCAPTCHA v3 para prevenir bots (futuro)

**Dependencias:** SIVD-101, SIVD-104  
**Bloqueadores:** Ninguno  
**Assignee:** Frontend Developer 2

---

### SIVD-106: Implementar pantallas de verificación de email

**ID del Ticket:** SIVD-106  
**Título del Ticket:** Crear pantallas de confirmación y verificación de email  
**Tipo:** Development  
**Componente:** Frontend

**Descripción:**
Desarrollar las pantallas de flujo de verificación de email: pantalla de confirmación después del registro, página de verificación exitosa y manejo de errores (link expirado, inválido).

**Criterios de Aceptación:**

- [ ] Componente `EmailSentPage.tsx` con mensaje de confirmación
- [ ] Instrucciones para revisar inbox y spam
- [ ] Botón "Reenviar email" disponible después de 2 minutos
- [ ] Componente `EmailVerifiedPage.tsx` con mensaje de éxito
- [ ] Redirección automática después de verificación
- [ ] Componente `EmailVerificationError.tsx` para errores
- [ ] Manejo de link expirado con opción de reenviar
- [ ] Manejo de link inválido con mensaje apropiado
- [ ] Loader/spinner durante verificación
- [ ] Tests para cada escenario

**Prioridad:** High  
**Estimación de Esfuerzo:** 6 horas

**Tareas Técnicas:**

1. Crear `EmailSentPage.tsx` con ilustración de sobre
2. Implementar countdown timer para botón "Reenviar"
3. Crear servicio `resendVerificationEmail()`
4. Crear ruta `/verify-email/:token` en React Router
5. Crear `EmailVerifiedPage.tsx` con checkmark animado
6. Implementar verificación automática al cargar página:
   ```typescript
   useEffect(() => {
     const verifyEmail = async () => {
       try {
         await authService.verifyEmail(token);
         setStatus('success');
         setTimeout(() => navigate('/onboarding'), 3000);
       } catch (error) {
         setStatus('error');
       }
     };
     verifyEmail();
   }, [token]);
   ```
7. Crear `EmailVerificationError.tsx` con manejo de diferentes errores
8. Implementar lógica para distinguir error de expiración vs inválido
9. Agregar animaciones con Framer Motion (optional)
10. Implementar tracking de eventos de verificación
11. Crear tests con diferentes escenarios de error

**Notas:**

- Countdown de 120 segundos antes de permitir reenvío
- Guardar timestamp de último envío en localStorage
- Token viene en URL como query param: /verify-email?token=xxx
- Mostrar mensaje amigable, no código de error técnico
- Considerar enviar analytics de cuántos usuarios no reciben email

**Dependencias:** SIVD-105  
**Bloqueadores:** Ninguno  
**Assignee:** Frontend Developer 1

---

### SIVD-107: Implementar formulario de login

**ID del Ticket:** SIVD-107  
**Título del Ticket:** Crear formulario de inicio de sesión con manejo de errores  
**Tipo:** Development  
**Componente:** Frontend

**Descripción:**
Desarrollar formulario de login para usuarios que ya iniciaron registro, con manejo de credenciales incorrectas, cuenta bloqueada, opción de recordar sesión y recuperación de contraseña.

**Criterios de Aceptación:**

- [ ] Componente `LoginForm.tsx` con React Hook Form
- [ ] Campos: email y password
- [ ] Checkbox "Recordar mi sesión" funcional
- [ ] Link "¿Olvidaste tu contraseña?" visible
- [ ] Manejo de errores específicos:
  - Credenciales incorrectas
  - Cuenta no verificada
  - Cuenta bloqueada (mostrar tiempo restante)
  - Error de servidor
- [ ] Redirección inteligente según estado de onboarding
- [ ] Loading state durante autenticación
- [ ] Persistencia de sesión con JWT en localStorage/cookie
- [ ] Tests para diferentes escenarios

**Prioridad:** High  
**Estimación de Esfuerzo:** 8 horas

**Tareas Técnicas:**

1. Crear componente `LoginForm.tsx` con validaciones básicas
2. Crear schema Yup para validación:
   ```typescript
   const loginSchema = yup.object({
     email: yup.string().email().required(),
     password: yup.string().required(),
     rememberMe: yup.boolean(),
   });
   ```
3. Implementar servicio `authService.login(credentials)`
4. Manejar response con JWT token y refresh token
5. Guardar tokens según "Recordar sesión":
   - Si true: localStorage
   - Si false: sessionStorage
6. Crear función de redirección inteligente:
   ```typescript
   const redirectByStatus = (status: string) => {
     const routes = {
       REGISTRO_COMPLETADO: '/onboarding/personal-info',
       FORMULARIO_COMPLETADO: '/onboarding/documents',
       DOCUMENTOS_CARGADOS: '/onboarding/status',
       VALIDACION_COMPLETADA: '/dashboard',
     };
     return routes[status] || '/onboarding';
   };
   ```
7. Implementar manejo de diferentes errores de API
8. Crear componente `ForgotPasswordModal.tsx` (UI básico)
9. Implementar contador de intentos fallidos (cliente side)
10. Agregar tracking: `login_success`, `login_failed`, `account_locked`
11. Crear tests para cada escenario de error
12. Implementar auto-focus en campo email al cargar

**Notas:**

- Máximo 5 intentos fallidos antes de bloqueo temporal (15 min)
- JWT expira en 2 horas, refresh token en 7 días
- Usar httpOnly cookies para tokens si es posible (más seguro)
- Validar token en cada request con Axios interceptor
- No mostrar si error es email o password (seguridad)
- Mensaje genérico: "Credenciales incorrectas"

**Dependencias:** SIVD-101  
**Bloqueadores:** Ninguno  
**Assignee:** Frontend Developer 2

---

## 🔧 BACKEND - API ENDPOINTS

### SIVD-108: Implementar endpoint de registro de usuario

**ID del Ticket:** SIVD-108  
**Título del Ticket:** Desarrollar API POST /auth/register con validaciones y seguridad  
**Tipo:** Development  
**Componente:** Backend

**Descripción:**
Implementar endpoint para registro de nuevos usuarios con validaciones robustas, hash de contraseña, generación de token de verificación y envío de email de confirmación.

**Criterios de Aceptación:**

- [ ] Endpoint POST /api/v1/auth/register implementado
- [ ] Validación de datos de entrada con class-validator
- [ ] Verificación de email único (no duplicado)
- [ ] Hash de contraseña con bcrypt (salt rounds = 10)
- [ ] Generación de token de verificación único
- [ ] Registro en base de datos con transaction
- [ ] Envío de email de verificación asíncrono
- [ ] Log de auditoría de registro
- [ ] Response apropiado: 201 Created con datos (sin password)
- [ ] Manejo de errores: 400, 409 (conflict), 500
- [ ] Rate limiting: 5 registros por IP por hora
- [ ] Tests unitarios e integración

**Prioridad:** Highest  
**Estimación de Esfuerzo:** 10 horas

**Tareas Técnicas:**

1. Crear DTO `CreateClienteDto`:

   ```typescript
   export class CreateClienteDto {
     @IsEmail()
     @IsNotEmpty()
     email: string;

     @IsString()
     @MinLength(8)
     @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
     password: string;

     @IsString()
     @Matches(/^\+57[0-9]{10}$/)
     telefono: string;

     @IsBoolean()
     termsAccepted: boolean;
   }
   ```

2. Crear `AuthController.register()` method
3. Crear `AuthService.registerCliente()` con lógica de negocio
4. Implementar verificación de email único en repository
5. Implementar hash de password con bcrypt:
   ```typescript
   const salt = await bcrypt.genSalt(10);
   const passwordHash = await bcrypt.hash(dto.password, salt);
   ```
6. Generar token de verificación: `crypto.randomBytes(32).toString('hex')`
7. Guardar token con expiración de 24 horas
8. Crear registro en tabla `clientes` con transaction
9. Crear registro en `auditoria_auth` con IP y user agent
10. Enviar evento a queue para envío de email (implementar worker básico)
11. Implementar rate limiting con express-rate-limit
12. Crear respuesta sanitizada (sin password, sin token)
13. Manejar errores específicos con custom exceptions
14. Crear tests unitarios con Jest + mocks
15. Crear tests de integración con supertest

**Notas:**

- Usar transactions para atomicidad (rollback si falla)
- Email enviado de forma asíncrona (no bloquear response)
- Sanitizar email: lowercase + trim antes de guardar
- Extraer IP con req.ip o x-forwarded-for header
- User agent: req.headers['user-agent']
- Considerar honeypot field para detectar bots
- Rate limiting por IP + por email intentado

**Dependencias:** SIVD-102, SIVD-103  
**Bloqueadores:** Ninguno  
**Assignee:** Backend Developer 1

---

### SIVD-109: Implementar endpoint de verificación de email

**ID del Ticket:** SIVD-109  
**Título del Ticket:** Desarrollar API GET /auth/verify-email para validar token  
**Tipo:** Development  
**Componente:** Backend

**Descripción:**
Implementar endpoint para verificar el token de email recibido por el usuario, marcar la cuenta como verificada y permitir el inicio de sesión.

**Criterios de Aceptación:**

- [ ] Endpoint GET /api/v1/auth/verify-email/:token implementado
- [ ] Validación de existencia de token en BD
- [ ] Verificación de no expiración (< 24 horas)
- [ ] Actualización de estado: emailVerificado = true
- [ ] Invalidación de token después de uso
- [ ] Response 200 OK con mensaje de éxito
- [ ] Manejo de errores: token inválido (404), expirado (410), ya usado (409)
- [ ] Log de auditoría de verificación
- [ ] Tests unitarios e integración

**Prioridad:** Highest  
**Estimación de Esfuerzo:** 6 horas

**Tareas Técnicas:**

1. Crear ruta GET `/auth/verify-email/:token` en routes
2. Crear `AuthController.verifyEmail()` method
3. Crear `AuthService.verifyEmailToken()` con lógica:
   ```typescript
   async verifyEmailToken(token: string) {
     const cliente = await this.repository.findByVerificationToken(token);

     if (!cliente) {
       throw new NotFoundException('Token inválido');
     }

     if (cliente.emailVerificado) {
       throw new ConflictException('Email ya verificado');
     }

     if (new Date() > cliente.tokenExpiracion) {
       throw new GoneException('Token expirado');
     }

     await this.repository.update(cliente.id, {
       emailVerificado: true,
       tokenVerificacion: null,
       tokenExpiracion: null
     });

     await this.auditService.log({
       action: 'EMAIL_VERIFIED',
       clienteId: cliente.id,
       timestamp: new Date()
     });

     return { success: true, message: 'Email verificado exitosamente' };
   }
   ```
4. Implementar custom exceptions: GoneException para token expirado
5. Crear respuesta con información del siguiente paso
6. Agregar logging de evento de verificación
7. Crear tests para cada escenario:
   - Token válido
   - Token inválido
   - Token expirado
   - Token ya usado
8. Test de integración end-to-end

**Notas:**

- Token debe ser URL-safe (no caracteres especiales)
- Considerar agregar CSRF protection
- Log debe incluir timestamp, IP, success/failure
- Después de verificar, usuario puede hacer login inmediatamente
- Considerar enviar email de bienvenida después de verificación

**Dependencias:** SIVD-108  
**Bloqueadores:** Ninguno  
**Assignee:** Backend Developer 1

---

### SIVD-110: Implementar endpoint de reenvío de verificación

**ID del Ticket:** SIVD-110  
**Título del Ticket:** Desarrollar API POST /auth/resend-verification para reenviar email  
**Tipo:** Development  
**Componente:** Backend

**Descripción:**
Implementar endpoint para reenviar email de verificación cuando el usuario no lo recibe o el token expira.

**Criterios de Aceptación:**

- [ ] Endpoint POST /api/v1/auth/resend-verification implementado
- [ ] Validación de que email existe en sistema
- [ ] Validación de que email no está ya verificado
- [ ] Generación de nuevo token (invalidar anterior)
- [ ] Envío de nuevo email de verificación
- [ ] Rate limiting: máximo 3 reenvíos por hora por email
- [ ] Response 200 OK con mensaje confirmación
- [ ] Manejo de errores: email no existe, ya verificado, rate limit
- [ ] Tests unitarios e integración

**Prioridad:** High  
**Estimación de Esfuerzo:** 4 horas

**Tareas Técnicas:**

1. Crear DTO `ResendVerificationDto`:
   ```typescript
   export class ResendVerificationDto {
     @IsEmail()
     @IsNotEmpty()
     email: string;
   }
   ```
2. Crear ruta POST `/auth/resend-verification`
3. Crear `AuthController.resendVerification()` method
4. Crear `AuthService.resendVerificationEmail()` con lógica:
   ```typescript

   ```
