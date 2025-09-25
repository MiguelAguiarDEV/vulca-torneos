# 📝 Form Requests - Validaciones Admin

## 📋 Resumen

Documentación completa de todas las clases Form Request del sistema admin, incluyendo reglas de validación, mensajes de error y lógica personalizada.

## 🏗️ Arquitectura General

### Ubicación
- **Directorio**: `app/Http/Requests/Admin/`
- **Namespace**: `App\Http\Requests\Admin`
- **Herencia**: Todos extienden `FormRequest`

### Características Comunes
- **Idioma**: Mensajes de error en español
- **Autorización**: Método `authorize()` siempre retorna `true`
- **Validación**: Reglas en método `rules()`
- **Mensajes**: Personalizados en `messages()`

---

## 🎮 Game Requests

### StoreGameRequest

#### Ubicación
`app/Http/Requests/Admin/StoreGameRequest.php`

#### Reglas de Validación
```php
public function rules(): array
{
    return [
        'name' => 'required|string|max:255|unique:games,name',
        'description' => 'required|string|max:1000',
        'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        'is_active' => 'boolean'
    ];
}
```

#### Mensajes Personalizados
```php
public function messages(): array
{
    return [
        'name.required' => 'El nombre del juego es obligatorio.',
        'name.unique' => 'Ya existe un juego con este nombre.',
        'description.required' => 'La descripción es obligatoria.',
        'image.image' => 'El archivo debe ser una imagen.',
        'image.mimes' => 'La imagen debe ser de tipo: jpeg, png, jpg, gif.',
        'image.max' => 'La imagen no debe superar los 2MB.'
    ];
}
```

#### Campos Validados
- **name**: Nombre único del juego (requerido, máximo 255 caracteres)
- **description**: Descripción detallada (requerida, máximo 1000 caracteres)
- **image**: Imagen del juego (opcional, formatos: jpeg,png,jpg,gif, máximo 2MB)
- **is_active**: Estado del juego (booleano, por defecto true)

---

### UpdateGameRequest

#### Ubicación
`app/Http/Requests/Admin/UpdateGameRequest.php`

#### Reglas de Validación
```php
public function rules(): array
{
    $gameId = $this->route('game')->id;

    return [
        'name' => 'required|string|max:255|unique:games,name,' . $gameId,
        'description' => 'required|string|max:1000',
        'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        'is_active' => 'boolean'
    ];
}
```

#### Mensajes Personalizados
```php
public function messages(): array
{
    return [
        'name.required' => 'El nombre del juego es obligatorio.',
        'name.unique' => 'Ya existe un juego con este nombre.',
        'description.required' => 'La descripción es obligatoria.',
        'image.image' => 'El archivo debe ser una imagen.',
        'image.mimes' => 'La imagen debe ser de tipo: jpeg, png, jpg, gif.',
        'image.max' => 'La imagen no debe superar los 2MB.'
    ];
}
```

#### Diferencias con StoreGameRequest
- **name**: Excluye el ID del juego actual en la validación de unicidad
- Resto de reglas idénticas

---

## 🏆 Tournament Requests

### StoreTournamentRequest

#### Ubicación
`app/Http/Requests/Admin/StoreTournamentRequest.php`

#### Reglas de Validación
```php
public function rules(): array
{
    return [
        'name' => 'required|string|max:255',
        'description' => 'nullable|string|max:1000',
        'game_id' => 'required|exists:games,id',
        'start_date' => 'nullable|date|after:today',
        'end_date' => 'nullable|date|after:start_date',
        'registration_limit' => 'nullable|integer|min:1|max:1000',
        'is_active' => 'boolean'
    ];
}
```

#### Mensajes Personalizados
```php
public function messages(): array
{
    return [
        'name.required' => 'El nombre del torneo es obligatorio.',
        'game_id.required' => 'Debe seleccionar un juego.',
        'game_id.exists' => 'El juego seleccionado no existe.',
        'start_date.after' => 'La fecha de inicio debe ser posterior a hoy.',
        'end_date.after' => 'La fecha de fin debe ser posterior a la fecha de inicio.',
        'registration_limit.integer' => 'El límite de registros debe ser un número entero.',
        'registration_limit.min' => 'El límite mínimo de registros es 1.',
        'registration_limit.max' => 'El límite máximo de registros es 1000.'
    ];
}
```

#### Campos Validados
- **name**: Nombre del torneo (requerido, máximo 255 caracteres)
- **description**: Descripción opcional (máximo 1000 caracteres)
- **game_id**: ID del juego asociado (requerido, debe existir)
- **start_date**: Fecha de inicio (opcional, debe ser futura)
- **end_date**: Fecha de fin (opcional, debe ser posterior a start_date)
- **registration_limit**: Límite de inscripciones (opcional, 1-1000)
- **is_active**: Estado del torneo (booleano)

---

### UpdateTournamentRequest

#### Ubicación
`app/Http/Requests/Admin/UpdateTournamentRequest.php`

#### Reglas de Validación
```php
public function rules(): array
{
    return [
        'name' => 'required|string|max:255',
        'description' => 'nullable|string|max:1000',
        'game_id' => 'required|exists:games,id',
        'start_date' => 'nullable|date',
        'end_date' => 'nullable|date|after:start_date',
        'registration_limit' => 'nullable|integer|min:1|max:1000',
        'is_active' => 'boolean'
    ];
}
```

#### Mensajes Personalizados
```php
public function messages(): array
{
    return [
        'name.required' => 'El nombre del torneo es obligatorio.',
        'game_id.required' => 'Debe seleccionar un juego.',
        'game_id.exists' => 'El juego seleccionado no existe.',
        'end_date.after' => 'La fecha de fin debe ser posterior a la fecha de inicio.',
        'registration_limit.integer' => 'El límite de registros debe ser un número entero.',
        'registration_limit.min' => 'El límite mínimo de registros es 1.',
        'registration_limit.max' => 'El límite máximo de registros es 1000.'
    ];
}
```

#### Diferencias con StoreTournamentRequest
- **start_date**: No requiere ser futura (permite editar torneos existentes)
- Resto de reglas idénticas

---

## 📝 Registration Requests

### StoreRegistrationRequest

#### Ubicación
`app/Http/Requests/Admin/StoreRegistrationRequest.php`

#### Reglas de Validación
```php
public function rules(): array
{
    return [
        'user_id' => 'required|exists:users,id',
        'tournament_id' => 'required|exists:tournaments,id',
        'payment_status' => 'required|in:pending,paid,cancelled',
        'payment_amount' => 'nullable|numeric|min:0',
        'notes' => 'nullable|string|max:500'
    ];
}
```

#### Mensajes Personalizados
```php
public function messages(): array
{
    return [
        'user_id.required' => 'Debe seleccionar un usuario.',
        'user_id.exists' => 'El usuario seleccionado no existe.',
        'tournament_id.required' => 'Debe seleccionar un torneo.',
        'tournament_id.exists' => 'El torneo seleccionado no existe.',
        'payment_status.required' => 'El estado de pago es obligatorio.',
        'payment_status.in' => 'El estado de pago debe ser: pendiente, pagado o cancelado.',
        'payment_amount.numeric' => 'El monto debe ser un número.',
        'payment_amount.min' => 'El monto no puede ser negativo.',
        'notes.max' => 'Las notas no deben superar los 500 caracteres.'
    ];
}
```

#### Campos Validados
- **user_id**: ID del usuario (requerido, debe existir)
- **tournament_id**: ID del torneo (requerido, debe existir)
- **payment_status**: Estado del pago (requerido: pending, paid, cancelled)
- **payment_amount**: Monto del pago (opcional, numérico, mínimo 0)
- **notes**: Notas adicionales (opcional, máximo 500 caracteres)

---

### UpdateRegistrationRequest

#### Ubicación
`app/Http/Requests/Admin/UpdateRegistrationRequest.php`

#### Reglas de Validación
```php
public function rules(): array
{
    return [
        'payment_status' => 'required|in:pending,paid,cancelled',
        'payment_amount' => 'nullable|numeric|min:0',
        'notes' => 'nullable|string|max:500'
    ];
}
```

#### Mensajes Personalizados
```php
public function messages(): array
{
    return [
        'payment_status.required' => 'El estado de pago es obligatorio.',
        'payment_status.in' => 'El estado de pago debe ser: pendiente, pagado o cancelado.',
        'payment_amount.numeric' => 'El monto debe ser un número.',
        'payment_amount.min' => 'El monto no puede ser negativo.',
        'notes.max' => 'Las notas no deben superar los 500 caracteres.'
    ];
}
```

#### Diferencias con StoreRegistrationRequest
- No valida `user_id` ni `tournament_id` (no se pueden cambiar)
- Solo permite actualizar estado de pago, monto y notas

---

## 🔧 Validaciones Personalizadas

### Validación de Unicidad con Excepción
```php
'name' => 'required|string|max:255|unique:games,name,' . $this->route('game')->id
```

### Validación de Fechas Condicionales
```php
'start_date' => 'nullable|date|after:today',  // Solo en creación
'end_date' => 'nullable|date|after:start_date'  // Después de start_date
```

### Validación de Archivos
```php
'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
```

### Validación de Enumerados
```php
'payment_status' => 'required|in:pending,paid,cancelled'
```

---

## 🌐 Mensajes en Español

### Patrón de Mensajes
- **Campos requeridos**: "El [campo] es obligatorio."
- **Campos únicos**: "Ya existe un [elemento] con este [campo]."
- **Formatos inválidos**: "El [campo] debe ser [tipo]."
- **Límites**: "El [campo] no debe superar los [límite] [unidad]."

### Ejemplos Comunes
```php
'required' => 'El :attribute es obligatorio.',
'unique' => 'Ya existe un registro con este :attribute.',
'max.string' => 'El :attribute no debe superar los :max caracteres.',
'image' => 'El archivo debe ser una imagen.',
'mimes' => 'El :attribute debe ser de tipo: :values.',
'max.file' => 'El :attribute no debe superar los :max kilobytes.',
```

---

## 🛡️ Autorización

### Método authorize()
```php
public function authorize(): bool
{
    return true; // Siempre autorizado (middleware admin controla acceso)
}
```

**Nota**: La autorización real se maneja a través del middleware `admin` aplicado a todas las rutas admin.

---

## 🔄 Flujo de Validación

### Proceso de Validación
1. **Recepción de Request**: Llega al controlador con Form Request
2. **Autorización**: Método `authorize()` (siempre true)
3. **Validación**: Aplicación de reglas en `rules()`
4. **Mensajes**: Uso de mensajes personalizados si falla
5. **Redirección**: De vuelta al formulario con errores
6. **Éxito**: Continuación al método del controlador

### Manejo de Errores
```php
// En el controlador
if ($validator->fails()) {
    return redirect()->back()
                    ->withErrors($validator)
                    ->withInput();
}
```

---

**📖 Ver también**: [Controladores](../controllers.md) | [Rutas](../routes.md) | [Modelos](../models.md)</content>
<parameter name="filePath">c:\Users\Miguel\Code\GODCODE\TODO\vulca-torneos\DOCS\admin\requests.md