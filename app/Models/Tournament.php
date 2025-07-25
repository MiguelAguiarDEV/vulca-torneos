<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Carbon\Carbon;

class Tournament extends Model
{
    use HasFactory;

    /**
     * Status constants
     */
    const STATUS_DRAFT = 'draft';
    const STATUS_PUBLISHED = 'published';
    const STATUS_REGISTRATION_OPEN = 'registration_open';
    const STATUS_REGISTRATION_CLOSED = 'registration_closed';
    const STATUS_ONGOING = 'ongoing';
    const STATUS_FINISHED = 'finished';
    const STATUS_CANCELLED = 'cancelled';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'slug',
        'description',
        'image',
        'game_id',
        'start_date',
        'end_date',
        'registration_start',
        'registration_end',
        'entry_fee',
        'has_registration_limit',
        'registration_limit',
        'status',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'registration_start' => 'datetime',
        'registration_end' => 'datetime',
        'entry_fee' => 'decimal:2',
        'has_registration_limit' => 'boolean',
        'registration_limit' => 'integer',
        'game_id' => 'integer',
    ];

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($tournament) {
            if (empty($tournament->slug)) {
                $tournament->slug = Str::slug($tournament->name);
            }
        });

        static::updating(function ($tournament) {
            if ($tournament->isDirty('name')) {
                $tournament->slug = Str::slug($tournament->name);
            }
        });
    }

    /**
     * Get the route key for the model.
     *
     * @return string
     */
    public function getRouteKeyName()
    {
        return 'slug';
    }

    /**
     * Relationship with Game model.
     */
    public function game()
    {
        return $this->belongsTo(Game::class);
    }

    /**
     * Relationship with registrations.
     */
    public function registrations()
    {
        return $this->hasMany(Registration::class);
    }

    /**
     * Get all available statuses.
     */
    public static function getStatuses()
    {
        return [
            self::STATUS_DRAFT,
            self::STATUS_PUBLISHED,
            self::STATUS_REGISTRATION_OPEN,
            self::STATUS_REGISTRATION_CLOSED,
            self::STATUS_ONGOING,
            self::STATUS_FINISHED,
            self::STATUS_CANCELLED,
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
     * Scope to filter published tournaments.
     */
    public function scopePublished($query)
    {
        return $query->where('status', '!=', self::STATUS_DRAFT);
    }

    /**
     * Scope to filter active tournaments.
     */
    public function scopeActive($query)
    {
        return $query->whereIn('status', [
            self::STATUS_PUBLISHED,
            self::STATUS_REGISTRATION_OPEN,
            self::STATUS_REGISTRATION_CLOSED,
            self::STATUS_ONGOING
        ]);
    }

    /**
     * Scope to filter by game.
     */
    public function scopeForGame($query, $gameId)
    {
        return $query->where('game_id', $gameId);
    }

    /**
     * Check if registration is open.
     */
    public function isRegistrationOpen()
    {
        return $this->status === self::STATUS_REGISTRATION_OPEN 
            && Carbon::now()->between($this->registration_start, $this->registration_end)
            && !$this->isRegistrationFull();
    }

    /**
     * Check if registration is full.
     */
    public function isRegistrationFull()
    {
        if (!$this->has_registration_limit) {
            return false;
        }
        
        return $this->registrations()->count() >= $this->registration_limit;
    }

    /**
     * Get available spots remaining.
     */
    public function getAvailableSpotsAttribute()
    {
        if (!$this->has_registration_limit) {
            return null; // Unlimited
        }
        
        $currentRegistrations = $this->registrations()->count();
        return max(0, $this->registration_limit - $currentRegistrations);
    }

    /**
     * Get registration progress percentage.
     */
    public function getRegistrationProgressAttribute()
    {
        if (!$this->has_registration_limit) {
            return null; // No limit, no progress
        }
        
        $currentRegistrations = $this->registrations()->count();
        return min(100, ($currentRegistrations / $this->registration_limit) * 100);
    }

    /**
     * Check if tournament is finished.
     */
    public function isFinished()
    {
        return $this->status === self::STATUS_FINISHED;
    }

    /**
     * Check if tournament is ongoing.
     */
    public function isOngoing()
    {
        return $this->status === self::STATUS_ONGOING;
    }

    /**
     * Check if tournament is cancelled.
     */
    public function isCancelled()
    {
        return $this->status === self::STATUS_CANCELLED;
    }

    /**
     * Get formatted entry fee.
     */
    public function getFormattedEntryFeeAttribute()
    {
        if ($this->entry_fee == 0) {
            return 'Gratis';
        }
        return '$' . number_format((float)$this->entry_fee, 2);
    }

    /**
     * Get registration period.
     */
    public function getRegistrationPeriodAttribute()
    {
        return $this->registration_start->format('d/m/Y H:i') . ' - ' . $this->registration_end->format('d/m/Y H:i');
    }

    /**
     * Get tournament duration.
     */
    public function getDurationAttribute()
    {
        return $this->start_date->format('d/m/Y H:i') . ' - ' . $this->end_date->format('d/m/Y H:i');
    }
}
