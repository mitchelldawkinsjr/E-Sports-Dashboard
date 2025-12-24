<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('standings_snapshots', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained()->onDelete('cascade');
            $table->foreignId('season_id')->constrained()->onDelete('cascade');
            $table->foreignId('division_id')->nullable()->constrained()->onDelete('cascade');
            $table->json('standings_data'); // Array of team standings with wins, losses, points, etc.
            $table->timestamp('computed_at');
            $table->timestamps();

            $table->unique(['season_id', 'division_id', 'computed_at']);
            $table->index(['organization_id', 'season_id']);
            $table->index('computed_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('standings_snapshots');
    }
};
