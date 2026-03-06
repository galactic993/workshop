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
        Schema::create('prod_quots', function (Blueprint $table) {
            // 制作見積ID（主キー、自動採番）
            $table->bigIncrements('prod_quot_id');

            // 見積ID（FK: quots.quot_id、CASCADE）
            $table->unsignedBigInteger('quot_id');
            $table->foreign('quot_id')
                ->references('quot_id')
                ->on('quots')
                ->onDelete('cascade');

            // 基準金額（12桁以内、小数なし）
            $table->decimal('cost', 12, 0);

            // 制作見積書アップロード先
            $table->string('quot_doc_path', 255)->nullable();

            // 関連資料
            $table->string('reference_doc_path', 255)->nullable();

            // 営業提出日
            $table->date('submission_on')->nullable();

            // ステータス（00:未着手, 10:制作見積中, 20:制作見積済, 30:受取済, 40:発行済, 50:差戻）
            $table->char('prod_quot_status', 2)->default('00');

            // バージョン
            $table->smallInteger('version')->default(1);

            // タイムスタンプ
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('prod_quots');
    }
};
