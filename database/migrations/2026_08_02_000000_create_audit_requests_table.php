<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('audit_requests', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('email');
            $table->string('country_code', 10);
            $table->string('phone', 40);
            $table->string('website');
            $table->string('monthly_revenue', 30);
            $table->string('list_size', 30);
            $table->string('email_revenue_pct', 30);
            $table->timestamps();

            $table->index(['email', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audit_requests');
    }
};
