<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('site_appearances', function (Blueprint $table) {
            $table->string('light_logo_path')->nullable()->after('display_font');
            $table->string('dark_logo_path')->nullable()->after('light_logo_path');
        });
    }

    public function down(): void
    {
        Schema::table('site_appearances', function (Blueprint $table) {
            $table->dropColumn(['light_logo_path', 'dark_logo_path']);
        });
    }
};
