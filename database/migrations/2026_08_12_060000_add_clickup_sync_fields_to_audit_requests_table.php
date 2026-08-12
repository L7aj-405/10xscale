<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('audit_requests', function (Blueprint $table) {
            $table->string('clickup_task_id')->nullable()->after('email_revenue_pct')->index();
            $table->text('clickup_task_url')->nullable()->after('clickup_task_id');
            $table->string('clickup_sync_status', 16)->default('pending')->after('clickup_task_url')->index();
            $table->timestamp('clickup_synced_at')->nullable()->after('clickup_sync_status');
            $table->text('clickup_sync_error')->nullable()->after('clickup_synced_at');
        });
    }

    public function down(): void
    {
        Schema::table('audit_requests', function (Blueprint $table) {
            $table->dropIndex(['clickup_task_id']);
            $table->dropIndex(['clickup_sync_status']);
            $table->dropColumn([
                'clickup_task_id',
                'clickup_task_url',
                'clickup_sync_status',
                'clickup_synced_at',
                'clickup_sync_error',
            ]);
        });
    }
};
