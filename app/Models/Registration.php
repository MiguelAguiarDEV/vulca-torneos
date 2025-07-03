<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Registration extends Model
{
    use HasFactory;

    /**
     * Status constants
     */
    const STATUS_PENDING = 'pending';
    const STATUS_CONFIRMED = 'confirmed';
    const STATUS_CANCELLED = 'cancelled';

    /**
     * Payment status constants
     */
    const PAYMENT_PENDING = 'pending';
    const PAYMENT_CONFIRMED = 'confirmed';
    const PAYMENT_FAILED = 'failed';

    /**
     * Payment method constants
     */
    const PAYMENT_CASH = 'cash';
    const PAYMENT_TRANSFER = 'transfer';
    const PAYMENT_CARD = 'card';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'tournament_id',
        'status',
        'registered_at',
        'payment_method',
        'payment_status',
        'amount',
        'payment_notes',
        'payment_confirmed_at',
        'payment_confirmed_by',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'registered_at' => 'datetime',
        'payment_confirmed_at' => 'datetime',
        'user_id' => 'integer',
        'tournament_id' => 'integer',
        'payment_confirmed_by' => 'integer',
        'amount' => 'decimal:2',
    ];

    /**
     * Relationship with User model.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relationship with Tournament model.
     */
    public function tournament()
    {
        return $this->belongsTo(Tournament::class);
    }

    /**
     * Relationship with User who confirmed the payment.
     */
    public function paymentConfirmedBy()
    {
        return $this->belongsTo(User::class, 'payment_confirmed_by');
    }

    /**
     * Get all available statuses.
     */
    public static function getStatuses()
    {
        return [
            self::STATUS_PENDING,
            self::STATUS_CONFIRMED,
            self::STATUS_CANCELLED,
        ];
    }

    /**
     * Get all available payment statuses.
     */
    public static function getPaymentStatuses()
    {
        return [
            self::PAYMENT_PENDING,
            self::PAYMENT_CONFIRMED,
            self::PAYMENT_FAILED,
        ];
    }

    /**
     * Get all available payment methods.
     */
    public static function getPaymentMethods()
    {
        return [
            self::PAYMENT_CASH,
            self::PAYMENT_TRANSFER,
            self::PAYMENT_CARD,
        ];
    }

    /**
     * Scope to filter by status.
     */
    public function scopeStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope to filter by payment status.
     */
    public function scopePaymentStatus($query, $status)
    {
        return $query->where('payment_status', $status);
    }

    /**
     * Scope to filter by payment method.
     */
    public function scopePaymentMethod($query, $method)
    {
        return $query->where('payment_method', $method);
    }

    /**
     * Scope to filter pending registrations.
     */
    public function scopePending($query)
    {
        return $query->where('status', self::STATUS_PENDING);
    }

    /**
     * Scope to filter confirmed registrations.
     */
    public function scopeConfirmed($query)
    {
        return $query->where('status', self::STATUS_CONFIRMED);
    }

    /**
     * Scope to filter cancelled registrations.
     */
    public function scopeCancelled($query)
    {
        return $query->where('status', self::STATUS_CANCELLED);
    }

    /**
     * Scope to get pending payments.
     */
    public function scopePendingPayments($query)
    {
        return $query->where('payment_status', self::PAYMENT_PENDING);
    }

    /**
     * Scope to filter by tournament.
     */
    public function scopeForTournament($query, $tournamentId)
    {
        return $query->where('tournament_id', $tournamentId);
    }

    /**
     * Scope to filter by user.
     */
    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Check if registration is pending.
     */
    public function isPending()
    {
        return $this->status === self::STATUS_PENDING;
    }

    /**
     * Check if registration is confirmed.
     */
    public function isConfirmed()
    {
        return $this->status === self::STATUS_CONFIRMED;
    }

    /**
     * Check if registration is cancelled.
     */
    public function isCancelled()
    {
        return $this->status === self::STATUS_CANCELLED;
    }

    /**
     * Check if payment is pending.
     */
    public function isPaymentPending()
    {
        return $this->payment_status === self::PAYMENT_PENDING;
    }

    /**
     * Check if payment is confirmed.
     */
    public function isPaymentConfirmed()
    {
        return $this->payment_status === self::PAYMENT_CONFIRMED;
    }

    /**
     * Confirm the registration.
     */
    public function confirm()
    {
        $this->update(['status' => self::STATUS_CONFIRMED]);
    }

    /**
     * Cancel the registration.
     */
    public function cancel()
    {
        $this->update(['status' => self::STATUS_CANCELLED]);
    }

    /**
     * Confirm payment.
     */
    public function confirmPayment($confirmedBy = null)
    {
        $this->update([
            'payment_status' => self::PAYMENT_CONFIRMED,
            'payment_confirmed_at' => now(),
            'payment_confirmed_by' => $confirmedBy ?: auth()->id(),
            'status' => self::STATUS_CONFIRMED,
        ]);
    }
}
