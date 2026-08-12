<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('site_appearances', function (Blueprint $table) {
            $table->unsignedTinyInteger('logo_height_mobile')->default(30)->after('display_font');
            $table->unsignedTinyInteger('logo_height_desktop')->default(42)->after('logo_height_mobile');
        });
    }

    public function down(): void
    {
        Schema::table('site_appearances', function (Blueprint $table) {
            $table->dropColumn(['logo_height_mobile', 'logo_height_desktop']);
        });
    }
};
