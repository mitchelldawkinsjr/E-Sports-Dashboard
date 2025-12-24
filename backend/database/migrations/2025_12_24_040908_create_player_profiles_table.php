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
        Schema::create('player_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('display_name');
            $table->string('in_game_name')->nullable();
            $table->date('date_of_birth')->nullable();
            $table->string('grade')->nullable();
            $table->string('school')->nullable();
            $table->json('custom_fields_jsonb')->nullable(); // Extensible eligibility fields
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['organization_id', 'user_id']);
            $table->index('organization_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('player_profiles');
    }
};
