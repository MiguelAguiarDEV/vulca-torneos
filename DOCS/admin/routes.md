# 🛣️ Rutas y APIs - Sistema Admin

## 📋 Resumen

Documentación completa de todas las rutas del sistema admin de Vulca Torneos, incluyendo parámetros, respuestas, controladores y vistas.

## 🏗️ Estructura General

### Prefijo Base
- **URL Base**: `/admin`
- **Middleware**: `auth`, `admin`
- **Framework**: Laravel con Inertia.js

### Patrón RESTful
Todas las rutas siguen el patrón RESTful estándar de Laravel.

---

## 🏠 Dashboard Admin

### GET `/admin`
- **Controlador**: `Admin\AdminController@index`
- **Nombre de ruta**: `dashboard.index`
- **Descripción**: Muestra el dashboard principal del administrador
- **Método**: `index()`
- **Respuesta**: Vista `Dashboard` (Inertia.js)
- **Validaciones**: Autenticación y permisos de admin

---

## 🎮 Gestión de Juegos (Games)

### GET `/admin/games`
- **Controlador**: `Admin\AdminGamesController@index`
- **Nombre**: `admin.games.index`
- **Descripción**: Lista todos los juegos del sistema
- **Método**: `index()`
- **Datos devueltos**:
  ```php
  [
      'games' => Collection<Game> // Todos los juegos
  ]
  ```
- **Vista**: `Admin/Games/Index`

### GET `/admin/games/create`
- **Controlador**: `Admin\AdminGamesController@create`
- **Nombre**: `admin.games.create`
- **Descripción**: Formulario para crear nuevo juego
- **Vista**: `Admin/Games/Create`

### POST `/admin/games`
- **Controlador**: `Admin\AdminGamesController@store`
- **Nombre**: `admin.games.store`
- **Descripción**: Crea un nuevo juego
- **Parámetros**: Ver [StoreGameRequest](../requests.md#storegamerequest)
- **Respuesta**: Redirección a `admin.games.index` con éxito
- **Errores**: Redirección con errores de validación

### GET `/admin/games/{game}`
- **Controlador**: `Admin\AdminGamesController@show`
- **Nombre**: `admin.games.show`
- **Descripción**: Muestra detalles de un juego específico
- **Parámetros**: `game` (ID del juego)
- **Datos devueltos**:
  ```php
  [
      'game' => Game,
      'tournaments' => Collection<Tournament>,
      'pendingRegistrations' => Collection<Registration>
  ]
  ```
- **Vista**: `Admin/Games/Show`

### GET `/admin/games/{game}/edit`
- **Controlador**: `Admin\AdminGamesController@edit`
- **Nombre**: `admin.games.edit`
- **Descripción**: Formulario para editar juego
- **Parámetros**: `game` (ID del juego)
- **Vista**: `Admin/Games/Edit`

### PUT/PATCH `/admin/games/{game}`
- **Controlador**: `Admin\AdminGamesController@update`
- **Nombre**: `admin.games.update`
- **Descripción**: Actualiza un juego existente
- **Parámetros**: `game` (ID) + Ver [UpdateGameRequest](../requests.md#updategamerequest)
- **Respuesta**: Redirección a `admin.games.index` con éxito

### DELETE `/admin/games/{game}`
- **Controlador**: `Admin\AdminGamesController@destroy`
- **Nombre**: `admin.games.destroy`
- **Descripción**: Elimina un juego
- **Parámetros**: `game` (ID del juego)
- **Respuesta**: Redirección a `admin.games.index` con éxito

---

## 🏆 Gestión de Torneos (Tournaments)

### GET `/admin/tournaments`
- **Controlador**: `Admin\AdminTournamentController@index`
- **Nombre**: `admin.tournaments.index`
- **Descripción**: Lista todos los torneos
- **Datos devueltos**:
  ```php
  [
      'tournaments' => Collection<Tournament>, // Con conteos
      'games' => Collection<Game> // Para filtros
  ]
  ```
- **Vista**: `Admin/Tournaments/Index`

### GET `/admin/tournaments/create`
- **Controlador**: `Admin\AdminTournamentController@create`
- **Nombre**: `admin.tournaments.create`
- **Descripción**: Formulario para crear torneo
- **Vista**: `Admin/Tournaments/Create`

### POST `/admin/tournaments`
- **Controlador**: `Admin\AdminTournamentController@store`
- **Nombre**: `admin.tournaments.store`
- **Descripción**: Crea un nuevo torneo
- **Parámetros**: Ver [StoreTournamentRequest](../requests.md#storetournamentrequest)
- **Respuesta**: Redirección a `admin.tournaments.index`

### GET `/admin/tournaments/{tournament}`
- **Controlador**: `Admin\AdminTournamentController@show`
- **Nombre**: `admin.tournaments.show`
- **Descripción**: Muestra detalles del torneo
- **Parámetros**: `tournament` (ID)
- **Datos devueltos**:
  ```php
  [
      'tournament' => Tournament,
      'registrations' => Collection<Registration>
  ]
  ```
- **Vista**: `Admin/Tournaments/Show`

### GET `/admin/tournaments/{tournament}/edit`
- **Controlador**: `Admin\AdminTournamentController@edit`
- **Nombre**: `admin.tournaments.edit`
- **Descripción**: Formulario para editar torneo
- **Vista**: `Admin/Tournaments/Edit`

### PUT/PATCH `/admin/tournaments/{tournament}`
- **Controlador**: `Admin\AdminTournamentController@update`
- **Nombre**: `admin.tournaments.update`
- **Descripción**: Actualiza torneo existente
- **Parámetros**: `tournament` (ID) + Ver [UpdateTournamentRequest](../requests.md#updatetournamentrequest)
- **Respuesta**: Redirección a `admin.tournaments.index`

### DELETE `/admin/tournaments/{tournament}`
- **Controlador**: `Admin\AdminTournamentController@destroy`
- **Nombre**: `admin.tournaments.destroy`
- **Descripción**: Elimina un torneo
- **Parámetros**: `tournament` (ID)
- **Respuesta**: Redirección a `admin.tournaments.index`

---

## 📝 Gestión de Inscripciones (Registrations)

### GET `/admin/registrations`
- **Controlador**: `Admin\AdminRegistrationController@index`
- **Nombre**: `admin.registrations.index`
- **Descripción**: Lista todas las inscripciones
- **Datos devueltos**:
  ```php
  [
      'registrations' => Collection<Registration>,
      'tournaments' => Collection<Tournament>,
      'users' => Collection<User>
  ]
  ```
- **Vista**: `Admin/Registrations/Index`

### GET `/admin/registrations/create`
- **Controlador**: `Admin\AdminRegistrationController@create`
- **Nombre**: `admin.registrations.create`
- **Descripción**: Formulario para crear inscripción
- **Vista**: `Admin/Registrations/Create`

### POST `/admin/registrations`
- **Controlador**: `Admin\AdminRegistrationController@store`
- **Nombre**: `admin.registrations.store`
- **Descripción**: Crea una nueva inscripción
- **Parámetros**: Ver [StoreRegistrationRequest](../requests.md#storeregistrationrequest)
- **Respuesta**: Redirección con mensaje de éxito

### GET `/admin/registrations/{registration}`
- **Controlador**: `Admin\AdminRegistrationController@show`
- **Nombre**: `admin.registrations.show`
- **Descripción**: Muestra detalles de inscripción
- **Parámetros**: `registration` (ID)
- **Datos devueltos**:
  ```php
  ['registration' => Registration]
  ```
- **Vista**: `Admin/Registrations/Show`

### GET `/admin/registrations/{registration}/edit`
- **Controlador**: `Admin\AdminRegistrationController@edit`
- **Nombre**: `admin.registrations.edit`
- **Descripción**: Formulario para editar inscripción
- **Vista**: `Admin/Registrations/Edit`

### PUT/PATCH `/admin/registrations/{registration}`
- **Controlador**: `Admin\AdminRegistrationController@update`
- **Nombre**: `admin.registrations.update`
- **Descripción**: Actualiza estado de pago
- **Parámetros**: `registration` (ID) + Ver [UpdateRegistrationRequest](../requests.md#updateregistrationrequest)
- **Respuesta**: Redirección con mensaje de éxito

### DELETE `/admin/registrations/{registration}`
- **Controlador**: `Admin\AdminRegistrationController@destroy`
- **Nombre**: `admin.registrations.destroy`
- **Descripción**: Elimina una inscripción
- **Parámetros**: `registration` (ID)
- **Respuesta**: Redirección con mensaje de éxito

---

## 🔄 Flujos de Trabajo Típicos

### Crear un Juego Nuevo
1. `GET /admin/games/create` - Mostrar formulario
2. `POST /admin/games` - Crear juego
3. Redirección a `GET /admin/games` - Listar juegos

### Gestionar Torneo Completo
1. `GET /admin/tournaments/create` - Crear torneo
2. `POST /admin/tournaments` - Guardar torneo
3. `GET /admin/tournaments/{id}` - Ver detalles
4. `GET /admin/registrations` - Gestionar inscripciones

### Procesar Inscripción
1. `GET /admin/registrations/create` - Nueva inscripción
2. `POST /admin/registrations` - Crear inscripción
3. `PUT /admin/registrations/{id}` - Actualizar pago
4. `GET /admin/registrations/{id}` - Ver detalles

---

## 📊 Respuestas y Estados

### Respuestas Exitosas
- **Redirección**: `redirect()->route()->with('success', 'Mensaje')`
- **Vista**: `Inertia::render('Vista', $data)`

### Respuestas de Error
- **Validación**: Redirección con errores
- **Autorización**: HTTP 403
- **No encontrado**: HTTP 404

### Mensajes de Éxito
- "Juego creado con éxito"
- "Torneo actualizado exitosamente"
- "Inscripción creada exitosamente"

---

**📖 Ver también**: [Controladores](../controllers.md) | [Form Requests](../requests.md) | [Modelos](../models.md)</content>
<parameter name="filePath">c:\Users\Miguel\Code\GODCODE\TODO\vulca-torneos\DOCS\admin\routes.md