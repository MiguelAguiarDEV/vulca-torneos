# Documentación de Integración de Stripe - Sistema de Inscripciones a Torneos

## 📖 Índice
1. [Flujo Completo de Inscripción y Pago](#-flujo-completo-de-inscripción-y-pago)
2. [Arquitectura de la Implementación](#-arquitectura-de-la-implementación)
3. [Componentes Desarrollados](#-componentes-desarrollados)
4. [Configuración](#-configuración)
5. [Testing](#-testing)
6. [Seguridad](#-seguridad)
7. [Producción](#-producción)

---

## 🔄 Flujo Completo de Inscripción y Pago

### Diagrama del Flujo
```
Usuario → Ver Torneos → Seleccionar Torneo → Inscribirse → Checkout → Stripe → Pago → Confirmación
```

### Paso a Paso Detallado

#### 1️⃣ Usuario Navega y Selecciona un Torneo
- **URL**: `/tournaments`
- **Vista**: `resources/js/pages/Tournaments/Index.tsx`
- **Controlador**: `TournamentController@publicIndex`
- **Qué hace**: Muestra lista de torneos disponibles con filtros
- **Por qué**: Permite a los usuarios descubrir torneos en los que pueden participar

#### 2️⃣ Usuario Ve Detalles del Torneo
- **URL**: `/tournaments/{slug}`
- **Vista**: `resources/js/pages/Tournaments/Show.tsx`
- **Controlador**: `TournamentController@publicShow`
- **Qué hace**: Muestra información completa del torneo, precio, fechas, inscritos actuales
- **Por qué**: El usuario necesita toda la información antes de decidir inscribirse

#### 3️⃣ Usuario Hace Click en "Inscribirse"
- **Ruta**: `POST /tournaments/{tournament}/register`
- **Controlador**: `TournamentController@register`
- **Qué sucede**:
  1. Valida que el usuario esté autenticado
  2. Verifica que el torneo acepte inscripciones (`isRegistrationOpen()`)
  3. Crea registro en la BD con estado `pending` y `payment_status = 'pending'`
  4. Si el torneo tiene costo → Redirige a checkout
  5. Si es gratis → Confirma inscripción inmediatamente
- **Por qué**: Necesitamos un registro en BD antes del pago para trackear la intención del usuario

**Código clave** (`TournamentController.php`):
```php
$registration = $tournament->registrations()->create([
    'user_id' => $user->id,
    'registered_at' => now(),
    'status' => 'pending',
    'payment_status' => $tournament->entry_fee > 0 ? 'pending' : 'confirmed',
    'payment_method' => $tournament->entry_fee > 0 ? 'stripe' : 'free',
    'amount' => $tournament->entry_fee ?? 0,
]);

if ($tournament->entry_fee > 0) {
    return redirect()->route('registration.payment.checkout', $registration->id);
}
```

#### 4️⃣ Usuario Llega a la Página de Checkout
- **URL**: `/registrations/{registration}/checkout`
- **Vista**: `resources/js/pages/Registrations/Checkout.tsx`
- **Controlador**: `PaymentController@checkout`
- **Qué muestra**: Resumen del torneo, precio total, botón "Proceder al pago"
- **Por qué**: Confirmar con el usuario los detalles antes de iniciar el proceso de pago

#### 5️⃣ Usuario Click en "Proceder al Pago"
- **Ruta**: `POST /registrations/{registration}/create-checkout-session`
- **Controlador**: `PaymentController@createCheckoutSession`
- **Servicio**: `StripeService@createCheckoutSession`
- **Qué hace**:
  1. Valida que la inscripción pertenece al usuario autenticado
  2. Verifica que el pago no esté ya confirmado
  3. Crea una **Stripe Checkout Session** con:
     - Datos del torneo (nombre, precio)
     - Email del usuario
     - URLs de retorno (success/cancel)
     - Metadata (IDs de registration, tournament, user)
  4. Guarda `stripe_checkout_session_id` en la BD
  5. Devuelve URL de Stripe al frontend
- **Por qué**: Stripe Checkout es una solución segura, PCI-compliant que maneja todo el flujo de pago

**Código clave** (`StripeService.php`):
```php
$session = StripeSession::create([
    'payment_method_types' => ['card'],
    'line_items' => [[
        'price_data' => [
            'currency' => 'eur',
            'product_data' => [
                'name' => 'Inscripción: ' . $tournament->name,
            ],
            'unit_amount' => (int) ($tournament->entry_fee * 100),
        ],
        'quantity' => 1,
    ]],
    'mode' => 'payment',
    'success_url' => route('registration.payment.success', ['registration' => $registration->id]) . '?session_id={CHECKOUT_SESSION_ID}',
    'cancel_url' => route('registration.payment.cancel', ['registration' => $registration->id]),
    'metadata' => [
        'registration_id' => $registration->id,
        'tournament_id' => $tournament->id,
    ],
]);
```

#### 6️⃣ Redirección a Stripe Checkout
- **Frontend**: JavaScript redirige a `session.url` de Stripe
- **Qué ve el usuario**: Formulario de pago de Stripe (hosted por Stripe)
- **Por qué**: Stripe maneja la seguridad, validación de tarjetas, 3D Secure, etc.

#### 7️⃣ Usuario Completa el Pago en Stripe
Dos caminos paralelos:

**A) Redirección del Usuario (Síncrono)**
- **URL**: `/registrations/{registration}/payment/success?session_id=xxx`
- **Controlador**: `PaymentController@success`
- **Qué hace**:
  1. Obtiene el `session_id` de la URL
  2. Consulta a Stripe para verificar el estado del pago
  3. Si `payment_status === 'paid'`:
     - Actualiza registro: `payment_status = 'confirmed'`, `status = 'confirmed'`
     - Guarda `stripe_payment_intent_id`
  4. Muestra página de éxito
- **Por qué**: Feedback inmediato al usuario

**B) Webhook de Stripe (Asíncrono - más confiable)**
- **URL**: `POST /webhook/stripe` (sin autenticación CSRF)
- **Controlador**: `PaymentController@webhook`
- **Eventos escuchados**:
  - `checkout.session.completed`
  - `payment_intent.succeeded`
  - `payment_intent.payment_failed`
- **Qué hace**:
  1. Verifica firma del webhook con `STRIPE_WEBHOOK_SECRET`
  2. Busca la inscripción por `registration_id` en metadata
  3. Actualiza estado según el evento
  4. Responde 200 OK a Stripe
- **Por qué**: Los webhooks son la forma más confiable de confirmar pagos, funcionan incluso si el usuario cierra el navegador

**Código clave** (`PaymentController.php`):
```php
protected function handleCheckoutSessionCompleted($session)
{
    $registrationId = $session->client_reference_id ?? $session->metadata->registration_id;
    $registration = Registration::find($registrationId);

    if ($session->payment_status === 'paid') {
        $this->stripeService->handleSuccessfulPayment($registration, $session);
    }
}
```

#### 8️⃣ Página de Confirmación
- **Vista**: `resources/js/pages/Registrations/PaymentSuccess.tsx`
- **Qué muestra**: Mensaje de éxito, detalles de la inscripción, número de confirmación
- **Por qué**: Confirmación visual para el usuario

#### 9️⃣ Si el Usuario Cancela
- **URL**: `/registrations/{registration}/payment/cancel`
- **Vista**: `resources/js/pages/Registrations/PaymentCancelled.tsx`
- **Qué muestra**: Mensaje de cancelación, opción de reintentar
- **Por qué**: El usuario puede cambiar de opinión o tener problemas con su tarjeta

---

## 🏗️ Arquitectura de la Implementación

### Estructura de Capas

```
┌─────────────────────────────────────────────────┐
│           FRONTEND (React/Inertia)              │
│  - Checkout.tsx                                 │
│  - PaymentSuccess.tsx                           │
│  - PaymentCancelled.tsx                         │
└────────────────┬────────────────────────────────┘
                 │ HTTP Requests (Fetch API)
┌────────────────▼────────────────────────────────┐
│           RUTAS (routes/web.php)                │
│  - GET  /registrations/{id}/checkout            │
│  - POST /registrations/{id}/create-checkout-session │
│  - GET  /registrations/{id}/payment/success     │
│  - POST /webhook/stripe                         │
└────────────────┬────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────┐
│        CONTROLADORES (Controllers)              │
│  - PaymentController                            │
│  - TournamentController                         │
└────────────────┬────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────┐
│          SERVICIOS (Services)                   │
│  - StripeService                                │
│    * Encapsula toda lógica de Stripe API        │
└────────────────┬────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────┐
│          MODELOS (Models)                       │
│  - Registration                                 │
│  - Tournament                                   │
│  - User                                         │
└────────────────┬────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────┐
│          BASE DE DATOS (SQLite)                 │
│  - registrations                                │
│    * payment_method, payment_status, amount     │
│    * stripe_payment_intent_id                   │
│    * stripe_checkout_session_id                 │
└─────────────────────────────────────────────────┘
```

---

## 🛠️ Componentes Desarrollados

### Base de Datos

#### Migración 1: `2025_07_03_185946_add_payment_fields_to_registrations_table.php`
**Qué hace**: Agrega campos básicos de pago
**Por qué**: Necesitamos trackear método de pago, estado y monto para cualquier tipo de pago (no solo Stripe)

```php
$table->enum('payment_method', ['cash', 'transfer', 'card', 'stripe', 'free']);
$table->enum('payment_status', ['pending', 'confirmed', 'failed']);
$table->decimal('amount', 8, 2);
$table->text('payment_notes')->nullable();
$table->timestamp('payment_confirmed_at')->nullable();
$table->foreignId('payment_confirmed_by')->nullable();
```

#### Migración 2: `2025_10_05_180203_add_payment_fields_to_registrations_table.php`
**Qué hace**: Agrega campos específicos de Stripe
**Por qué**: Necesitamos los IDs de Stripe para consultas y reconciliación

```php
$table->string('stripe_payment_intent_id')->nullable();
$table->string('stripe_checkout_session_id')->nullable();
$table->string('stripe_payment_status')->nullable();
```

#### Migración 3: `2025_10_06_011209_add_stripe_to_payment_method_enum.php`
**Qué hace**: Agrega 'stripe' y 'free' al enum de payment_method
**Por qué**: SQLite no permite modificar ENUMs fácilmente, tuvimos que recrear la columna

### Modelos

#### `app/Models/Registration.php`
**Métodos agregados**:
- `isStripePayment()`: Verifica si el pago es vía Stripe
- `failPayment()`: Marca el pago como fallido
- `updateStripePaymentStatus()`: Actualiza estado de Stripe
- `confirmPayment()`: Confirma pago y actualiza estado

**Por qué**: Encapsular lógica de negocio en el modelo (patrón Active Record)

### Servicios

#### `app/Services/StripeService.php`
**Responsabilidad**: Toda la comunicación con la API de Stripe

**Métodos**:
- `createCheckoutSession()`: Crea sesión de pago en Stripe
- `retrieveCheckoutSession()`: Consulta estado de una sesión
- `handleSuccessfulPayment()`: Procesa pago exitoso
- `handleFailedPayment()`: Procesa pago fallido
- `verifyWebhookSignature()`: Valida webhooks de Stripe

**Por qué creamos un servicio separado**:
- ✅ Separación de responsabilidades (SRP)
- ✅ Reutilización de código
- ✅ Fácil testing y mocking
- ✅ Centraliza configuración de Stripe

### Controladores

#### `app/Http/Controllers/PaymentController.php`
**Responsabilidad**: Orquestar el flujo de pago

**Métodos**:
- `checkout()`: Muestra página de checkout (GET)
- `createCheckoutSession()`: API endpoint para crear sesión (POST)
- `success()`: Página de éxito tras pago (GET)
- `cancel()`: Página de cancelación (GET)
- `webhook()`: Recibe notificaciones de Stripe (POST)

**Por qué un controlador separado**:
- ✅ Mantiene `TournamentController` enfocado en torneos
- ✅ Agrupa toda lógica de pagos en un lugar
- ✅ Facilita agregar otros métodos de pago en el futuro

#### `app/Http/Controllers/TournamentController.php` (modificado)
**Método modificado**: `register()`
**Qué hace**: Crea inscripción y redirige a checkout si hay costo
**Por qué**: Punto de entrada al flujo de pago

### Rutas

#### Rutas Autenticadas (`routes/web.php`)
```php
Route::middleware('auth')->group(function () {
    // Inscripción
    Route::post('/tournaments/{tournament}/register', [TournamentController::class, 'register']);

    // Pagos
    Route::prefix('registrations/{registration}')->group(function () {
        Route::get('/checkout', [PaymentController::class, 'checkout']);
        Route::post('/create-checkout-session', [PaymentController::class, 'createCheckoutSession']);
        Route::get('/payment/success', [PaymentController::class, 'success']);
        Route::get('/payment/cancel', [PaymentController::class, 'cancel']);
    });
});
```

**Por qué esta estructura**:
- ✅ `{registration}` en la ruta permite usar model binding de Laravel
- ✅ Agrupa rutas relacionadas con prefijo
- ✅ Middleware `auth` protege endpoints sensibles

#### Ruta Pública para Webhook
```php
Route::post('/webhook/stripe', [PaymentController::class, 'webhook']);
```

**Por qué pública**:
- ✅ Stripe necesita acceder sin autenticación
- ✅ Seguridad mediante verificación de firma del webhook
- ✅ Excluida de CSRF en `bootstrap/app.php`

### Frontend (React/TypeScript)

#### `resources/js/pages/Registrations/Checkout.tsx`
**Qué hace**:
1. Muestra resumen del torneo y precio
2. Al click en "Proceder al pago":
   - Hace POST a `/registrations/{id}/create-checkout-session`
   - Obtiene token CSRF de la cookie `XSRF-TOKEN`
   - Recibe `url` de Stripe
   - Redirige a Stripe Checkout

**Por qué manejo manual de CSRF**:
```typescript
const getCsrfToken = () => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; XSRF-TOKEN=`);
    return decodeURIComponent(parts.pop()?.split(';').shift() || '');
};
```
- ✅ Fetch API no incluye automáticamente el token CSRF
- ✅ Laravel espera `X-XSRF-TOKEN` header
- ✅ Token está en cookie encriptada, necesitamos decodificar

#### `resources/js/pages/Registrations/PaymentSuccess.tsx`
**Qué muestra**: Confirmación visual, número de inscripción, enlaces
**Por qué**: UX - El usuario necesita feedback inmediato y opciones de navegación

#### `resources/js/pages/Registrations/PaymentCancelled.tsx`
**Qué muestra**: Mensaje de cancelación, botón de reintentar
**Por qué**: Dar al usuario opción de volver a intentar sin perder su inscripción

### Configuración

#### `config/services.php`
```php
'stripe' => [
    'public' => env('STRIPE_PUBLIC_KEY'),
    'secret' => env('STRIPE_SECRET_KEY'),
    'webhook_secret' => env('STRIPE_WEBHOOK_SECRET'),
],
```
**Por qué**: Centraliza configuración de terceros, usa variables de entorno para seguridad

#### `bootstrap/app.php`
```php
$middleware->validateCsrfTokens(except: [
    'webhook/stripe',
]);
```
**Por qué**: Stripe no puede enviar token CSRF, pero validamos con firma del webhook

---

## 📋 Configuración

### 1. Instalar Dependencias

#### Backend (Laravel)
```bash
composer require stripe/stripe-php
```
**Por qué**: SDK oficial de Stripe para PHP, maneja autenticación, rate limiting, etc.

#### Frontend (React)
```bash
npm install @stripe/stripe-js
```
**Por qué**: Aunque usamos Checkout hosted, esta librería sería necesaria para Stripe Elements

### 2. Configurar Variables de Entorno

En `.env`:
```env
STRIPE_PUBLIC_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

**Cómo obtenerlas**:
1. Ve a https://dashboard.stripe.com/test/apikeys
2. Copia las claves de prueba
3. Para webhook secret: Dashboard → Webhooks → Add endpoint → Copia signing secret

### 3. Ejecutar Migraciones
```bash
php artisan migrate
```

### 4. Configurar Webhook (Opcional en desarrollo)

**Opción 1: Sin webhook (más simple para empezar)**
- El flujo funciona sin webhooks
- La página de éxito confirma el pago consultando a Stripe

**Opción 2: Túnel HTTP (ngrok/tunnelmole)**
```bash
npx tunnelmole 8000
```
- Expone localhost a internet
- Usa la URL pública en Stripe Dashboard → Webhooks

**Opción 3: Stripe CLI**
```bash
stripe listen --forward-to localhost:8000/webhook/stripe
```
- Más control para debugging
- Proporciona webhook secret temporal

---

## 🧪 Testing

### Tarjetas de Prueba de Stripe

**Pago Exitoso**:
```
Número: 4242 4242 4242 4242
Fecha: Cualquier fecha futura (ej: 12/34)
CVC: Cualquier 3 dígitos (ej: 123)
ZIP: Cualquier 5 dígitos (ej: 12345)
```

**Pago que Requiere Autenticación**:
```
Número: 4000 0027 6000 3184
```

**Pago Rechazado**:
```
Número: 4000 0000 0000 0002
```

### Probar el Flujo Completo

1. Crea un torneo de prueba:
```bash
php artisan tinker
```
```php
$game = App\Models\Game::create(['name' => 'Test Game', 'slug' => 'test']);
$tournament = App\Models\Tournament::create([
    'name' => 'Torneo Prueba',
    'slug' => 'torneo-prueba',
    'game_id' => $game->id,
    'entry_fee' => 10.00,
    'status' => 'registration_open',
    'start_date' => now()->addDays(7),
    'end_date' => now()->addDays(8),
    'registration_start' => now()->subDay(),
    'registration_end' => now()->addDays(5),
]);
```

2. Navega a `/tournaments`
3. Inscríbete al torneo
4. Completa el pago con tarjeta de prueba
5. Verifica en Stripe Dashboard → Payments

---

## 🔐 Seguridad

### Medidas Implementadas

1. **Autenticación**: Rutas de pago protegidas con middleware `auth`
2. **Autorización**: Validamos que `registration->user_id === auth()->id()`
3. **CSRF Protection**: Todas las rutas excepto webhook
4. **Webhook Verification**: Firma verificada con `STRIPE_WEBHOOK_SECRET`
5. **HTTPS**: Obligatorio en producción (Stripe lo requiere)
6. **Claves en .env**: Nunca en código versionado

### Validaciones

```php
// En PaymentController@createCheckoutSession
if ($registration->user_id !== auth()->id()) {
    abort(403);
}

if ($registration->isPaymentConfirmed()) {
    return response()->json(['error' => 'Ya pagado'], 400);
}
```

---

## 🌍 Producción

### Checklist

- [ ] Cambiar a claves de producción en `.env`
- [ ] Configurar webhook en Stripe con dominio real (HTTPS)
- [ ] Cambiar moneda si no usas EUR (`StripeService.php:27`)
- [ ] Activar cuenta de Stripe (verificación de identidad)
- [ ] Configurar emails de confirmación
- [ ] Revisar límites de rate limiting
- [ ] Configurar logging de errores
- [ ] Backup de base de datos
- [ ] Términos de servicio y política de reembolsos

### Monitoreo

- Dashboard de Stripe: https://dashboard.stripe.com/payments
- Logs de Laravel: `storage/logs/laravel.log`
- Tabla `registrations` para reconciliación

---

## 🐛 Debugging

### Errores Comunes

**Error 419 (CSRF Token Mismatch)**
- Causa: Token CSRF no enviado o inválido
- Solución: Verificar que se obtiene de cookie `XSRF-TOKEN`

**Error 500 en createCheckoutSession**
- Causa: Claves de Stripe inválidas o usuario sin email
- Solución: Verificar `.env` y modelo User

**Webhook no recibe eventos**
- Causa: URL incorrecta o firewall
- Solución: Usar Stripe CLI o túnel HTTP

### Logs Útiles

```php
// En StripeService
\Log::info('Stripe session created', ['session_id' => $session->id]);

// En PaymentController
\Log::info('Webhook received', ['type' => $event->type]);
```

---

## 📚 Recursos

- [Stripe Checkout Documentation](https://stripe.com/docs/payments/checkout)
- [Stripe PHP SDK](https://github.com/stripe/stripe-php)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
- [Testing Stripe](https://stripe.com/docs/testing)
- [Laravel Payment Processing](https://laravel.com/docs/billing)
