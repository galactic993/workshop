<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * quotsテーブルのクエリパフォーマンス向上のためのインデックス追加
     * - section_cd_id: 部門別一覧取得で使用
     * - quot_status: ステータス別絞り込みで使用
     * - quot_on: 日付範囲検索で使用
     * - customer_id: 得意先別検索で使用
     * - 複合インデックス: よく使われる検索条件の組み合わせ
     */
    public function up(): void
    {
        Schema::table('quots', function (Blueprint $table) {
            // 単一カラムインデックス
            $table->index('section_cd_id', 'quots_section_cd_id_index');
            $table->index('quot_status', 'quots_quot_status_index');
            $table->index('quot_on', 'quots_quot_on_index');
            $table->index('customer_id', 'quots_customer_id_index');

            // 複合インデックス（よく使われる検索パターン）
            $table->index(['section_cd_id', 'quot_on'], 'quots_section_cd_id_quot_on_index');
            $table->index(['section_cd_id', 'quot_status'], 'quots_section_cd_id_quot_status_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('quots', function (Blueprint $table) {
            $table->dropIndex('quots_section_cd_id_index');
            $table->dropIndex('quots_quot_status_index');
            $table->dropIndex('quots_quot_on_index');
            $table->dropIndex('quots_customer_id_index');
            $table->dropIndex('quots_section_cd_id_quot_on_index');
            $table->dropIndex('quots_section_cd_id_quot_status_index');
        });
    }
};
