#!/bin/bash

# さくらVPS初期セットアップスクリプト
# Ubuntu 24.04用

set -e

echo "=========================================="
echo "  さくらVPS 初期セットアップ (Ubuntu 24.04)"
echo "=========================================="

# カラー出力
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. システムアップデート
echo ""
echo "=========================================="
echo "  システムアップデート"
echo "=========================================="
sudo apt update
sudo apt upgrade -y
echo -e "${GREEN}✓${NC} システムアップデート完了"

# 2. 必要なパッケージのインストール
echo ""
echo "=========================================="
echo "  基本パッケージインストール"
echo "=========================================="
sudo apt install -y git curl wget vim ca-certificates gnupg lsb-release
echo -e "${GREEN}✓${NC} 基本パッケージインストール完了"

# 3. Docker のインストール
echo ""
echo "=========================================="
echo "  Docker インストール"
echo "=========================================="

if ! command -v docker &> /dev/null; then
    # Docker の GPG キーを追加
    sudo install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    sudo chmod a+r /etc/apt/keyrings/docker.gpg

    # Docker リポジトリを追加
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
      $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
      sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

    # Docker をインストール
    sudo apt update
    sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

    # Docker サービスを起動
    sudo systemctl start docker
    sudo systemctl enable docker

    # 現在のユーザーをdockerグループに追加
    sudo usermod -aG docker $USER

    echo -e "${GREEN}✓${NC} Docker インストール完了"
    echo -e "${YELLOW}⚠${NC} dockerグループの変更を反映するため、再ログインが必要です"
else
    echo -e "${GREEN}✓${NC} Docker は既にインストール済み"
fi

docker --version
docker compose version

# 4. ファイアウォール設定 (UFW)
echo ""
echo "=========================================="
echo "  ファイアウォール設定 (UFW)"
echo "=========================================="

if command -v ufw &> /dev/null; then
    # UFW がインストールされている場合
    sudo ufw allow 22/tcp    # SSH
    sudo ufw allow 80/tcp    # HTTP
    sudo ufw allow 443/tcp   # HTTPS
    sudo ufw allow 3000/tcp  # Next.js開発サーバー
    sudo ufw allow 8000/tcp  # Laravel

    # UFW を有効化（既に有効な場合はスキップ）
    sudo ufw --force enable

    echo -e "${GREEN}✓${NC} ファイアウォール設定完了"
    sudo ufw status
else
    echo -e "${YELLOW}⚠${NC} ufw がインストールされていません"
    echo "インストールする場合: sudo apt install -y ufw"
fi

# 5. プロジェクトディレクトリ作成
echo ""
echo "=========================================="
echo "  プロジェクトディレクトリ作成"
echo "=========================================="

PROJECT_DIR="$HOME/oa_dev"

if [ ! -d "$PROJECT_DIR" ]; then
    mkdir -p "$PROJECT_DIR"
    echo -e "${GREEN}✓${NC} プロジェクトディレクトリ作成: $PROJECT_DIR"
else
    echo -e "${GREEN}✓${NC} プロジェクトディレクトリは既に存在: $PROJECT_DIR"
fi

# 6. タイムゾーン設定
echo ""
echo "=========================================="
echo "  タイムゾーン設定"
echo "=========================================="

current_tz=$(timedatectl show -p Timezone --value)
if [ "$current_tz" != "Asia/Tokyo" ]; then
    sudo timedatectl set-timezone Asia/Tokyo
    echo -e "${GREEN}✓${NC} タイムゾーンを Asia/Tokyo に設定"
else
    echo -e "${GREEN}✓${NC} タイムゾーンは既に Asia/Tokyo に設定済み"
fi

# 7. SSH鍵の確認（GitHub用）
echo ""
echo "=========================================="
echo "  SSH鍵の確認"
echo "=========================================="

if [ ! -f "$HOME/.ssh/id_ed25519" ] && [ ! -f "$HOME/.ssh/id_rsa" ]; then
    echo -e "${YELLOW}⚠${NC} SSH鍵が見つかりません"
    echo "    GitHub用のSSH鍵を作成してください:"
    echo "    ssh-keygen -t ed25519 -C \"k.sakae@eclat-assist.jp\""
    echo "    cat ~/.ssh/id_ed25519.pub"
    echo "    # 公開鍵をGitHubに登録してください"
else
    echo -e "${GREEN}✓${NC} SSH鍵は既に存在します"
    if [ -f "$HOME/.ssh/id_ed25519.pub" ]; then
        echo ""
        echo "GitHub に登録する公開鍵:"
        cat "$HOME/.ssh/id_ed25519.pub"
    fi
fi

# 完了メッセージ
echo ""
echo "=========================================="
echo -e "${GREEN}  初期セットアップ完了！${NC}"
echo "=========================================="
echo ""
echo "次のステップ:"
echo "  1. 再ログインして docker グループの変更を反映"
echo "     exit"
echo "     ssh -i .ssh/id_ed25519 ubuntu@153.120.4.173"
echo ""
echo "  2. SSH鍵をGitHubに登録（まだの場合）"
echo "     cat ~/.ssh/id_ed25519.pub"
echo "     # 公開鍵をコピーして GitHub → Settings → SSH keys に登録"
echo ""
echo "  3. プロジェクトをクローン"
echo "     cd $PROJECT_DIR"
echo "     git clone git@github.com:eclat-sakae/oa_dev.git ."
echo ""
echo "  4. 環境変数ファイルを設定"
echo "     cp backend/.env.example backend/.env"
echo "     cp frontend/.env.local.example frontend/.env.local"
echo "     vim backend/.env"
echo "     vim frontend/.env.local"
echo ""
echo "  5. コンテナを起動"
echo "     cd $PROJECT_DIR"
echo "     docker compose up -d --build"
echo ""
