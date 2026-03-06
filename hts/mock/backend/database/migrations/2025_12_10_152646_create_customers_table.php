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
        Schema::create('customers', function (Blueprint $table) {
            // 得意先マスタid (自動採番)
            $table->bigIncrements('customer_id');
            $table->unique('customer_id');

            // 得意先コード (半角数字5桁、一意制約)
            $table->char('customer_cd', 5);
            $table->unique('customer_cd');

            // 得意先名 (30桁以内)
            $table->string('customer_name', 30);

            // フリガナ (50桁以内)
            $table->string('customer_name_kana', 50);

            // 会社団体id (FK制約 restrict)
            $table->bigInteger('company_id');
            $table->foreign('company_id')
                ->references('company_id')
                ->on('companies')
                ->onDelete('restrict')
                ->onUpdate('restrict');

            // 郵便番号 (7桁)
            $table->char('postal_cd', 7)->nullable();

            // 住所1 (100桁以内、都道府県市区町村番地)
            $table->string('address1', 100)->nullable();

            // 住所2 (50桁以内、建物名称等)
            $table->string('address2', 50)->nullable();

            // 代表者氏名 (30桁以内、役職は含まず)
            $table->string('representative_name', 30);

            // 電話番号 (「-」含む)
            $table->string('phone_number', 15);

            // FAX番号 (「-」含む)
            $table->string('fax_number', 15)->nullable();

            // メールアドレス (256桁以内)
            $table->string('email', 256)->nullable();

            // 検収区分 (0:無, 1:有)
            $table->boolean('is_inspection')->default(false);

            // 検収期間月数 (半角数字2桁以内)
            $table->string('inspection_term_months', 2)->nullable();

            // 検収日 (半角数字2桁以内)
            $table->string('inspection_date', 2)->nullable();

            // 支払期間月数 (半角数字2桁以内)
            $table->string('payment_term_months', 2);

            // 支払日 (半角数字2桁以内)
            $table->string('payment_date', 2);

            // 支払方法 (00:口座, 10:現金, 20:小切手, 30:手形)
            $table->char('payment_method', 2)->default('00');

            // 消費税集計区分 (0:切り捨て, 1:四捨五入)
            $table->boolean('is_tax_rounded')->default(true);

            // 振込手数料負担区分 (0:先方負担, 1:当方負担)
            $table->boolean('is_fee_bearer')->default(false);

            // 与信限度額 (30桁以内)
            $table->string('credit_limit', 30);

            // 一品毎受注限度額 (12桁以内、小数なし)
            $table->decimal('order_limit', 12, 0);

            // 値引有無 (0:無, 1:有)
            $table->boolean('is_discount')->default(false);

            // ソフトデリート
            $table->softDeletes();

            // 更新日のみ (created_at は使用しない)
            $table->timestamp('updated_at', 0)->useCurrent()->useCurrentOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};
