# Tìm Kiếm Công Thức Nấu Ăn (Recipe Finder)

Kho lưu trữ này chứa mã nguồn của ứng dụng Recipe Finder. Dự án được thiết kế theo cấu trúc monorepo, bao gồm cả ứng dụng di động (frontend) và máy chủ (backend).

## Cấu Trúc Dự Án

- `mobile/`: Ứng dụng di động được xây dựng bằng Expo / React Native.
- `backend/`: Máy chủ API được xây dựng bằng Node.js.

## Bắt Đầu

### Yêu Cầu Cài Đặt

- Đã cài đặt [Node.js](https://nodejs.org/).
- Ứng dụng [Expo Go](https://expo.dev/go) được cài đặt trên điện thoại của bạn (hoặc sử dụng Trình giả lập Android / iOS).

### Cài Đặt

Cài đặt tất cả các thư viện và phụ thuộc cho cả thư mục gốc, máy chủ và ứng dụng di động chỉ bằng một câu lệnh chạy ở thư mục gốc của dự án:

```bash
npm run install:all
```

### Khởi Chạy Dự Án

Để khởi chạy đồng thời cả máy chủ backend và ứng dụng di động, hãy dùng lệnh sau:

```bash
npm run dev
```

### Các Câu Lệnh Khác

- `npm run dev:backend`: Chỉ chạy máy chủ backend.
- `npm run dev:mobile`: Chạy ứng dụng di động qua Expo trên cùng mạng nội bộ (LAN).
- `npm run dev:mobile:tunnel`: Chạy ứng dụng di động qua một tunnel nội bộ, dùng lệnh này nếu mạng Wifi của bạn chặn kết nối từ ứng dụng Expo Go.
- `npm run dev:mobile:reset`: Chạy ứng dụng di động đồng thời xóa bộ nhớ tạm (cache) của Metro bundler.
