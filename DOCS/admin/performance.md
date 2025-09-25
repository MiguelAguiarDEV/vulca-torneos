# ⚡ Rendimiento y Optimización - Sistema Admin

## 📋 Resumen

Documentación completa de estrategias de optimización de rendimiento implementadas en el sistema admin, incluyendo consultas, carga de datos, caching y monitoreo.

## 🏗️ Optimización de Base de Datos

### Carga Eager de Relaciones

#### Problema: N+1 Queries
```php
// INEFICIENTE - N+1 queries
$tournaments = Tournament::all(); // 1 query
foreach ($tournaments as $tournament) {
    $registrations = $tournament->registrations; // N queries
}
```

#### Solución: Eager Loading
```php
// EFICIENTE - 2 queries total
$tournaments = Tournament::with('registrations')->get();
```

#### En Controladores Admin
```php
// AdminGamesController@show
$game->load(['tournaments.registrations', 'registrations.user']);

// AdminTournamentsController@index
$tournaments = Tournament::with('game')
                        ->withCount('registrations')
                        ->paginate(15);
```

### Selects Específicos

#### Evitar Select *
```php
// INEFICIENTE
$users = User::all(); // Selecciona todas las columnas

// EFICIENTE
$users = User::select('id', 'name', 'email')->get();
```

#### En Listados Admin
```php
// Para dropdowns
$games = Game::select('id', 'name')->get();

// Para listados con conteos
$tournaments = Tournament::select(['id', 'name', 'game_id', 'is_active'])
                        ->with('game:id,name')
                        ->withCount('registrations')
                        ->paginate(15);
```

### Indexing Estratégico

#### Índices Recomendados
```sql
-- Índices para búsquedas frecuentes
CREATE INDEX idx_games_is_active ON games(is_active);
CREATE INDEX idx_tournaments_game_id ON tournaments(game_id);
CREATE INDEX idx_tournaments_is_active ON tournaments(is_active);
CREATE INDEX idx_registrations_tournament_id ON registrations(tournament_id);
CREATE INDEX idx_registrations_user_id ON registrations(user_id);
CREATE INDEX idx_registrations_payment_status ON registrations(payment_status);

-- Índice compuesto para filtrado complejo
CREATE INDEX idx_registrations_tournament_status ON registrations(tournament_id, payment_status);
```

#### Verificación de Índices
```sql
-- Ver índices existentes
SHOW INDEX FROM tournaments;

-- Analizar uso de índices
EXPLAIN SELECT * FROM tournaments WHERE game_id = 1 AND is_active = 1;
```

---

## 🚀 Optimización de Consultas

### Paginación Eficiente

#### Configuración Óptima
```php
// En controladores
$games = Game::with(['tournaments', 'registrations'])
            ->withCount(['tournaments', 'registrations'])
            ->orderBy('created_at', 'desc')
            ->paginate(15); // 15 items por página
```

#### Paginación con Filtros
```php
public function index(Request $request)
{
    $query = Tournament::with('game')->withCount('registrations');

    // Filtros condicionales
    if ($request->filled('game_id')) {
        $query->where('game_id', $request->game_id);
    }

    if ($request->filled('status')) {
        $query->where('is_active', $request->boolean('status'));
    }

    return $query->paginate(15);
}
```

### Scopes para Reutilización

#### Scopes en Modelos
```php
// En Tournament.php
public function scopeActive($query)
{
    return $query->where('is_active', true);
}

public function scopeAvailable($query)
{
    return $query->where('is_active', true)
                ->where(function ($q) {
                    $q->whereNull('start_date')
                      ->orWhere('start_date', '<=', now());
                })
                ->where(function ($q) {
                    $q->whereNull('end_date')
                      ->orWhere('end_date', '>=', now());
                });
}

// Uso en controladores
$activeTournaments = Tournament::active()->get();
$availableTournaments = Tournament::available()->paginate(15);
```

### Chunking para Grandes Datasets

#### Procesamiento por Lotes
```php
// Para exportaciones o procesos masivos
Tournament::chunk(100, function ($tournaments) {
    foreach ($tournaments as $tournament) {
        // Procesar cada lote
        $this->processTournament($tournament);
    }
});
```

---

## 💾 Sistema de Caching

### Cache de Configuración

#### Cache de Queries Frecuentes
```php
// Cache de juegos activos (válido por 1 hora)
$activeGames = Cache::remember('active_games', 3600, function () {
    return Game::active()->select('id', 'name')->get();
});

// Cache de estadísticas del dashboard
$stats = Cache::remember('admin_dashboard_stats', 1800, function () {
    return [
        'total_games' => Game::count(),
        'total_tournaments' => Tournament::count(),
        'total_registrations' => Registration::count(),
        'pending_payments' => Registration::pending()->count(),
    ];
});
```

### Cache de Vistas

#### Cache de Componentes Estáticos
```php
// En controladores que renderizan vistas estáticas
return response()->view('admin.dashboard')
                ->header('Cache-Control', 'public, max-age=300'); // 5 minutos
```

### Invalidación de Cache

#### Estrategias de Invalidación
```php
// Al crear/actualizar/eliminar juegos
Cache::forget('active_games');
Cache::forget('admin_dashboard_stats');

// Usando eventos de modelo
class Game extends Model
{
    protected static function booted()
    {
        static::saved(function () {
            Cache::forget('active_games');
        });

        static::deleted(function () {
            Cache::forget('active_games');
        });
    }
}
```

---

## ⚡ Optimización de Frontend

### Lazy Loading de Imágenes

#### Implementación en React
```jsx
// Componente de imagen optimizada
const OptimizedImage = ({ src, alt, className }) => {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);

    return (
        <div className="image-container">
            {!loaded && <div className="image-placeholder" />}
            <img
                src={src}
                alt={alt}
                className={`${className} ${loaded ? 'loaded' : 'loading'}`}
                onLoad={() => setLoaded(true)}
                onError={() => setError(true)}
                loading="lazy"
            />
        </div>
    );
};
```

### Code Splitting

#### División de Bundles
```javascript
// En routes/admin.js (ejemplo con React Router)
const AdminGames = lazy(() => import('./pages/admin/Games/Index'));
const AdminTournaments = lazy(() => import('./pages/admin/Tournaments/Index'));

// Con Suspense para loading
<Suspense fallback={<div>Loading...</div>}>
    <Routes>
        <Route path="/admin/games" element={<AdminGames />} />
        <Route path="/admin/tournaments" element={<AdminTournaments />} />
    </Routes>
</Suspense>
```

### Virtual Scrolling para Listas Largas

#### Para tablas con muchos registros
```jsx
// Usando react-window o similar
import { FixedSizeList as List } from 'react-window';

const GamesList = ({ games }) => (
    <List
        height={400}
        itemCount={games.length}
        itemSize={50}
    >
        {({ index, style }) => (
            <div style={style}>
                {games[index].name}
            </div>
        )}
    </List>
);
```

---

## 📊 Monitoreo y Profiling

### Laravel Debugbar

#### Instalación y Configuración
```bash
composer require barryvdh/laravel-debugbar --dev
```

#### Métricas Disponibles
- **Queries**: Número y tiempo de consultas SQL
- **Memory**: Uso de memoria
- **Time**: Tiempo de ejecución
- **Routes**: Información de rutas
- **Views**: Renderizado de vistas

#### Uso en Desarrollo
```php
// En controladores para debugging
Debugbar::info('Processing games list');
Debugbar::timeStart('game_query');
$games = Game::with('tournaments')->get();
Debugbar::timeEnd('game_query');
```

### Logging de Rendimiento

#### Middleware de Profiling
```php
class PerformanceMiddleware
{
    public function handle($request, Closure $next)
    {
        $start = microtime(true);
        $startMemory = memory_get_usage();

        $response = $next($request);

        $duration = microtime(true) - $start;
        $memoryUsed = memory_get_peak_usage() - $startMemory;

        Log::info('Performance', [
            'url' => $request->fullUrl(),
            'method' => $request->method(),
            'duration_ms' => round($duration * 1000, 2),
            'memory_kb' => round($memoryUsed / 1024, 2),
            'user_id' => auth()->id()
        ]);

        return $response;
    }
}
```

### Health Checks

#### Endpoint de Salud
```php
// En routes/web.php
Route::get('/health', function () {
    $checks = [
        'database' => $this->checkDatabase(),
        'storage' => $this->checkStorage(),
        'cache' => $this->checkCache(),
    ];

    $status = collect($checks)->every(fn($check) => $check) ? 200 : 500;

    return response()->json($checks, $status);
});
```

---

## 🔧 Optimizaciones de Servidor

### Configuración de PHP

#### php.ini Optimizado
```ini
; Optimizaciones para Laravel
opcache.enable=1
opcache.memory_consumption=256
opcache.max_accelerated_files=7963
opcache.revalidate_freq=0

; Límite de memoria
memory_limit=512M

; Timeout
max_execution_time=300

; Upload
upload_max_filesize=2M
post_max_size=3M
```

### Configuración de Nginx

#### Configuración Optimizada
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Cache estático
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Laravel
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    # PHP-FPM
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

### Configuración de Base de Datos

#### MySQL Optimizado
```ini
[mysqld]
# InnoDB
innodb_buffer_pool_size=1G
innodb_log_file_size=256M
innodb_flush_log_at_trx_commit=2

# Conexiones
max_connections=200
wait_timeout=28800

# Cache de queries
query_cache_size=256M
query_cache_type=1
```

---

## 📈 Estrategias de Escalabilidad

### Read Replicas

#### Configuración
```php
// config/database.php
'mysql' => [
    'read' => [
        'host' => env('DB_READ_HOST', env('DB_HOST')),
    ],
    'write' => [
        'host' => env('DB_HOST'),
    ],
],
```

#### Uso Automático
```php
// Laravel automáticamente usa read para SELECT y write para otros
$games = Game::all(); // Usa conexión read
$game = Game::create([...]); // Usa conexión write
```

### Queue System

#### Para Procesos Pesados
```php
// Enviar email de confirmación de registro
dispatch(new SendRegistrationConfirmation($registration));

// Procesar en background
class SendRegistrationConfirmation implements ShouldQueue
{
    public function handle()
    {
        // Lógica de envío de email
    }
}
```

### CDN para Assets

#### Configuración de Assets
```php
// En webpack.mix.js o vite.config.js
mix.js('resources/js/app.js', 'public/js')
   .sass('resources/sass/app.scss', 'public/css')
   .version(); // Versionado automático

// En producción
MIX_APP_URL=https://cdn.yourdomain.com
```

---

## 📋 Lista de Verificación de Rendimiento

### Base de Datos
- [ ] Índices apropiados creados
- [ ] Eager loading implementado
- [ ] N+1 queries eliminadas
- [ ] Paginación configurada
- [ ] Scopes optimizados

### Caching
- [ ] Cache de queries frecuentes
- [ ] Invalidación automática
- [ ] Cache de vistas estáticas
- [ ] Cache de configuración

### Frontend
- [ ] Imágenes lazy loading
- [ ] Code splitting implementado
- [ ] Bundles optimizados
- [ ] Virtual scrolling para listas largas

### Servidor
- [ ] PHP OPcache habilitado
- [ ] Configuración de Nginx optimizada
- [ ] Base de datos tuneada
- [ ] Conexiones persistentes

### Monitoreo
- [ ] Debugbar en desarrollo
- [ ] Logging de rendimiento
- [ ] Health checks configurados
- [ ] Alertas de rendimiento

---

## 📊 Métricas de Rendimiento

### Objetivos Recomendados
- **Response Time**: < 500ms para páginas admin
- **Queries por Request**: < 10 queries
- **Memory Usage**: < 32MB por request
- **Cache Hit Rate**: > 90%
- **Uptime**: > 99.9%

### Monitoreo Continuo
```php
// En un comando programado
public function handle()
{
    $metrics = [
        'response_time' => $this->measureResponseTime(),
        'query_count' => $this->countQueries(),
        'memory_peak' => memory_get_peak_usage(),
        'cache_hit_rate' => $this->calculateCacheHitRate(),
    ];

    // Enviar a servicio de monitoreo
    $this->sendToMonitoring($metrics);
}
```

---

**📖 Ver también**: [Controladores](../controllers.md) | [Modelos](../models.md) | [Seguridad](../security.md)</content>
<parameter name="filePath">c:\Users\Miguel\Code\GODCODE\TODO\vulca-torneos\DOCS\admin\performance.md