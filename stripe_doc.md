# Documentación de Integración de Stripe

## ✅ Implementación completada

### Backend (Laravel):
1. **Migración** - Campos de Stripe agregados a la tabla `registrations`
   - `stripe_payment_intent_id`
   - `stripe_checkout_session_id`
   - `stripe_payment_status`

2. **Modelo** - `Registration` actualizado con métodos para Stripe
   - Constante `PAYMENT_STRIPE` agregada
   - Método `isStripePayment()`
   - Método `failPayment()`
   - Método `updateStripePaymentStatus()`

3. **Servicio** - `app/Services/StripeService.php` para manejar la lógica de pagos
   - `createCheckoutSession()` - Crea sesión de pago en Stripe
   - `retrieveCheckoutSession()` - Obtiene información de una sesión
   - `retrievePaymentIntent()` - Obtiene información de un pago
   - `handleSuccessfulPayment()` - Maneja pagos exitosos
   - `handleFailedPayment()` - Maneja pagos fallidos
   - `verifyWebhookSignature()` - Verifica webhooks de Stripe

4. **Controlador** - `app/Http/Controllers/PaymentController.php`
   - `checkout()` - Muestra página de checkout
   - `createCheckoutSession()` - Crea sesión de Stripe
   - `success()` - Maneja pago exitoso
   - `cancel()` - Maneja pago cancelado
   - `webhook()` - Procesa webhooks de Stripe

5. **Rutas** - Configuradas en `routes/web.php`
   ```php
   // Rutas autenticadas
   Route::prefix('registrations/{registration}')->as('registration.')->group(function () {
       Route::get('/checkout', [PaymentController::class, 'checkout'])->name('payment.checkout');
       Route::post('/create-checkout-session', [PaymentController::class, 'createCheckoutSession'])->name('payment.create-session');
       Route::get('/payment/success', [PaymentController::class, 'success'])->name('payment.success');
       Route::get('/payment/cancel', [PaymentController::class, 'cancel'])->name('payment.cancel');
   });

   // Webhook (público, sin CSRF)
   Route::post('/webhook/stripe', [PaymentController::class, 'webhook'])->name('stripe.webhook');
   ```

6. **Configuración** - Variables de entorno en `config/services.php`
   ```php
   'stripe' => [
       'public' => env('STRIPE_PUBLIC_KEY'),
       'secret' => env('STRIPE_SECRET_KEY'),
       'webhook_secret' => env('STRIPE_WEBHOOK_SECRET'),
   ],
   ```

7. **Middleware** - Webhook excluido de verificación CSRF en `bootstrap/app.php`
   ```php
   $middleware->validateCsrfTokens(except: [
       'webhook/stripe',
   ]);
   ```

### Frontend (React):
1. **Checkout** - `resources/js/pages/Registrations/Checkout.tsx`
   - Página de pago con información del torneo
   - Botón para iniciar proceso de pago con Stripe
   - Manejo de errores

2. **Éxito** - `resources/js/pages/Registrations/PaymentSuccess.tsx`
   - Confirmación de pago exitoso
   - Detalles de la inscripción
   - Enlaces para ver el torneo

3. **Cancelación** - `resources/js/pages/Registrations/PaymentCancelled.tsx`
   - Notificación de pago cancelado
   - Opción para reintentar el pago

## 📋 Pasos para activar:

### 1. Configurar variables de entorno
Agrega tus claves de Stripe en tu archivo `.env`:
```env
STRIPE_PUBLIC_KEY=pk_test_tu_clave_publica
STRIPE_SECRET_KEY=sk_test_tu_clave_secreta
STRIPE_WEBHOOK_SECRET=whsec_tu_secret_webhook
```

**Nota:** Para obtener las claves:
- Ve a https://dashboard.stripe.com/test/apikeys
- Copia la "Publishable key" (pk_test_...) para `STRIPE_PUBLIC_KEY`
- Copia la "Secret key" (sk_test_...) para `STRIPE_SECRET_KEY`

### 2. Instalar dependencia de npm
```bash
npm install @stripe/stripe-js
```

### 3. Ejecutar la migración
```bash
php artisan migrate
```

Esto agregará los campos de Stripe a la tabla `registrations`.

### 4. Configurar webhook en Stripe
1. Ve a tu dashboard de Stripe → **Developers** → **Webhooks**
2. Click en **"Add endpoint"**
3. URL del endpoint: `https://tu-dominio.com/webhook/stripe`
   - Para desarrollo local con Stripe CLI: `http://localhost:8000/webhook/stripe`
4. Selecciona estos eventos:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Click en **"Add endpoint"**
6. Copia el **"Signing secret"** (empieza con `whsec_...`)
7. Agrégalo a tu `.env` como `STRIPE_WEBHOOK_SECRET`

#### Alternativa para desarrollo local: Stripe CLI
```bash
# Instalar Stripe CLI
# https://stripe.com/docs/stripe-cli

# Login
stripe login

# Escuchar webhooks
stripe listen --forward-to localhost:8000/webhook/stripe
```

Esto te dará un webhook secret temporal que puedes usar en desarrollo.

### 5. Limpiar caché de configuración
```bash
php artisan config:clear
php artisan cache:clear
```

## 🔄 Flujo de pago

1. **Usuario se inscribe** al torneo → Se crea un registro con `payment_status = 'pending'`
2. **Usuario accede al checkout** → `route('registration.payment.checkout', $registration->id)`
3. **Usuario hace click en "Proceder al pago"**:
   - Se crea una sesión de Stripe Checkout
   - Se redirige al usuario a Stripe
4. **Usuario completa el pago** en Stripe:
   - Stripe redirige a la página de éxito
   - El webhook confirma el pago
   - Se actualiza `payment_status = 'confirmed'` y `status = 'confirmed'`
5. **Si cancela**: Redirige a página de cancelación

## 💻 Uso en tu aplicación

### Redirigir a checkout después de inscripción
En tu controlador de torneos, después de crear la inscripción:

```php
public function register(Tournament $tournament)
{
    // Crear inscripción
    $registration = Registration::create([
        'user_id' => auth()->id(),
        'tournament_id' => $tournament->id,
        'status' => Registration::STATUS_PENDING,
        'payment_status' => Registration::PAYMENT_PENDING,
        'amount' => $tournament->entry_fee,
        'registered_at' => now(),
    ]);

    // Si el torneo tiene costo, redirigir a checkout
    if ($tournament->entry_fee > 0) {
        return redirect()->route('registration.payment.checkout', $registration->id)
            ->with('success', 'Inscripción iniciada. Por favor completa el pago.');
    }

    // Si es gratis, confirmar directamente
    $registration->confirm();
    return redirect()->route('tournaments.show', $tournament)
        ->with('success', 'Te has inscrito exitosamente.');
}
```

### Botón de pago en React/Inertia
```tsx
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

// Si la inscripción está pendiente de pago
{registration.payment_status === 'pending' && (
  <Button asChild>
    <Link href={route('registration.payment.checkout', registration.id)}>
      Pagar inscripción
    </Link>
  </Button>
)}
```

## 🧪 Testing en modo prueba

Stripe proporciona tarjetas de prueba:

**Pago exitoso:**
- Número: `4242 4242 4242 4242`
- Fecha: Cualquier fecha futura
- CVC: Cualquier 3 dígitos
- ZIP: Cualquier 5 dígitos

**Pago fallido:**
- Número: `4000 0000 0000 0002`

Más tarjetas de prueba: https://stripe.com/docs/testing

## 🔐 Seguridad

- ✅ Verificación de CSRF deshabilitada solo para webhook
- ✅ Verificación de firma de webhook con `STRIPE_WEBHOOK_SECRET`
- ✅ Validación de que el usuario es dueño de la inscripción
- ✅ Verificación de estado de pago antes de procesar
- ✅ Claves secretas en variables de entorno

## 📊 Monitoreo

Puedes monitorear los pagos en:
- **Dashboard de Stripe**: https://dashboard.stripe.com/test/payments
- **Logs de webhook**: https://dashboard.stripe.com/test/webhooks
- **Base de datos**: Tabla `registrations` con campos de Stripe

## 🌍 Producción

### Antes de ir a producción:

1. **Cambiar a claves de producción** en `.env`:
   ```env
   STRIPE_PUBLIC_KEY=pk_live_...
   STRIPE_SECRET_KEY=sk_live_...
   ```

2. **Configurar webhook de producción** en Stripe con tu dominio real

3. **Actualizar moneda** si no usas EUR:
   - Edita `app/Services/StripeService.php`
   - Cambia `'currency' => 'eur'` por tu moneda (usd, mxn, cop, etc.)

4. **Activar cuenta de Stripe**:
   - Completa el proceso de verificación en Stripe
   - Proporciona información de negocio y bancaria

5. **Revisar términos y condiciones**:
   - Asegúrate de cumplir con las políticas de Stripe
   - Agrega términos de servicio a tu sitio

## 🐛 Debugging

### Ver logs de Laravel
```bash
php artisan pail
# o
tail -f storage/logs/laravel.log
```

### Probar webhook manualmente
```bash
stripe trigger payment_intent.succeeded
```

### Revisar sesión de Stripe
En el código puedes agregar:
```php
dd($session); // Después de retrieveCheckoutSession()
```

## 📚 Recursos

- [Documentación de Stripe](https://stripe.com/docs)
- [Stripe Checkout](https://stripe.com/docs/payments/checkout)
- [Webhooks de Stripe](https://stripe.com/docs/webhooks)
- [Stripe PHP SDK](https://github.com/stripe/stripe-php)
- [Testing en Stripe](https://stripe.com/docs/testing)
