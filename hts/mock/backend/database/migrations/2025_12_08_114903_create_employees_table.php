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
        Schema::create('employees', function (Blueprint $table) {
            // 社員マスタid (PK, BIGINT without auto-increment)
            $table->bigInteger('employee_id')->primary()->comment('社員マスタid');

            // 社員コード (CHAR(6), UNIQUE, NOT NULL)
            $table->char('employee_cd', 6)->unique()->comment('社員コード（半角数字6桁）');

            // 社員名 (VARCHAR(30), NOT NULL)
            $table->string('employee_name', 30)->comment('社員名（30桁以内）');

            // メールアドレス (VARCHAR(256), NOT NULL)
            $table->string('email', 256)->comment('メールアドレス（256桁以内）');

            // アクセス区分 (CHAR(2), NOT NULL, DEFAULT '40')
            $table->char('access_type', 2)->default('40')->comment('アクセス区分（00:全て, 10:ディレクター, 20:所長, 30:リーダー, 40:一般）');

            // 削除日 (TIMESTAMP(0), NULLABLE)
            $table->timestamp('deleted_at', 0)->nullable()->comment('削除日');

            // 更新日 (TIMESTAMP(0), NOT NULL, DEFAULT CURRENT_TIMESTAMP)
            $table->timestamp('updated_at', 0)->useCurrent()->comment('更新日');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};
