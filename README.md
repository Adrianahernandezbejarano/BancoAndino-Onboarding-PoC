# SIVD Frontend - Sistema Inteligente de Validación Documental

Frontend React para el sistema de onboarding del Banco Andino.

## 🚀 Tecnologías

- **React 18** + **TypeScript**
- **Vite** (Build tool)
- **React Router v6** (Routing)
- **React Hook Form** + **Yup** (Formularios y validación)
- **Axios** (HTTP client)
- **TailwindCSS** (Estilos)
- **Lucide React** (Iconos)
- **Framer Motion** (Animaciones)

## 📋 Requisitos Previos

- Node.js v18+
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

3. Ejecutar en desarrollo:

```bash
pnpm dev
# o
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 📁 Estructura del Proyecto

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
│   └── services/
├── config/
└── App.tsx
```

## 🏗️ Build para Producción

```bash
pnpm build
# o
npm run build
```

Los archivos compilados estarán en la carpeta `dist/`

## 🧪 Testing

```bash
pnpm test
# o
npm test
```

## 📝 Scripts Disponibles

- `dev` - Ejecutar en modo desarrollo
- `build` - Compilar para producción
- `preview` - Previsualizar build de producción
- `lint` - Verificar código con ESLint
- `lint:fix` - Corregir problemas de linting
- `format` - Formatear código con Prettier
- `test` - Ejecutar tests

## 🎨 Design System

El proyecto utiliza TailwindCSS con tokens personalizados del Banco Andino:

- **Colores primarios**: `#0052CC`
- **Colores de éxito**: `#00875A`
- **Fuentes**: Roboto (headings), Open Sans (body)

## 📚 Documentación

Ver documentación completa en `/docs` (próximamente)
