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
        Schema::table('quots', function (Blueprint $table) {
            $table->text('message')->nullable()->after('lost_reason')->comment('伝達事項');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('quots', function (Blueprint $table) {
            $table->dropColumn('message');
        });
    }
};
