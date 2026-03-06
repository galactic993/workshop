<?php

namespace App\Enums;

/**
 * アクセス区分
 *
 * ユーザーの権限レベルを定義する列挙型
 */
enum AccessType: string
{
    case ALL = '00';         // 全て（管理者）
    case DIRECTOR = '10';    // ディレクター
    case MANAGER = '20';     // 所長
    case LEADER = '30';      // リーダー
    case GENERAL = '40';     // 一般

    /**
     * 全てのアクセス権限を持つかどうか
     */
    public function hasUnlimitedAccess(): bool
    {
        return $this === self::ALL;
    }

    /**
     * 日本語ラベルを取得
     */
    public function label(): string
    {
        return match ($this) {
            self::ALL => '全て',
            self::DIRECTOR => 'ディレクター',
            self::MANAGER => '所長',
            self::LEADER => 'リーダー',
            self::GENERAL => '一般',
        };
    }

    /**
     * 文字列から AccessType を取得（存在しない場合は null）
     */
    public static function tryFromString(string $value): ?self
    {
        return self::tryFrom($value);
    }
}
