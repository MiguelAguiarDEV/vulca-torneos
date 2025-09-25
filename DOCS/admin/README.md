# 🔧 Sistema Admin - Vulca Torneos

## 📋 Resumen General

El sistema admin de Vulca Torneos está diseñado para que los administradores puedan gestionar completamente juegos, torneos e inscripciones. Utiliza middleware de autenticación y autorización para proteger todas las rutas admin.

## 🛡️ Middleware y Seguridad

- **Autenticación**: Todas las rutas admin requieren que el usuario esté autenticado
- **Autorización**: Se verifica que el usuario tenga rol de admin mediante `auth()->user()->isAdmin()`
- **Middleware**: `auth` y `admin` aplicados a todas las rutas admin

## 📁 Estructura de Rutas

### Prefijo Base
- **Prefijo**: `/admin`
- **Middleware**: `auth`, `admin`

### Módulos Principales

1. **[Dashboard](routes.md#dashboard-admin)** - Panel principal del administrador
2. **[Gestión de Juegos](routes.md#gestión-de-juegos-games)** - CRUD completo de juegos
3. **[Gestión de Torneos](routes.md#gestión-de-torneos-tournaments)** - CRUD completo de torneos
4. **[Gestión de Inscripciones](routes.md#gestión-de-inscripciones-registrations)** - CRUD completo de registros

## 📚 Documentación Detallada

### 🛣️ **Rutas y APIs**
**[📄 routes.md](routes.md)** - Documentación completa de todas las rutas, parámetros, respuestas y uso de APIs

### 🎮 **Controladores**
**[📄 controllers.md](controllers.md)** - Documentación detallada de todos los controladores admin

### 📝 **Form Requests**
**[📄 requests.md](requests.md)** - Validaciones, reglas y mensajes de error de los Form Requests

### 🗄️ **Modelos y Datos**
**[📄 models.md](models.md)** - Estados, constantes, relaciones de base de datos

### 🔒 **Seguridad**
**[📄 security.md](security.md)** - Consideraciones de seguridad y mejores prácticas

### 📁 **Archivos**
**[📄 files.md](files.md)** - Manejo de uploads, imágenes y archivos

### ⚡ **Rendimiento**
**[📄 performance.md](performance.md)** - Optimizaciones y consideraciones de rendimiento

## 🚀 Inicio Rápido

### Para Administradores
1. Accede a `/admin` después de iniciar sesión
2. Gestiona juegos, torneos e inscripciones desde el panel
3. Consulta la [documentación de rutas](routes.md) para entender todas las funcionalidades

### Para Desarrolladores
1. Revisa las [rutas disponibles](routes.md) para integración
2. Consulta los [controladores](controllers.md) para lógica de negocio
3. Revisa las [validaciones](requests.md) para Form Requests

## 🔧 Tecnologías Utilizadas

- **Backend**: Laravel 11
- **Frontend**: React + Inertia.js
- **Base de Datos**: SQLite/MySQL
- **Autenticación**: Laravel Sanctum/Breeze
- **Validación**: Form Requests personalizados
- **File Uploads**: Laravel Storage

## 📊 Estadísticas del Sistema

- **4 Controladores** principales
- **6 Form Request** classes
- **15+ Rutas** admin
- **Gestión completa** de juegos, torneos e inscripciones

---

**📖 Para más detalles, consulta los archivos específicos de documentación.**

Última actualización: Septiembre 2025</content>
<parameter name="filePath">c:\Users\Miguel\Code\GODCODE\TODO\vulca-torneos\DOCS\admin\README.md