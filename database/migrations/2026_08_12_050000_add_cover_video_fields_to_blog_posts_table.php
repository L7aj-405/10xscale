<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('blog_posts', function (Blueprint $table) {
            $table->string('cover_media_type', 16)->default('image')->after('author');
            $table->string('cover_video_path')->nullable()->after('cover_image_path');
            $table->text('cover_video_url')->nullable()->after('cover_video_path');
        });
    }

    public function down(): void
    {
        Schema::table('blog_posts', function (Blueprint $table) {
            $table->dropColumn(['cover_media_type', 'cover_video_path', 'cover_video_url']);
        });
    }
};
