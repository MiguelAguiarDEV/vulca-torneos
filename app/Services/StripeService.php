<?php

namespace App\Services;

use App\Models\Registration;
use App\Models\Tournament;
use Stripe\Stripe;
use Stripe\Checkout\Session as StripeSession;
use Stripe\PaymentIntent;

class StripeService
{
    public function __construct()
    {
        Stripe::setApiKey(config('services.stripe.secret'));
    }

    /**
     * Create a Stripe Checkout Session for tournament registration.
     */
    public function createCheckoutSession(Tournament $tournament, Registration $registration)
    {
        $session = StripeSession::create([
            'payment_method_types' => ['card'],
            'line_items' => [[
                'price_data' => [
                    'currency' => 'eur', // Cambia según tu moneda
                    'product_data' => [
                        'name' => 'Inscripción: ' . $tournament->name,
                        'description' => 'Inscripción al torneo ' . $tournament->name,
                        'images' => $tournament->image ? [url($tournament->image)] : [],
                    ],
                    'unit_amount' => (int) ($tournament->entry_fee * 100), // Stripe usa centavos
                ],
                'quantity' => 1,
            ]],
            'mode' => 'payment',
            'success_url' => route('registration.payment.success', ['registration' => $registration->id]) . '?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => route('registration.payment.cancel', ['registration' => $registration->id]),
            'client_reference_id' => $registration->id,
            'customer_email' => $registration->user->email,
            'metadata' => [
                'registration_id' => $registration->id,
                'tournament_id' => $tournament->id,
                'user_id' => $registration->user_id,
            ],
        ]);

        // Save the checkout session ID
        $registration->update([
            'stripe_checkout_session_id' => $session->id,
            'stripe_payment_status' => 'pending',
        ]);

        return $session;
    }

    /**
     * Retrieve a checkout session.
     */
    public function retrieveCheckoutSession($sessionId)
    {
        return StripeSession::retrieve($sessionId);
    }

    /**
     * Retrieve a payment intent.
     */
    public function retrievePaymentIntent($paymentIntentId)
    {
        return PaymentIntent::retrieve($paymentIntentId);
    }

    /**
     * Handle successful payment.
     */
    public function handleSuccessfulPayment(Registration $registration, $session)
    {
        $registration->update([
            'payment_status' => Registration::PAYMENT_CONFIRMED,
            'payment_method' => Registration::PAYMENT_STRIPE,
            'payment_confirmed_at' => now(),
            'status' => Registration::STATUS_CONFIRMED,
            'stripe_payment_intent_id' => $session->payment_intent,
            'stripe_payment_status' => 'succeeded',
        ]);

        return $registration;
    }

    /**
     * Handle failed payment.
     */
    public function handleFailedPayment(Registration $registration)
    {
        $registration->update([
            'payment_status' => Registration::PAYMENT_FAILED,
            'stripe_payment_status' => 'failed',
        ]);

        return $registration;
    }

    /**
     * Verify webhook signature.
     */
    public function verifyWebhookSignature($payload, $signature)
    {
        return \Stripe\Webhook::constructEvent(
            $payload,
            $signature,
            config('services.stripe.webhook_secret')
        );
    }
}
