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
        Schema::create('roster_entries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained()->onDelete('cascade');
            $table->foreignId('team_id')->constrained()->onDelete('cascade');
            $table->foreignId('player_profile_id')->constrained()->onDelete('cascade');
            $table->string('position')->nullable();
            $table->integer('jersey_number')->nullable();
            $table->boolean('is_active')->default(true);
            $table->date('joined_at')->nullable();
            $table->date('left_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['team_id', 'player_profile_id', 'deleted_at']);
            $table->index(['organization_id', 'team_id', 'is_active']);
            $table->index('player_profile_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('roster_entries');
    }
};
