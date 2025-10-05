<?php

namespace App\Http\Controllers;

use App\Models\Registration;
use App\Models\Tournament;
use App\Services\StripeService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentController extends Controller
{
    protected $stripeService;

    public function __construct(StripeService $stripeService)
    {
        $this->stripeService = $stripeService;
    }

    /**
     * Show the checkout page for a registration.
     */
    public function checkout(Registration $registration)
    {
        // Verify the registration belongs to the authenticated user
        if ($registration->user_id !== auth()->id()) {
            abort(403, 'No autorizado para ver esta inscripción.');
        }

        // Check if payment is already confirmed
        if ($registration->isPaymentConfirmed()) {
            return redirect()->route('tournaments.show', $registration->tournament)
                ->with('info', 'Esta inscripción ya ha sido pagada.');
        }

        $tournament = $registration->tournament;

        // Check if tournament has entry fee
        if ($tournament->entry_fee == 0) {
            return redirect()->route('tournaments.show', $tournament)
                ->with('info', 'Este torneo no requiere pago.');
        }

        return Inertia::render('Registrations/Checkout', [
            'registration' => $registration->load('tournament'),
            'tournament' => $tournament,
            'stripePublicKey' => config('services.stripe.public'),
        ]);
    }

    /**
     * Create a Stripe checkout session.
     */
    public function createCheckoutSession(Registration $registration)
    {
        // Verify the registration belongs to the authenticated user
        if ($registration->user_id !== auth()->id()) {
            abort(403, 'No autorizado para procesar este pago.');
        }

        // Check if payment is already confirmed
        if ($registration->isPaymentConfirmed()) {
            return response()->json([
                'error' => 'Esta inscripción ya ha sido pagada.'
            ], 400);
        }

        $tournament = $registration->tournament;

        try {
            $session = $this->stripeService->createCheckoutSession($tournament, $registration);

            return response()->json([
                'sessionId' => $session->id,
                'url' => $session->url,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al crear la sesión de pago: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Handle successful payment.
     */
    public function success(Registration $registration, Request $request)
    {
        $sessionId = $request->query('session_id');

        if (!$sessionId) {
            return redirect()->route('tournaments.index')
                ->with('error', 'Sesión de pago no encontrada.');
        }

        try {
            $session = $this->stripeService->retrieveCheckoutSession($sessionId);

            if ($session->payment_status === 'paid') {
                $this->stripeService->handleSuccessfulPayment($registration, $session);

                return Inertia::render('Registrations/PaymentSuccess', [
                    'registration' => $registration->load('tournament'),
                    'tournament' => $registration->tournament,
                ]);
            }

            return redirect()->route('tournaments.show', $registration->tournament)
                ->with('warning', 'El pago aún está pendiente de confirmación.');
        } catch (\Exception $e) {
            return redirect()->route('tournaments.show', $registration->tournament)
                ->with('error', 'Error al verificar el pago: ' . $e->getMessage());
        }
    }

    /**
     * Handle cancelled payment.
     */
    public function cancel(Registration $registration)
    {
        return Inertia::render('Registrations/PaymentCancelled', [
            'registration' => $registration->load('tournament'),
            'tournament' => $registration->tournament,
        ]);
    }

    /**
     * Handle Stripe webhook.
     */
    public function webhook(Request $request)
    {
        $payload = $request->getContent();
        $signature = $request->header('Stripe-Signature');

        try {
            $event = $this->stripeService->verifyWebhookSignature($payload, $signature);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Invalid signature'], 400);
        }

        // Handle the event
        switch ($event->type) {
            case 'checkout.session.completed':
                $session = $event->data->object;
                $this->handleCheckoutSessionCompleted($session);
                break;

            case 'payment_intent.succeeded':
                $paymentIntent = $event->data->object;
                $this->handlePaymentIntentSucceeded($paymentIntent);
                break;

            case 'payment_intent.payment_failed':
                $paymentIntent = $event->data->object;
                $this->handlePaymentIntentFailed($paymentIntent);
                break;

            default:
                // Unhandled event type
        }

        return response()->json(['status' => 'success']);
    }

    /**
     * Handle checkout session completed event.
     */
    protected function handleCheckoutSessionCompleted($session)
    {
        $registrationId = $session->client_reference_id ?? $session->metadata->registration_id ?? null;

        if (!$registrationId) {
            return;
        }

        $registration = Registration::find($registrationId);

        if (!$registration) {
            return;
        }

        if ($session->payment_status === 'paid') {
            $this->stripeService->handleSuccessfulPayment($registration, $session);
        }
    }

    /**
     * Handle payment intent succeeded event.
     */
    protected function handlePaymentIntentSucceeded($paymentIntent)
    {
        $registration = Registration::where('stripe_payment_intent_id', $paymentIntent->id)->first();

        if ($registration && !$registration->isPaymentConfirmed()) {
            $registration->updateStripePaymentStatus('succeeded', $paymentIntent->id);
            $registration->confirmPayment();
        }
    }

    /**
     * Handle payment intent failed event.
     */
    protected function handlePaymentIntentFailed($paymentIntent)
    {
        $registration = Registration::where('stripe_payment_intent_id', $paymentIntent->id)->first();

        if ($registration) {
            $registration->updateStripePaymentStatus('failed', $paymentIntent->id);
            $registration->failPayment();
        }
    }
}
