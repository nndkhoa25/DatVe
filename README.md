# 🎬 NekoCinema

Ứng dụng web đặt vé xem phim trực tuyến. Người dùng có thể dễ dàng **xem trailer, tra cứu phim đang chiếu, chọn lịch chiếu, đặt vé nhanh chóng và quản lý thông tin vé** ngay trên nền tảng.

---

## 🚀 Tính năng chính
- 🔍 Xem danh sách **phim đang chiếu** và **phim sắp chiếu**.
- 📖 Thông tin chi tiết phim: mô tả, thời lượng, độ tuổi, trailer.
- 🎟️ Đặt vé trực tuyến: chọn suất chiếu, phòng chiếu, ghế ngồi.
- 🛒 Quản lý vé đã đặt, hủy vé (theo chính sách).
- 🎁 Trang khuyến mãi & mã giảm giá.
- 👤 Tài khoản người dùng (đăng nhập / đăng ký / đăng xuất).
- 🛠️ Chế độ quản trị (quản lý phim, lịch chiếu, phòng chiếu, vé).

---

## 🛠️ Công nghệ
- **Frontend:** React + TailwindCSS
- **Routing:** React Router
- **State Management:** Context API / Redux (tùy triển khai)
- **Backend:** Node.js + Express
- **Database:** MongoDB
- **Authentication:** JWT
- **Payment (demo):** Stripe / VNPay
- **Triển khai:** Docker / Vercel / Render

---

## 📦 Cài đặt & Chạy thử

### Yêu cầu
- Node.js >= 18
- MongoDB
- npm hoặc yarn

### Cách chạy
```bash
# Clone dự án
git clone https://github.com/username/nekocinema.git
cd nekocinema


cd ../server
cp .env.example .env
yarn install
yarn dev
