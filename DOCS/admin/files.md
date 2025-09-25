# 📁 Gestión de Archivos - Sistema Admin

## 📋 Resumen

Documentación completa del sistema de gestión de archivos del admin, incluyendo subida, almacenamiento, validación y eliminación de imágenes.

## 🏗️ Arquitectura de Almacenamiento

### Sistema de Archivos
- **Driver**: Local filesystem con enlace simbólico público
- **Directorio Base**: `storage/app/public`
- **URL Pública**: `/storage` (accesible vía web)
- **Permisos**: 755 para directorios, 644 para archivos

### Estructura de Directorios
```
storage/
├── app/
│   └── public/
│       ├── games/          # Imágenes de juegos
│       └── uploads/        # Archivos temporales
└── logs/                   # Logs del sistema
```

---

## 🖼️ Gestión de Imágenes de Juegos

### Configuración de Almacenamiento

#### Disk Configuration
```php
// config/filesystems.php
'public' => [
    'driver' => 'local',
    'root' => storage_path('app/public'),
    'url' => env('APP_URL').'/storage',
    'visibility' => 'public',
],
```

#### Enlace Simbólico
```bash
# Crear enlace simbólico para acceso público
php artisan storage:link
```
Esto crea un enlace desde `public/storage` → `storage/app/public`

### Validación de Imágenes

#### Reglas de Validación
```php
// En Form Requests
'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
```

#### Tipos MIME Permitidos
- `image/jpeg` (.jpg, .jpeg)
- `image/png` (.png)
- `image/gif` (.gif)

#### Limitaciones
- **Tamaño máximo**: 2MB (2048 KB)
- **Dimensiones**: No restringidas (pero recomendado máximo 1920x1080)
- **Formato**: Solo imágenes raster (no SVG por seguridad)

### Proceso de Subida

#### En Controladores
```php
public function store(StoreGameRequest $request)
{
    $validated = $request->validated();

    // Procesar imagen si existe
    if ($request->hasFile('image')) {
        $validated['image_path'] = $request->file('image')
            ->store('games', 'public');
    }

    $game = Game::create($validated);

    return redirect()->route('admin.games.index')
                    ->with('success', 'Juego creado con éxito');
}
```

#### Método store() de Laravel
```php
// Sintaxis: store(directory, disk)
$path = $request->file('image')->store('games', 'public');

// Resultado típico: games/abc123def456.jpg
```

### Actualización de Imágenes

#### Lógica de Reemplazo
```php
public function update(UpdateGameRequest $request, Game $game)
{
    $validated = $request->validated();

    // Manejar nueva imagen
    if ($request->hasFile('image')) {
        // Eliminar imagen anterior
        if ($game->image_path) {
            Storage::disk('public')->delete($game->image_path);
        }

        // Almacenar nueva imagen
        $validated['image_path'] = $request->file('image')
            ->store('games', 'public');
    }

    $game->update($validated);

    return redirect()->route('admin.games.index')
                    ->with('success', 'Juego actualizado exitosamente');
}
```

### Eliminación de Imágenes

#### Al Eliminar Juego
```php
public function destroy(Game $game)
{
    // Verificar dependencias
    if ($game->tournaments()->exists()) {
        return redirect()->back()
                        ->with('error', 'No se puede eliminar un juego con torneos asociados');
    }

    // Eliminar imagen asociada
    if ($game->image_path) {
        Storage::disk('public')->delete($game->image_path);
    }

    $game->delete();

    return redirect()->route('admin.games.index')
                    ->with('success', 'Juego eliminado exitosamente');
}
```

### Acceso a Imágenes

#### Helper en Model
```php
// En Game.php
public function getImageUrlAttribute(): string
{
    return $this->image_path
        ? asset('storage/' . $this->image_path)
        : asset('images/default-game.png');
}
```

#### Uso en Vistas
```php
// En componentes React/Inertia
<img src={game.image_url} alt={game.name} />

// O directamente
<img src={`/storage/${game.image_path}`} alt={game.name} />
```

---

## 🔧 Utilidades de Almacenamiento

### Facade Storage
```php
use Illuminate\Support\Facades\Storage;

// Verificar existencia
Storage::disk('public')->exists('games/image.jpg');

// Obtener URL
Storage::disk('public')->url('games/image.jpg');

// Obtener tamaño
Storage::disk('public')->size('games/image.jpg');

// Copiar archivo
Storage::disk('public')->copy('games/old.jpg', 'games/new.jpg');
```

### Operaciones Comunes
```php
// Listar archivos en directorio
$files = Storage::disk('public')->files('games');

// Listar con subdirectorios
$allFiles = Storage::disk('public')->allFiles('games');

// Crear directorio
Storage::disk('public')->makeDirectory('games/thumbnails');
```

---

## 🛡️ Validación y Seguridad

### Validación de Archivos
```php
// Verificación de tipo MIME real
if (!$request->file('image')->isValid()) {
    return back()->with('error', 'Archivo de imagen inválido');
}

// Verificación de tamaño real
$sizeInMB = $request->file('image')->getSize() / 1024 / 1024;
if ($sizeInMB > 2) {
    return back()->with('error', 'Imagen demasiado grande');
}
```

### Nombres de Archivo Seguros
```php
// Laravel genera automáticamente nombres seguros
// Ejemplo: "photo.jpg" → "abc123def456.jpg"

// Para nombres personalizados (con sanitización)
$safeName = Str::slug($originalName) . '.' . $extension;
$path = $request->file('image')->storeAs('games', $safeName, 'public');
```

### Protección contra Ataques
- **Path Traversal**: Laravel previene automáticamente
- **Null Bytes**: Filtrados por PHP
- **Double Extensions**: No permitidas por validación MIME
- **Ejecución de Código**: Solo imágenes permitidas

---

## 📊 Gestión de Espacio y Rendimiento

### Monitoreo de Uso
```php
// Obtener tamaño total del directorio
$size = 0;
$files = Storage::disk('public')->allFiles('games');
foreach ($files as $file) {
    $size += Storage::disk('public')->size($file);
}

// Convertir a MB
$sizeInMB = $size / 1024 / 1024;
```

### Limpieza de Archivos Huérfanos
```php
// En un comando Artisan
public function handle()
{
    $gameImages = Game::whereNotNull('image_path')
                     ->pluck('image_path')
                     ->toArray();

    $allImages = Storage::disk('public')->files('games');

    foreach ($allImages as $image) {
        if (!in_array($image, $gameImages)) {
            Storage::disk('public')->delete($image);
            $this->info("Deleted orphaned image: {$image}");
        }
    }
}
```

### Optimización de Imágenes
```php
// Usando paquete como spatie/image-optimizer
public function optimizeImage($path)
{
    $fullPath = Storage::disk('public')->path($path);

    ImageOptimizer::optimize($fullPath);
}
```

---

## 🚨 Manejo de Errores

### Errores Comunes de Subida
```php
try {
    $path = $request->file('image')->store('games', 'public');
} catch (\Exception $e) {
    Log::error('Image upload failed', [
        'error' => $e->getMessage(),
        'user_id' => auth()->id(),
        'file' => $request->file('image')->getClientOriginalName()
    ]);

    return back()->with('error', 'Error al subir la imagen');
}
```

### Validación de Disco Lleno
```php
// Verificar espacio disponible antes de subir
$diskFreeSpace = disk_free_space(storage_path('app/public'));
$requiredSpace = 5 * 1024 * 1024; // 5MB mínimo

if ($diskFreeSpace < $requiredSpace) {
    return back()->with('error', 'Espacio insuficiente en el servidor');
}
```

### Timeouts de Subida
```php
// En php.ini o .htaccess
upload_max_filesize = 2M
post_max_size = 3M
max_execution_time = 300
```

---

## 🔄 Migraciones y Backups

### Backup de Imágenes
```bash
# Backup completo del directorio
tar -czf backup_images_$(date +%Y%m%d).tar.gz storage/app/public/

# Backup selectivo
tar -czf games_backup.tar.gz storage/app/public/games/
```

### Migración de Archivos
```php
// Mover imágenes a nueva estructura
public function migrateImages()
{
    $games = Game::whereNotNull('image_path')->get();

    foreach ($games as $game) {
        $oldPath = $game->image_path;
        $newPath = 'games/' . basename($oldPath);

        if (Storage::disk('public')->exists($oldPath)) {
            Storage::disk('public')->move($oldPath, $newPath);
            $game->update(['image_path' => $newPath]);
        }
    }
}
```

---

## 📋 Lista de Verificación

### Configuración Inicial
- [ ] Enlace simbólico creado (`php artisan storage:link`)
- [ ] Permisos correctos en `storage/`
- [ ] Directorios creados (`games/`, `uploads/`)
- [ ] Configuración de disk en `filesystems.php`

### En Desarrollo
- [ ] Validación de imágenes implementada
- [ ] Manejo de errores de subida
- [ ] Limpieza de imágenes al eliminar
- [ ] URLs de imágenes funcionando
- [ ] Optimización de imágenes (opcional)

### En Producción
- [ ] Backup automático configurado
- [ ] Monitoreo de espacio en disco
- [ ] CDN configurado (opcional)
- [ ] Compresión de imágenes activada

---

## 🔧 Comandos Útiles

```bash
# Crear enlace simbólico
php artisan storage:link

# Verificar enlace
ls -la public/storage

# Cambiar permisos
chmod -R 755 storage/
chmod -R 644 storage/app/public/

# Limpiar archivos temporales
find storage/app/public/uploads -name "*.tmp" -delete
```

---

**📖 Ver también**: [Controladores](../controllers.md) | [Modelos](../models.md) | [Seguridad](../security.md)</content>
<parameter name="filePath">c:\Users\Miguel\Code\GODCODE\TODO\vulca-torneos\DOCS\admin\files.md