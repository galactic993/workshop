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
        Schema::create('quots', function (Blueprint $table) {
            // 見積id (自動採番)
            $table->bigIncrements('quot_id');

            // 担当部署id (部署コードマスタ.id FK制約restrict)
            $table->bigInteger('section_cd_id');
            $table->foreign('section_cd_id')
                ->references('section_cd_id')
                ->on('section_cds')
                ->onDelete('restrict')
                ->onUpdate('restrict');

            // 担当者id (社員マスタ.id FK制約restrict)
            $table->bigInteger('employee_id');
            $table->foreign('employee_id')
                ->references('employee_id')
                ->on('employees')
                ->onDelete('restrict')
                ->onUpdate('restrict');

            // 見積書No (8桁、YY-00001形式、一意制約)
            $table->char('quot_number', 8);
            $table->unique('quot_number');

            // 品名 (50桁以内)
            $table->string('prod_name', 50);

            // 得意先id (得意先マスタ.id FK制約restrict)
            $table->bigInteger('customer_id');
            $table->foreign('customer_id')
                ->references('customer_id')
                ->on('customers')
                ->onDelete('restrict')
                ->onUpdate('restrict');

            // 見積件名 (50桁以内)
            $table->string('quot_subject', 50);

            // 見積概要
            $table->text('quot_summary');

            // 主管センターid (部署コードマスタ.id FK制約restrict)
            $table->bigInteger('center_section_cd_id');
            $table->foreign('center_section_cd_id')
                ->references('section_cd_id')
                ->on('section_cds')
                ->onDelete('restrict')
                ->onUpdate('restrict');

            // 承認者id (社員マスタ.id FK制約restrict)
            $table->bigInteger('approved_by')->nullable();
            $table->foreign('approved_by')
                ->references('employee_id')
                ->on('employees')
                ->onDelete('restrict')
                ->onUpdate('restrict');

            // 承認日時
            $table->timestamp('approved_at', 0)->nullable();

            // ステータス (00:登録済, 10:制作見積依頼済, 20:制作見積中, 30:制作見積済, 40:承認待ち, 50:承認済, 60:発行済)
            $table->char('status', 2)->default('00');

            // 見積金額 (12桁以内、小数なし)
            $table->decimal('quot_amount', 12, 0)->nullable();

            // 提出方法 (00:メール, 10:郵送, 20:持参)
            $table->char('submission_method', 2)->nullable();

            // 見積日
            $table->date('quot_date')->nullable();

            // 見積結果 (00:未確定, 10:受注, 20:失注)
            $table->char('quot_result', 2)->default('00');

            // 失注理由
            $table->text('lost_reason')->nullable();

            // 作成日・更新日
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quots');
    }
};
