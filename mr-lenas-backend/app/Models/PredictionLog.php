<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PredictionLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'predicted_qty',
        'prediction_date',
        'model_used',
        'accuracy',
    ];

    protected function casts(): array
    {
        return [
            'prediction_date' => 'date',
            'accuracy'        => 'decimal:2',
        ];
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}