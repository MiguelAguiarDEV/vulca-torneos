# 🔒 Seguridad - Sistema Admin

## 📋 Resumen

Documentación completa de las medidas de seguridad implementadas en el sistema admin de Vulca Torneos, incluyendo autenticación, autorización, validación y protección de datos.

## 🏗️ Arquitectura de Seguridad

### Principios Básicos
- **Autenticación**: Sistema de login basado en Laravel Sanctum
- **Autorización**: Middleware personalizado para control de acceso admin
- **Validación**: Validación tanto frontend como backend
- **Protección**: CSRF, XSS, SQL Injection prevention

---

## 🔐 Autenticación

### Sistema de Login
- **Framework**: Laravel Sanctum para SPA authentication
- **Sesiones**: Manejo automático de sesiones
- **Tokens**: API tokens para acceso programático

### Middleware de Autenticación
```php
// En routes/web.php
Route::middleware(['auth'])->group(function () {
    Route::prefix('admin')->middleware(['admin'])->group(function () {
        // Rutas admin protegidas
    });
});
```

### Verificación de Usuario Admin
```php
// En User.php
public function isAdmin(): bool
{
    return $this->role === self::ROLE_ADMIN;
}
```

---

## 🛡️ Autorización

### Middleware Admin

#### Ubicación
`app/Http/Middleware/AdminMiddleware.php`

#### Lógica de Autorización
```php
public function handle(Request $request, Closure $next): Response
{
    if (!auth()->check()) {
        return redirect()->route('login');
    }

    if (!auth()->user()->isAdmin()) {
        abort(403, 'Acceso denegado. Se requieren permisos de administrador.');
    }

    return $next($request);
}
```

#### Registro del Middleware
```php
// En bootstrap/app.php o app/Http/Kernel.php
protected $middlewareAliases = [
    'admin' => \App\Http\Middleware\AdminMiddleware::class,
];
```

### Control de Acceso por Método
```php
// En controladores
public function __construct()
{
    $this->middleware('admin'); // Aplicado a todos los métodos
}
```

---

## ✅ Validación de Datos

### Validación en Múltiples Capas

#### 1. Form Requests (Backend)
```php
// Validación estricta con mensajes personalizados
public function rules(): array
{
    return [
        'name' => 'required|string|max:255|unique:games,name',
        'email' => 'required|email|unique:users,email',
    ];
}
```

#### 2. Validación Frontend
```javascript
// En componentes React (Inertia.js)
const [errors, setErrors] = useState({});

const submit = async (data) => {
    try {
        await router.post('/admin/games', data);
    } catch (error) {
        setErrors(error.response.data.errors);
    }
};
```

#### 3. Validación a Nivel de Base de Datos
```sql
-- Constraints en la base de datos
ALTER TABLE games ADD CONSTRAINT unique_game_name UNIQUE (name);
ALTER TABLE users ADD CONSTRAINT check_role CHECK (role IN ('admin', 'user'));
```

### Sanitización de Datos
```php
// En Form Requests
public function prepareForValidation()
{
    $this->merge([
        'name' => strip_tags($this->name),
        'description' => strip_tags($this->description),
    ]);
}
```

---

## 🔒 Protección contra Ataques Comunes

### CSRF Protection
- **Automático**: Laravel incluye protección CSRF en todos los formularios
- **Tokens**: `@csrf` directive en Blade templates
- **Verificación**: Automática en rutas POST, PUT, DELETE

### XSS Prevention
- **Blade**: Auto-escaping de variables `{{ $variable }}`
- **Sanitización**: `strip_tags()` en inputs críticos
- **Validación**: Reglas de validación restrictivas

### SQL Injection Prevention
- **Eloquent ORM**: Consultas parametrizadas automáticamente
- **Query Builder**: Bindings automáticos
- **Raw Queries**: Uso de bindings cuando es necesario

```php
// Seguro - Eloquent
$user = User::where('email', $email)->first();

// Seguro - Query Builder
DB::select('SELECT * FROM users WHERE email = ?', [$email]);
```

### Mass Assignment Protection
```php
// En modelos
protected $fillable = ['name', 'email', 'role'];

// Previene asignación masiva de campos sensibles
$user = User::create($request->all()); // Solo campos fillable
```

---

## 📁 Gestión de Archivos Segura

### Validación de Imágenes
```php
// En Form Requests
'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
```

### Almacenamiento Seguro
```php
// Configuración de disco público
'public' => [
    'driver' => 'local',
    'root' => storage_path('app/public'),
    'url' => env('APP_URL').'/storage',
    'visibility' => 'public',
],
```

### Eliminación Segura de Archivos
```php
// Verificar existencia antes de eliminar
if ($game->image_path && Storage::disk('public')->exists($game->image_path)) {
    Storage::disk('public')->delete($game->image_path);
}
```

### Nombres de Archivo Seguros
```php
// Laravel genera nombres únicos automáticamente
$path = $request->file('image')->store('games', 'public');
// Resultado: games/abc123def456.jpg
```

---

## 🚨 Manejo de Errores y Logging

### Logging de Operaciones Sensibles
```php
// En controladores admin
Log::info('Game created', [
    'game_id' => $game->id,
    'admin_id' => auth()->id(),
    'ip' => request()->ip()
]);
```

### Manejo de Excepciones
```php
// En app/Exceptions/Handler.php
public function render($request, Throwable $exception)
{
    if ($exception instanceof AuthorizationException) {
        return response()->view('errors.403', [], 403);
    }

    return parent::render($request, $exception);
}
```

### Rate Limiting
```php
// En rutas admin
Route::middleware(['throttle:60,1'])->group(function () {
    // Rutas limitadas a 60 requests por minuto
});
```

---

## 🔐 Gestión de Sesiones

### Configuración de Sesión
```php
// En config/session.php
'lifetime' => env('SESSION_LIFETIME', 120), // 2 horas
'secure' => env('SESSION_SECURE_COOKIE', false),
'http_only' => true,
'same_site' => 'lax',
```

### Invalidación de Sesiones
```php
// Al cambiar contraseña
auth()->logoutOtherDevices($newPassword);

// Al logout
auth()->logout();
Session::invalidate();
```

---

## 🛡️ Validaciones de Negocio

### Verificación de Dependencias
```php
// Antes de eliminar un juego
if ($game->tournaments()->exists()) {
    return back()->with('error', 'No se puede eliminar un juego con torneos asociados');
}
```

### Límites de Capacidad
```php
// Verificar límite de registros
if ($tournament->registration_limit) {
    $currentCount = $tournament->registrations()->count();
    if ($currentCount >= $tournament->registration_limit) {
        throw new Exception('Tournament is full');
    }
}
```

### Estados Válidos
```php
// En Registration.php
const PAYMENT_PENDING = 'pending';
const PAYMENT_PAID = 'paid';
const PAYMENT_CANCELLED = 'cancelled';
```

---

## 📊 Auditoría y Monitoreo

### Logging de Cambios
```php
// En modelos (usando eventos)
protected static function booted()
{
    static::created(function ($model) {
        Log::info(get_class($model) . ' created', [
            'id' => $model->id,
            'attributes' => $model->getAttributes(),
            'admin_id' => auth()->id()
        ]);
    });
}
```

### Monitoreo de Actividad
```php
// Middleware para logging de requests
public function handle($request, Closure $next)
{
    $start = microtime(true);

    $response = $next($request);

    $duration = microtime(true) - $start;

    Log::info('Admin request', [
        'method' => $request->method(),
        'url' => $request->fullUrl(),
        'duration' => round($duration * 1000, 2) . 'ms',
        'user_id' => auth()->id(),
        'ip' => $request->ip()
    ]);

    return $response;
}
```

---

## 🚫 Lista de Verificación de Seguridad

### Antes de Despliegue
- [ ] Middleware admin aplicado a todas las rutas
- [ ] Validación en todos los Form Requests
- [ ] Protección CSRF habilitada
- [ ] Mass assignment protegido
- [ ] Logs de operaciones sensibles implementados
- [ ] Rate limiting configurado
- [ ] HTTPS forzado en producción
- [ ] Variables de entorno sensibles protegidas

### En Desarrollo
- [ ] Revisar permisos de archivos
- [ ] Validar configuración de CORS
- [ ] Verificar configuración de sesiones
- [ ] Probar manejo de errores
- [ ] Validar sanitización de inputs

---

## 🔧 Configuraciones de Seguridad

### Variables de Entorno
```env
# Seguridad
APP_ENV=production
APP_DEBUG=false
SESSION_SECURE_COOKIE=true
SANCTUM_STATEFUL_DOMAINS=yourdomain.com
```

### Headers de Seguridad
```php
// En middleware
$response->headers->set('X-Frame-Options', 'SAMEORIGIN');
$response->headers->set('X-Content-Type-Options', 'nosniff');
$response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
```

---

**📖 Ver también**: [Controladores](../controllers.md) | [Form Requests](../requests.md) | [Rutas](../routes.md)</content>
<parameter name="filePath">c:\Users\Miguel\Code\GODCODE\TODO\vulca-torneos\DOCS\admin\security.md