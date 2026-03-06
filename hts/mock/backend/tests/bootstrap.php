<?php

/**
 * PHPUnit Bootstrap File
 *
 * テスト実行前に環境変数を強制的に設定し、
 * テスト用PostgreSQLデータベースを使用するようにする
 */

// Force testing environment
putenv('APP_ENV=testing');
$_ENV['APP_ENV'] = 'testing';
$_SERVER['APP_ENV'] = 'testing';

// Force test database for tests (separate from development)
putenv('DB_DATABASE=oa_dev_test');
$_ENV['DB_DATABASE'] = 'oa_dev_test';
$_SERVER['DB_DATABASE'] = 'oa_dev_test';

// Load Composer autoloader
require __DIR__.'/../vendor/autoload.php';
