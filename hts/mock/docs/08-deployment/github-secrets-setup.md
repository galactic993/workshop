# GitHub Secrets セットアップガイド

## 概要

このドキュメントでは、CI/CDパイプラインに必要なGitHub Secretsの設定方法を説明します。

## 設定が必要なSecrets

### さくらVPS 開発環境用

| Secret名 | 説明 | 設定例 | 取得方法 |
|---------|------|--------|---------|
| **VPS_HOST** | さくらVPSのIPアドレスまたはホスト名 | `123.456.789.012` | さくらVPSコントロールパネルで確認 |
| **VPS_USERNAME** | SSH接続用のユーザー名 | `ubuntu` または `root` | VPS作成時に設定したユーザー名 |
| **VPS_SSH_KEY** | SSH接続用の秘密鍵（プライベートキー） | `-----BEGIN OPENSSH PRIVATE KEY-----`<br>...<br>`-----END OPENSSH PRIVATE KEY-----` | 下記「SSH鍵の取得方法」参照 |
| **VPS_SSH_PORT** | SSH接続ポート番号 | `22`（デフォルト）<br>または変更後のポート番号 | 通常は`22`、変更している場合は変更後の値 |
| **VPS_PROJECT_PATH** | VPS上のプロジェクトディレクトリの絶対パス | `/home/ubuntu/oa_dev` | VPS上でプロジェクトを配置したパス |

## GitHub Secretsの設定手順

### 1. GitHubリポジトリページにアクセス

```
https://github.com/your-organization/oa_dev
```

### 2. Settingsページへ移動

1. リポジトリページ上部の `Settings` タブをクリック
2. 左サイドバーの `Secrets and variables` を展開
3. `Actions` をクリック

### 3. Secretsを追加

各Secretについて、以下の手順で追加します:

1. `New repository secret` ボタンをクリック
2. `Name` フィールドにSecret名を入力（例: `VPS_HOST`）
3. `Secret` フィールドに値を入力
4. `Add secret` ボタンをクリック

**注意**:
- Secret名は大文字小文字を区別します
- 一度保存したSecretの値は再表示できません（更新のみ可能）

## SSH鍵の取得方法

### パターン1: 既存のSSH鍵を使用する場合

既にVPSへのSSH接続に使用している鍵がある場合:

```bash
# ローカルマシン（Windows）の場合
type %USERPROFILE%\.ssh\id_ed25519

# ローカルマシン（Mac/Linux）の場合
cat ~/.ssh/id_ed25519
```

**出力例**:
```
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZW
...（中略）...
-----END OPENSSH PRIVATE KEY-----
```

この**全体**をコピーして、`VPS_SSH_KEY` に設定します。

### パターン2: 新しくSSH鍵を生成する場合

GitHub Actions専用の新しいSSH鍵を生成することを推奨します。

#### Step 1: ローカルで鍵ペアを生成

```bash
# ローカルマシンで実行
ssh-keygen -t ed25519 -C "github-actions@oa-dev" -f ~/.ssh/oa_dev_deploy

# パスフレーズは空白のままEnter（GitHub Actionsで使用するため）
```

#### Step 2: 公開鍵をVPSに登録

```bash
# 公開鍵の内容を表示
cat ~/.ssh/oa_dev_deploy.pub

# VPSにSSH接続
ssh user@your-vps-host

# VPS上で公開鍵を登録
mkdir -p ~/.ssh
chmod 700 ~/.ssh
echo "ssh-ed25519 AAAA... github-actions@oa-dev" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

#### Step 3: 秘密鍵をGitHub Secretsに登録

```bash
# 秘密鍵の内容を表示
cat ~/.ssh/oa_dev_deploy

# この出力全体をコピーして VPS_SSH_KEY に設定
```

#### Step 4: 接続テスト

```bash
# ローカルから新しい鍵で接続テスト
ssh -i ~/.ssh/oa_dev_deploy user@your-vps-host

# 接続できればOK
```

### パターン3: SSH鍵をbase64エンコードして設定する（推奨）

GitHub Secretsで複数行のSSH鍵を扱う際、改行の処理で問題が発生することがあります。
**base64エンコード方式を使用すると、この問題を確実に回避できます。**

#### Step 1: SSH鍵をbase64エンコード

```bash
# Windows (Git Bash)
cat .ssh/id_ed25519 | base64 -w 0

# Mac/Linux
cat ~/.ssh/id_ed25519 | base64 -w 0
```

**出力例（1行の文字列）**:
```
LS0tLS1CRUdJTiBPUEVOU1NIIFBSSVZBVEUgS0VZLS0tLS0KYjNCbGJuTn...（長い文字列）...RFIEtFWS0tLS0tCg==
```

#### Step 2: GitHub Secretsに設定

1. GitHub リポジトリ → Settings → Secrets and variables → Actions
2. `VPS_SSH_KEY` を作成/更新
3. **base64エンコードされた文字列全体を貼り付け**（1行）

#### Step 3: CI/CDワークフローでデコード

ワークフロー側で自動的にデコードされます:

```yaml
- name: Setup SSH key
  run: |
    mkdir -p ~/.ssh
    echo "${{ secrets.VPS_SSH_KEY }}" | base64 -d > ~/.ssh/deploy_key
    chmod 600 ~/.ssh/deploy_key
```

#### 利点

✅ **改行の問題を完全に回避**: 1行の文字列として扱える
✅ **確実な復元**: base64デコードで元のSSH鍵を正確に復元
✅ **GitHub推奨**: 複数行データを扱う標準的な方法

## VPS_PROJECT_PATHの確認方法

VPSにSSH接続して、プロジェクトディレクトリの絶対パスを確認します:

```bash
# VPSにSSH接続
ssh user@your-vps-host

# プロジェクトディレクトリに移動
cd oa_dev  # または ~/oa_dev

# 絶対パスを確認
pwd

# 出力例: /home/ubuntu/oa_dev
```

この出力された絶対パスを `VPS_PROJECT_PATH` に設定します。

## 設定完了後の確認

すべてのSecretsを設定した後、以下の手順で動作確認します:

### 1. Secretsが正しく設定されているか確認

GitHub リポジトリ → Settings → Secrets and variables → Actions

以下の5つのSecretsが表示されていることを確認:
- ✅ VPS_HOST
- ✅ VPS_USERNAME
- ✅ VPS_SSH_KEY
- ✅ VPS_SSH_PORT
- ✅ VPS_PROJECT_PATH

### 2. GitHub Actionsでテスト実行

```bash
# developブランチに変更をプッシュ
git checkout develop
git pull origin develop

# テスト用のコミットを作成
echo "# CI/CD Test" >> README.md
git add README.md
git commit -m "test: CI/CD動作確認"
git push origin develop
```

### 3. GitHub Actionsのログを確認

1. GitHubリポジトリページ → `Actions` タブ
2. 最新のワークフロー実行をクリック
3. 各ジョブのログを確認:
   - `Run Tests` ジョブが成功していることを確認
   - `Deploy to Sakura VPS` ジョブが成功していることを確認

### 4. VPSで動作確認

```bash
# VPSにSSH接続
ssh user@your-vps-host

# プロジェクトディレクトリに移動
cd ~/oa_dev

# 最新コードが反映されているか確認
git log -1

# コンテナが起動しているか確認
docker compose ps

# ブラウザでアクセス
# http://your-vps-host:3000 (フロントエンド)
# http://your-vps-host:8000 (バックエンド)
```

## トラブルシューティング

### SSH接続エラーが発生する

**症状**: GitHub Actionsのデプロイジョブで `Permission denied` エラー

**原因**:
- SSH秘密鍵が正しく設定されていない
- VPS上の`authorized_keys`に公開鍵が登録されていない

**解決策**:
1. `VPS_SSH_KEY` に秘密鍵全体（`-----BEGIN`から`-----END`まで）が含まれているか確認
2. VPS上で `cat ~/.ssh/authorized_keys` を実行し、対応する公開鍵が登録されているか確認
3. VPS上で `chmod 600 ~/.ssh/authorized_keys` を実行し、権限を確認

### ポート番号エラー

**症状**: `Connection refused` または `Connection timed out`

**原因**:
- SSH接続ポートが間違っている
- ファイアウォールでSSHポートがブロックされている

**解決策**:
1. `VPS_SSH_PORT` が正しいか確認（デフォルトは`22`）
2. VPS上でファイアウォール設定を確認

```bash
# ファイアウォール状態確認（CentOS/AlmaLinux）
sudo firewall-cmd --list-all

# SSHポートが開いているか確認
sudo firewall-cmd --list-ports
```

### docker-compose コマンドが見つからない

**症状**: `docker-compose: command not found` エラー

**原因**:
- VPSにDocker Compose v2がインストールされている
- v2ではコマンドが `docker compose` (スペース区切り) に変更された

**解決策**:
CI/CDワークフロー内のすべての `docker-compose` を `docker compose` に変更

```yaml
# 変更前
docker-compose build
docker-compose up -d

# 変更後
docker compose build
docker compose up -d
```

### SSH鍵の形式エラー

**症状**: `ssh.ParsePrivateKey: ssh: no key found` または `error in libcrypto` エラー

**原因**:
- GitHub Secretsに保存したSSH鍵の改行が正しく処理されていない

**解決策**:
SSH鍵をbase64エンコードして保存する（上記「パターン3」を参照）

```bash
# SSH鍵をbase64エンコード
cat .ssh/id_ed25519 | base64 -w 0
# 出力された文字列をGitHub Secretsに設定
```

### プロジェクトパスエラー

**症状**: `No such file or directory` エラー

**原因**:
- `VPS_PROJECT_PATH` が間違っている
- プロジェクトがまだクローンされていない

**解決策**:
1. VPS上で `pwd` を実行し、正しいパスを確認
2. プロジェクトがクローンされているか確認

```bash
# VPSで確認
ls -la ~/oa_dev
```

## セキュリティに関する注意事項

### 推奨事項

✅ **GitHub Actions専用のSSH鍵を作成する**
- 既存の個人用SSH鍵を使い回さない
- パスフレーズなしの鍵を生成（自動化のため）

✅ **最小権限の原則**
- デプロイに必要な最小限の権限のみを持つユーザーを使用
- root権限での接続は避ける

✅ **定期的な鍵のローテーション**
- 3〜6ヶ月ごとにSSH鍵を更新

### 禁止事項

❌ **Secretsをコードに含めない**
- `.env` ファイルや設定ファイルに直接記述しない

❌ **Secretsをログに出力しない**
- デバッグ時も `echo ${{ secrets.VPS_SSH_KEY }}` などは絶対に実行しない

❌ **Public リポジトリでの使用**
- このプロジェクトはPrivateリポジトリとして管理すること

## 参考資料

- [GitHub Actions Documentation - Encrypted secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [SSH Key Generation Guide](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)

## 更新履歴

- 2025-12-08: 初版作成
