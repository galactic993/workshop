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
        Schema::table('departments', function (Blueprint $table) {
            // 組織区分 (NOT NULL, 00:スタッフ 10:営業 20:制作 30:印刷)
            $table->char('department_category', 2)
                ->after('center_id')
                ->comment('00:スタッフ 10:営業 20:制作 30:印刷');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('departments', function (Blueprint $table) {
            $table->dropColumn('department_category');
        });
    }
};
