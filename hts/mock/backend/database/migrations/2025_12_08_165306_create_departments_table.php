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
        Schema::create('departments', function (Blueprint $table) {
            // 組織ID (PK, UK, 自動採番なし)
            $table->bigInteger('department_id')->primary();
            $table->unique('department_id');

            // 組織名 (NOT NULL, 30桁以内)
            $table->string('department_name', 30);

            // センターフラグ (NOT NULL, Default: 0:チーム)
            $table->boolean('is_center')->default(false)->comment('0:チーム 1:センター');

            // 省略名 (6桁以内、センターの場合のみ)
            $table->string('display_name', 6)->nullable()->comment('センターの場合のみ');

            // 出力順 (UK、センターの場合のみ)
            $table->smallInteger('display_order')->nullable()->unique()->comment('センターの場合のみ');

            // センターID (FK: departments.department_id, RESTRICT)
            $table->foreignId('center_id')
                ->nullable()
                ->constrained('departments', 'department_id')
                ->restrictOnDelete()
                ->restrictOnUpdate()
                ->comment('組織.department_id FK制約restrict');

            // 削除日 (ソフトデリート)
            $table->softDeletes();

            // 更新日
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('departments');
    }
};
