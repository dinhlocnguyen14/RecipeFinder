# 📖 Hướng dẫn chạy dự án Recipe Finder

Tài liệu này hướng dẫn chi tiết các bước để cài đặt môi trường và khởi chạy dự án bao gồm cả Backend (Node.js) và Mobile (Expo).

---

## 💻 0. Yêu cầu môi trường (Cần cài đặt trước)

Trước khi chạy dự án, hãy đảm bảo máy tính của bạn đã cài đặt các công cụ sau:

1.  **Node.js**: Phiên bản **v18** trở lên (Tải tại [nodejs.org](https://nodejs.org/)).
2.  **npm**: Thường đi kèm khi cài Node.js (Phiên bản 9.x trở lên).
3.  **Expo Go**: Tải ứng dụng này trên điện thoại (App Store hoặc Google Play) để quét mã và chạy thử App Mobile.

**Cách kiểm tra:** Mở terminal và gõ lệnh sau để xem đã cài chưa:
```bash
node -v
npm -v
```

---

## 🛠 1. Cấu hình biến môi trường (.env)

Dự án yêu cầu 2 file cấu hình môi trường để kết nối Database và xác thực người dùng.

### 🔹 Backend (.env)
Tạo file `.env` trong thư mục `backend/` và dán nội dung sau:
```env
DATABASE_URL=postgresql://neondb_owner:npg_g8RDhcaQljy3@ep-bitter-bird-a164e0xr-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
PORT=5001
```

### 🔹 Mobile (.env)
Tạo file `.env` trong thư mục `mobile/` và dán nội dung sau:
```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_d2lubmluZy1ibG93ZmlzaC0xNS5jbGVyay5hY2NvdW50cy5kZXYk
```

---

## 🚀 2. Các bước khởi chạy

### Bước 1: Khởi động Backend
Mở một terminal mới và chạy các lệnh sau:
```bash
cd backend
npm install
npm run dev
```
*Server sẽ chạy tại: `http://localhost:5001`*

### Bước 2: Khởi động Ứng dụng Mobile
Mở một terminal thứ hai và chạy:
```bash
cd mobile
npm install
npx expo start
```

---

## 📱 3. Cách xem giao diện App

1.  **Trên điện thoại thật (Khuyên dùng):** 
    - Mở app **Expo Go** trên điện thoại.
    - Đảm bảo điện thoại và máy tính dùng chung một mạng Wi-Fi.
    - Quét mã QR hiện ra ở terminal của máy tính.
2.  **Trên trình duyệt:** Nhấn phím `w` trong terminal của Expo để xem bản Web.

---

## 🔑 4. Tài khoản kiểm thử (Test)

Bạn có thể dùng tài khoản sau để đăng nhập nhanh:
- **Email:** `user.test@example.com`
- **Mật khẩu:** `Password123!`

---
*Chúc bạn có trải nghiệm tốt với Recipe Finder!*
