# 🎬 NekoCinema – オンライン映画チケット予約システム

## 📖 プロジェクト概要  
**NekoCinema** はオンラインで映画チケットを予約できるプラットフォームです。ユーザーは以下の機能を利用できます：  
- 映画のトレーラーや上映情報を閲覧  
- ジャンル・上映時間・映画館で映画を検索  
- 座席を選んでチケットを予約・オンライン決済  
- マイページで購入済みチケットを管理  

また、**管理者用ダッシュボード** では以下の管理が可能です：  
- 映画リスト  
- 上映スケジュール  
- 上映ホール・座席  
- 予約済みチケット  

---

## 🚀 主な機能

### 👤 一般ユーザー
- JWT 認証による新規登録・ログイン  
- 映画リストの閲覧、トレーラーや詳細情報の確認  
- 映画館・上映時間・座席の選択  
- 決済機能（デモ：Stripe / VNPay）  
- マイページで予約履歴を管理  

### 🛠️ 管理者
- 映画の追加・編集・削除  
- 上映スケジュールの作成・管理  
- 上映ホールと座席の管理  
- 予約状況の確認  

---

## 🏗️ 使用技術

- **フロントエンド**:  
  - [React.js](https://react.dev/)  
  - [TailwindCSS](https://tailwindcss.com/)  
  - [React Router](https://reactrouter.com/)  

- **バックエンド**:  
  - [Node.js](https://nodejs.org/)  
  - [Express.js](https://expressjs.com/)  
  - [MongoDB](https://www.mongodb.com/)  
  - JWT 認証  

- **決済**: Stripe API / VNPay（デモ）  

- **デプロイ（推奨）**:  
  - フロントエンド: Vercel  
  - バックエンド: Render / Docker  

---

## ⚙️ セットアップ & 実行方法

### 1. リポジトリのクローン
```bash
git clone https://github.com/nndkhoa25/DatVe.git
cd DatVe
