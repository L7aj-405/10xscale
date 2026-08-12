<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('team_members', function (Blueprint $table) {
            $table->id();
            $table->json('name');
            $table->json('role');
            $table->json('bio');
            $table->json('photo_label')->nullable();
            $table->string('initials', 6);
            $table->string('photo_path')->nullable();
            $table->string('linkedin_url', 2048)->nullable();
            $table->string('x_url', 2048)->nullable();
            $table->string('website_url', 2048)->nullable();
            $table->unsignedSmallInteger('position')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['is_active', 'position']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('team_members');
    }
};
