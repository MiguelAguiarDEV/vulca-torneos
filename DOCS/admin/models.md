# 🗄️ Modelos de Datos - Sistema Admin

## 📋 Resumen

Documentación completa de todos los modelos Eloquent del sistema admin, incluyendo relaciones, atributos, constantes y métodos.

## 🏗️ Arquitectura General

### Namespace
- **Base**: `App\Models`
- **Herencia**: Todos extienden `Model` de Laravel

### Características Comunes
- **Timestamps**: Automáticos (`created_at`, `updated_at`)
- **Soft Deletes**: No implementados (eliminación permanente)
- **Mass Assignment**: Protección con `$fillable`
- **Casting**: Atributos casteados apropiadamente

---

## 👤 User Model

### Ubicación
`app/Models/User.php`

### Estructura de la Tabla
```sql
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    email_verified_at TIMESTAMP NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    remember_token VARCHAR(100) NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);
```

### Atributos Fillable
```php
protected $fillable = [
    'name',
    'email',
    'password',
    'role'
];
```

### Atributos Casteados
```php
protected $casts = [
    'email_verified_at' => 'datetime',
    'password' => 'hashed',
];
```

### Constantes
```php
const ROLE_ADMIN = 'admin';
const ROLE_USER = 'user';
```

### Relaciones
```php
// Relación con inscripciones
public function registrations(): HasMany
{
    return $this->hasMany(Registration::class);
}
```

### Métodos de Ayuda
```php
public function isAdmin(): bool
{
    return $this->role === self::ROLE_ADMIN;
}
```

---

## 🎮 Game Model

### Ubicación
`app/Models/Game.php`

### Estructura de la Tabla
```sql
CREATE TABLE games (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    image_path VARCHAR(255) NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);
```

### Atributos Fillable
```php
protected $fillable = [
    'name',
    'description',
    'image_path',
    'is_active'
];
```

### Atributos Casteados
```php
protected $casts = [
    'is_active' => 'boolean',
];
```

### Relaciones
```php
// Relación con torneos
public function tournaments(): HasMany
{
    return $this->hasMany(Tournament::class);
}

// Relación con inscripciones a través de torneos
public function registrations(): HasManyThrough
{
    return $this->hasManyThrough(Registration::class, Tournament::class);
}
```

### Métodos de Ayuda
```php
// Obtener URL completa de la imagen
public function getImageUrlAttribute(): string
{
    return $this->image_path
        ? asset('storage/' . $this->image_path)
        : asset('images/default-game.png');
}

// Verificar si tiene torneos activos
public function hasActiveTournaments(): bool
{
    return $this->tournaments()->where('is_active', true)->exists();
}
```

### Scopes
```php
public function scopeActive($query)
{
    return $query->where('is_active', true);
}
```

---

## 🏆 Tournament Model

### Ubicación
`app/Models/Tournament.php`

### Estructura de la Tabla
```sql
CREATE TABLE tournaments (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    game_id BIGINT UNSIGNED NOT NULL,
    start_date DATETIME NULL,
    end_date DATETIME NULL,
    registration_limit INT UNSIGNED NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
);
```

### Atributos Fillable
```php
protected $fillable = [
    'name',
    'description',
    'game_id',
    'start_date',
    'end_date',
    'registration_limit',
    'is_active'
];
```

### Atributos Casteados
```php
protected $casts = [
    'start_date' => 'datetime',
    'end_date' => 'datetime',
    'is_active' => 'boolean',
    'registration_limit' => 'integer',
];
```

### Relaciones
```php
// Relación con juego
public function game(): BelongsTo
{
    return $this->belongsTo(Game::class);
}

// Relación con inscripciones
public function registrations(): HasMany
{
    return $this->hasMany(Registration::class);
}
```

### Métodos de Ayuda
```php
// Verificar si está lleno
public function isFull(): bool
{
    if (!$this->registration_limit) {
        return false;
    }

    return $this->registrations()->count() >= $this->registration_limit;
}

// Obtener número de inscripciones disponibles
public function availableSlots(): int
{
    if (!$this->registration_limit) {
        return -1; // Ilimitado
    }

    return max(0, $this->registration_limit - $this->registrations()->count());
}

// Verificar si está activo y en fechas válidas
public function isAvailable(): bool
{
    if (!$this->is_active) {
        return false;
    }

    $now = now();

    if ($this->start_date && $now->lt($this->start_date)) {
        return false; // No ha empezado
    }

    if ($this->end_date && $now->gt($this->end_date)) {
        return false; // Ya terminó
    }

    return true;
}
```

### Scopes
```php
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
```

---

## 📝 Registration Model

### Ubicación
`app/Models/Registration.php`

### Estructura de la Tabla
```sql
CREATE TABLE registrations (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    tournament_id BIGINT UNSIGNED NOT NULL,
    payment_status ENUM('pending', 'paid', 'cancelled') DEFAULT 'pending',
    payment_amount DECIMAL(10,2) NULL,
    notes TEXT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE
);
```

### Atributos Fillable
```php
protected $fillable = [
    'user_id',
    'tournament_id',
    'payment_status',
    'payment_amount',
    'notes'
];
```

### Atributos Casteados
```php
protected $casts = [
    'payment_amount' => 'decimal:2',
];
```

### Constantes
```php
const PAYMENT_PENDING = 'pending';
const PAYMENT_PAID = 'paid';
const PAYMENT_CANCELLED = 'cancelled';
```

### Relaciones
```php
// Relación con usuario
public function user(): BelongsTo
{
    return $this->belongsTo(User::class);
}

// Relación con torneo
public function tournament(): BelongsTo
{
    return $this->belongsTo(Tournament::class);
}
```

### Métodos de Ayuda
```php
// Verificar si está pagada
public function isPaid(): bool
{
    return $this->payment_status === self::PAYMENT_PAID;
}

// Verificar si está pendiente
public function isPending(): bool
{
    return $this->payment_status === self::PAYMENT_PENDING;
}

// Obtener estado formateado
public function getStatusLabelAttribute(): string
{
    return match($this->payment_status) {
        self::PAYMENT_PAID => 'Pagado',
        self::PAYMENT_CANCELLED => 'Cancelado',
        default => 'Pendiente'
    };
}
```

### Scopes
```php
public function scopePaid($query)
{
    return $query->where('payment_status', self::PAYMENT_PAID);
}

public function scopePending($query)
{
    return $query->where('payment_status', self::PAYMENT_PENDING);
}

public function scopeCancelled($query)
{
    return $query->where('payment_status', self::PAYMENT_CANCELLED);
}
```

---

## 🔗 Diagrama de Relaciones

```
User (1) ──── (N) Registration
                    │
                    │
                    └──── (N) Tournament (N) ──── (1) Game
```

### Relaciones Detalladas
- **User → Registration**: Un usuario puede tener múltiples inscripciones
- **Tournament → Registration**: Un torneo puede tener múltiples inscripciones
- **Game → Tournament**: Un juego puede tener múltiples torneos
- **Game → Registration**: Relación indirecta a través de Tournament

---

## 🔧 Funcionalidades Avanzadas

### Model Events
```php
// En Tournament.php
protected static function booted()
{
    static::creating(function ($tournament) {
        // Lógica antes de crear
    });

    static::updating(function ($tournament) {
        // Lógica antes de actualizar
    });
}
```

### Accessors & Mutators
```php
// En Game.php
public function getImageUrlAttribute()
{
    return $this->image_path ? asset('storage/' . $this->image_path) : null;
}

public function setNameAttribute($value)
{
    $this->attributes['name'] = ucwords(strtolower($value));
}
```

### Query Optimization
```php
// Carga eager de relaciones
$games = Game::with(['tournaments.registrations'])->get();

// Carga condicional
$tournaments = Tournament::with([
    'registrations' => function ($query) {
        $query->where('payment_status', 'paid');
    }
])->get();
```

---

## 🛡️ Validaciones a Nivel de Modelo

### Reglas de Validación
```php
// En Tournament.php
public static function rules(): array
{
    return [
        'name' => 'required|string|max:255',
        'game_id' => 'required|exists:games,id',
        'registration_limit' => 'nullable|integer|min:1',
    ];
}
```

### Validación Personalizada
```php
// Verificar límite de registros antes de crear inscripción
public function canRegister(User $user): bool
{
    // Verificar si ya está inscrito
    if ($this->registrations()->where('user_id', $user->id)->exists()) {
        return false;
    }

    // Verificar límite
    return !$this->isFull();
}
```

---

## 📊 Estadísticas y Métricas

### Métodos de Estadísticas
```php
// En Game.php
public function getStatsAttribute(): array
{
    return [
        'total_tournaments' => $this->tournaments()->count(),
        'active_tournaments' => $this->tournaments()->active()->count(),
        'total_registrations' => $this->registrations()->count(),
        'paid_registrations' => $this->registrations()->paid()->count(),
    ];
}

// En Tournament.php
public function getRegistrationStatsAttribute(): array
{
    $total = $this->registrations()->count();
    $paid = $this->registrations()->paid()->count();
    $pending = $this->registrations()->pending()->count();

    return [
        'total' => $total,
        'paid' => $paid,
        'pending' => $pending,
        'paid_percentage' => $total > 0 ? round(($paid / $total) * 100, 1) : 0,
    ];
}
```

---

**📖 Ver también**: [Controladores](../controllers.md) | [Form Requests](../requests.md) | [Rutas](../routes.md)</content>
<parameter name="filePath">c:\Users\Miguel\Code\GODCODE\TODO\vulca-torneos\DOCS\admin\models.md