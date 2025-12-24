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
        Schema::create('matches', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained()->onDelete('cascade');
            $table->foreignId('season_id')->constrained()->onDelete('cascade');
            $table->foreignId('division_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('ruleset_preset_id')->nullable()->constrained()->onDelete('set null');
            $table->string('name')->nullable();
            $table->enum('status', ['draft', 'scheduled', 'in_progress', 'awaiting_results', 'results_submitted', 'results_confirmed', 'disputed', 'resolved', 'canceled'])->default('draft');
            $table->timestamp('scheduled_at');
            $table->integer('best_of')->default(1);
            $table->json('map_pool')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['organization_id', 'season_id', 'status']);
            $table->index('scheduled_at');
            $table->index(['division_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('matches');
    }
};
