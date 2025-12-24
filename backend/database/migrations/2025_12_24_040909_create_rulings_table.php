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
        Schema::create('rulings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained()->onDelete('cascade');
            $table->foreignId('dispute_id')->constrained()->onDelete('cascade');
            $table->foreignId('match_id')->constrained()->onDelete('cascade');
            $table->foreignId('ruled_by')->constrained('users')->onDelete('cascade');
            $table->enum('decision', ['uphold', 'overturn', 'modify'])->default('uphold');
            $table->text('reasoning');
            $table->json('adjusted_scores')->nullable();
            $table->timestamps();

            $table->index(['organization_id', 'dispute_id']);
            $table->index('match_id');
            $table->index('ruled_by');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rulings');
    }
};
