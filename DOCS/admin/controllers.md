# 🎮 Controladores Admin

## 📋 Resumen

Documentación completa de todos los controladores del sistema admin, incluyendo métodos, responsabilidades, validaciones y lógica de negocio.

## 🏗️ Arquitectura General

### Namespace
- **Base**: `App\Http\Controllers\Admin`
- **Herencia**: Todos extienden `Controller`
- **Middleware**: `auth`, `admin` aplicado globalmente

### Patrón de Diseño
- **Resource Controllers**: Siguen el patrón RESTful de Laravel
- **Single Responsibility**: Cada controlador maneja una entidad específica
- **Inertia.js Integration**: Devuelven vistas React a través de Inertia

---

## 🏠 AdminController

### Ubicación
`app/Http/Controllers/Admin/AdminController.php`

### Responsabilidades
- Dashboard principal del administrador
- Estadísticas generales del sistema
- Punto de entrada al panel admin

### Métodos

#### `index()`
```php
public function index(): Response
{
    return Inertia::render('Dashboard', [
        'stats' => $this->getDashboardStats(),
        'recentActivity' => $this->getRecentActivity()
    ]);
}
```

**Funciones auxiliares:**
- `getDashboardStats()`: Estadísticas generales
- `getRecentActivity()`: Actividad reciente del sistema

---

## 🎮 AdminGamesController

### Ubicación
`app/Http/Controllers/Admin/AdminGamesController.php`

### Responsabilidades
- Gestión completa del CRUD de juegos
- Manejo de imágenes de juegos
- Validación de datos de juegos
- Relaciones con torneos e inscripciones

### Métodos Principales

#### `index()`
```php
public function index(): Response
{
    $games = Game::with(['tournaments', 'registrations'])
                ->withCount(['tournaments', 'registrations'])
                ->paginate(15);

    return Inertia::render('Admin/Games/Index', compact('games'));
}
```

#### `create()`
```php
public function create(): Response
{
    return Inertia::render('Admin/Games/Create');
}
```

#### `store(StoreGameRequest $request)`
```php
public function store(StoreGameRequest $request): RedirectResponse
{
    $validated = $request->validated();

    if ($request->hasFile('image')) {
        $validated['image_path'] = $request->file('image')
            ->store('games', 'public');
    }

    Game::create($validated);

    return redirect()->route('admin.games.index')
                    ->with('success', 'Juego creado con éxito');
}
```

#### `show(Game $game)`
```php
public function show(Game $game): Response
{
    $game->load(['tournaments.registrations', 'registrations.user']);

    $tournaments = $game->tournaments()
                       ->withCount('registrations')
                       ->get();

    $pendingRegistrations = $game->registrations()
                                ->where('payment_status', 'pending')
                                ->with('user', 'tournament')
                                ->get();

    return Inertia::render('Admin/Games/Show', compact(
        'game', 'tournaments', 'pendingRegistrations'
    ));
}
```

#### `edit(Game $game)`
```php
public function edit(Game $game): Response
{
    return Inertia::render('Admin/Games/Edit', compact('game'));
}
```

#### `update(UpdateGameRequest $request, Game $game)`
```php
public function update(UpdateGameRequest $request, Game $game): RedirectResponse
{
    $validated = $request->validated();

    if ($request->hasFile('image')) {
        // Eliminar imagen anterior si existe
        if ($game->image_path) {
            Storage::disk('public')->delete($game->image_path);
        }
        $validated['image_path'] = $request->file('image')
            ->store('games', 'public');
    }

    $game->update($validated);

    return redirect()->route('admin.games.index')
                    ->with('success', 'Juego actualizado exitosamente');
}
```

#### `destroy(Game $game)`
```php
public function destroy(Game $game): RedirectResponse
{
    // Verificar dependencias
    if ($game->tournaments()->exists()) {
        return redirect()->back()
                        ->with('error', 'No se puede eliminar un juego con torneos asociados');
    }

    // Eliminar imagen si existe
    if ($game->image_path) {
        Storage::disk('public')->delete($game->image_path);
    }

    $game->delete();

    return redirect()->route('admin.games.index')
                    ->with('success', 'Juego eliminado exitosamente');
}
```

---

## 🏆 AdminTournamentController

### Ubicación
`app/Http/Controllers/Admin/AdminTournamentController.php`

### Responsabilidades
- Gestión completa del CRUD de torneos
- Manejo de límites de registro
- Validación de fechas y capacidad
- Relaciones con juegos e inscripciones

### Métodos Principales

#### `index()`
```php
public function index(): Response
{
    $tournaments = Tournament::with('game')
                            ->withCount('registrations')
                            ->orderBy('created_at', 'desc')
                            ->paginate(15);

    $games = Game::select('id', 'name')->get();

    return Inertia::render('Admin/Tournaments/Index', compact('tournaments', 'games'));
}
```

#### `create()`
```php
public function create(): Response
{
    $games = Game::select('id', 'name')->get();

    return Inertia::render('Admin/Tournaments/Create', compact('games'));
}
```

#### `store(StoreTournamentRequest $request)`
```php
public function store(StoreTournamentRequest $request): RedirectResponse
{
    $validated = $request->validated();

    // Convertir fechas a instancias de Carbon si es necesario
    if (isset($validated['start_date'])) {
        $validated['start_date'] = Carbon::parse($validated['start_date']);
    }
    if (isset($validated['end_date'])) {
        $validated['end_date'] = Carbon::parse($validated['end_date']);
    }

    Tournament::create($validated);

    return redirect()->route('admin.tournaments.index')
                    ->with('success', 'Torneo creado exitosamente');
}
```

#### `show(Tournament $tournament)`
```php
public function show(Tournament $tournament): Response
{
    $tournament->load(['game', 'registrations.user']);

    $registrations = $tournament->registrations()
                               ->with('user')
                               ->orderBy('created_at', 'desc')
                               ->get();

    return Inertia::render('Admin/Tournaments/Show', compact('tournament', 'registrations'));
}
```

#### `edit(Tournament $tournament)`
```php
public function edit(Tournament $tournament): Response
{
    $games = Game::select('id', 'name')->get();

    return Inertia::render('Admin/Tournaments/Edit', compact('tournament', 'games'));
}
```

#### `update(UpdateTournamentRequest $request, Tournament $tournament)`
```php
public function update(UpdateTournamentRequest $request, Tournament $tournament): RedirectResponse
{
    $validated = $request->validated();

    // Manejo de fechas
    if (isset($validated['start_date'])) {
        $validated['start_date'] = Carbon::parse($validated['start_date']);
    }
    if (isset($validated['end_date'])) {
        $validated['end_date'] = Carbon::parse($validated['end_date']);
    }

    $tournament->update($validated);

    return redirect()->route('admin.tournaments.index')
                    ->with('success', 'Torneo actualizado exitosamente');
}
```

#### `destroy(Tournament $tournament)`
```php
public function destroy(Tournament $tournament): RedirectResponse
{
    // Verificar si hay inscripciones activas
    if ($tournament->registrations()->where('payment_status', 'paid')->exists()) {
        return redirect()->back()
                        ->with('error', 'No se puede eliminar un torneo con inscripciones pagadas');
    }

    $tournament->delete();

    return redirect()->route('admin.tournaments.index')
                    ->with('success', 'Torneo eliminado exitosamente');
}
```

---

## 📝 AdminRegistrationController

### Ubicación
`app/Http/Controllers/Admin/AdminRegistrationController.php`

### Responsabilidades
- Gestión completa del CRUD de inscripciones
- Manejo de estados de pago
- Validación de capacidad de torneos
- Relaciones con usuarios y torneos

### Métodos Principales

#### `index()`
```php
public function index(): Response
{
    $registrations = Registration::with(['user', 'tournament.game'])
                                ->orderBy('created_at', 'desc')
                                ->paginate(15);

    $tournaments = Tournament::select('id', 'name')->get();
    $users = User::select('id', 'name', 'email')->get();

    return Inertia::render('Admin/Registrations/Index', compact(
        'registrations', 'tournaments', 'users'
    ));
}
```

#### `create()`
```php
public function create(): Response
{
    $tournaments = Tournament::with('game')
                            ->where('registration_limit', '>', 0)
                            ->orWhereNull('registration_limit')
                            ->get();

    $users = User::select('id', 'name', 'email')->get();

    return Inertia::render('Admin/Registrations/Create', compact('tournaments', 'users'));
}
```

#### `store(StoreRegistrationRequest $request)`
```php
public function store(StoreRegistrationRequest $request): RedirectResponse
{
    $validated = $request->validated();

    // Verificar límite de registros si existe
    $tournament = Tournament::find($validated['tournament_id']);
    if ($tournament->registration_limit) {
        $currentRegistrations = $tournament->registrations()->count();
        if ($currentRegistrations >= $tournament->registration_limit) {
            return redirect()->back()
                            ->with('error', 'El torneo ha alcanzado su límite de inscripciones');
        }
    }

    Registration::create($validated);

    return redirect()->route('admin.registrations.index')
                    ->with('success', 'Inscripción creada exitosamente');
}
```

#### `show(Registration $registration)`
```php
public function show(Registration $registration): Response
{
    $registration->load(['user', 'tournament.game']);

    return Inertia::render('Admin/Registrations/Show', compact('registration'));
}
```

#### `edit(Registration $registration)`
```php
public function edit(Registration $registration): Response
{
    return Inertia::render('Admin/Registrations/Edit', compact('registration'));
}
```

#### `update(UpdateRegistrationRequest $request, Registration $registration)`
```php
public function update(UpdateRegistrationRequest $request, Registration $registration): RedirectResponse
{
    $validated = $request->validated();

    $registration->update($validated);

    return redirect()->route('admin.registrations.index')
                    ->with('success', 'Inscripción actualizada exitosamente');
}
```

#### `destroy(Registration $registration)`
```php
public function destroy(Registration $registration): RedirectResponse
{
    $registration->delete();

    return redirect()->route('admin.registrations.index')
                    ->with('success', 'Inscripción eliminada exitosamente');
}
```

---

## 🔧 Funcionalidades Comunes

### Manejo de Imágenes
```php
// Almacenamiento
$path = $request->file('image')->store('games', 'public');

// Eliminación
Storage::disk('public')->delete($oldPath);
```

### Validación de Dependencias
```php
// Verificar torneos antes de eliminar juego
if ($game->tournaments()->exists()) {
    return back()->with('error', 'No se puede eliminar...');
}
```

### Carga Eager de Relaciones
```php
$game->load(['tournaments.registrations', 'registrations.user']);
```

### Paginación Estándar
```php
$items = Model::paginate(15);
```

---

## 🛡️ Validaciones y Seguridad

### Autorización
- Todos los métodos requieren autenticación
- Middleware `admin` aplicado globalmente
- Verificación de propiedad en operaciones sensibles

### Validación de Datos
- Form Request classes para todas las operaciones
- Mensajes de error en español
- Validación tanto frontend como backend

### Manejo de Errores
- Redirecciones con mensajes de error
- Logging de operaciones críticas
- Rollback en transacciones complejas

---

**📖 Ver también**: [Rutas](../routes.md) | [Form Requests](../requests.md) | [Modelos](../models.md)</content>
<parameter name="filePath">c:\Users\Miguel\Code\GODCODE\TODO\vulca-torneos\DOCS\admin\controllers.md