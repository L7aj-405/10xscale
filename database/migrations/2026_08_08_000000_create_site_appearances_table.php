<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('site_appearances', function (Blueprint $table) {
            $table->id();
            $table->string('accent_color', 7)->default('#FFE81A');
            $table->string('accent_text_color', 7)->default('#0B0B0B');
            $table->string('danger_color', 7)->default('#D92D20');
            $table->string('light_page_color', 7)->default('#FFFFFF');
            $table->string('light_surface_color', 7)->default('#FFFFFF');
            $table->string('light_muted_color', 7)->default('#F1EFE9');
            $table->string('light_text_color', 7)->default('#0B0B0B');
            $table->string('light_border_color', 7)->default('#0B0B0B');
            $table->string('dark_page_color', 7)->default('#0C0C0D');
            $table->string('dark_surface_color', 7)->default('#161618');
            $table->string('dark_muted_color', 7)->default('#202024');
            $table->string('dark_text_color', 7)->default('#F7F7F2');
            $table->string('dark_border_color', 7)->default('#EFEFE9');
            $table->string('nav_background_color', 7)->default('#0B0B0B');
            $table->string('nav_panel_color', 7)->default('#1C1C1C');
            $table->string('nav_text_color', 7)->default('#FFFFFF');
            $table->string('body_font', 30)->default('instrument-sans');
            $table->string('display_font', 30)->default('archivo');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('site_appearances');
    }
};
