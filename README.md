# Ứng dụng Tìm kiếm Công thức Nấu ăn - Đồ án cuối kỳ lập trình trên thiết bị di động

## Nhóm

1. Nguyễn Đình Lộc 
Mã sinh viên : 23810310244
2. Phạm Quang Linh
Mã sinh viên : 23810310260
3. Nguyễn Quốc Anh
Mã sinh viên : 23810310253
## Phân công công việc
 1. Nguyễn Đình Lộc ( Lên ý tưởng + backend) 
Mã sinh viên : 23810310244
2. Phạm Quang Linh (Thiết kế UX/UI + tester)
Mã sinh viên : 23810310260
3. Nguyễn Quốc Anh (làm báo cáo)
Mã sinh viên : 23810310253

## Giới thiệu

Chào mừng bạn đến với tài liệu kỹ thuật của dự án **Recipe Finder**. Đây là một ứng dụng di động Fullstack hiện đại, được thiết kế để cung cấp trải nghiệm tìm kiếm và quản lý công thức nấu ăn mượt mà và bảo mật

---

### Chi tiết các luồng chính:

1.  **Luồng Xác thực (Authentication)**:
    - Ứng dụng sử dụng **Clerk** để quản lý danh tính. Khi người dùng đăng nhập bằng Social (Google/Apple), Clerk sẽ xử lý việc trao đổi token và trả về thông tin người dùng.
    - Một phần mở rộng đặc biệt là **Account Switcher**: Thông tin người dùng được lưu vào thiết bị thông qua `Expo SecureStore` để cho phép đăng nhập lại nhanh chóng.
2.  **Luồng Dữ liệu Công thức**:
    - Các món ăn và thông tin chi tiết được lấy trực tiếp từ **TheMealDB API** để đảm bảo dữ liệu luôn phong phú và đa dạng.
3.  **Luồng Đồng bộ (Favorites Sync)**:
    - Khi người dùng nhấn "Yêu thích", ứng dụng sẽ gửi yêu cầu tới **Backend Node.js** tự xây dựng. Backend dùng **Drizzle ORM** để lưu trữ thông tin món ăn vào cơ sở dữ liệu **PostgreSQL**. Điều này giúp người dùng có thể đồng bộ danh sách yêu thích trên bất kỳ thiết bị nào sau khi đăng nhập.

---

## Danh sách Công nghệ & Thư viện chủ chốt

### 1. Frontend (Thư mục `/mobile`)

Dự án sử dụng hệ sinh thái **Expo** (SDK 54) để đảm bảo tính ổn định và hiện đại:

- **expo**: Framework cốt lõi hỗ trợ phát triển đa nền tảng.
- **expo-router**: Quản lý điều hướng dạng cấu trúc thư mục (File-based routing), tương tự Next.js.
- **react-native-webview**: Dùng để nhúng trình phát YouTube Tutorial cho món ăn.
- **@clerk/clerk-expo**: Xử lý đăng nhập Google/Apple và bảo mật phiên làm việc của người dùng.
- **expo-image**: Thư viện xử lý hình ảnh tối ưu, giúp app tải ảnh cực nhanh và mượt.
- **expo-image-picker**: Công cụ cho phép người dùng chọn và tải ảnh món ăn từ thư viện điện thoại.
- **expo-linear-gradient**: Tạo các hiệu ứng màu sắc chuyển vùng hiện đại cho giao diện.

### 2. Backend (Thư mục `/backend`)

Server được xây dựng với kiến trúc tối giản nhưng hiệu năng cao:

- **express**: Framework chính xử lý các API Endpoint về món yêu thích và công thức tự tạo.
- **drizzle-orm**: ORM mạnh mẽ nhất hiện nay để thao tác với PostgreSQL (Neon) một cách an toàn.
- **cors**: Quản lý quyền truy cập tài nguyên giữa ứng dụng Mobile và Server.
- **dotenv**: Bảo mật các thông tin quan trọng như đường dẫn Database URL.
- **node-cron**: Tự động thực hiện các tác vụ dọn dẹp hệ thống định kỳ.

---

## 📦 Danh sách chi tiết các Package & Lệnh cài đặt

### 1. Backend Dependencies

Cài đặt tất cả thư viện cần thiết cho Server:

```bash
cd backend
npm install express cors drizzle-orm @neondatabase/serverless dotenv cron
npm install -D nodemon drizzle-kit jest supertest
```

| Package                    | Phiên bản | Chức năng                               |
| :------------------------- | :-------- | :-------------------------------------- |
| `express`                  | ^5.1.0    | Web Framework                           |
| `drizzle-orm`              | ^0.44.2   | ORM Database                            |
| `@neondatabase/serverless` | ^1.0.0    | Driver kết nối PostgreSQL (Neon)        |
| `cors`                     | ^2.8.5    | Cho phép truy cập API từ Mobile         |
| `dotenv`                   | ^16.5.0   | Quản lý biến môi trường                 |
| `cron`                     | ^4.3.0    | Lập lịch tác vụ tự động                 |
| `nodemon` (Dev)            | ^3.1.10   | Tự động reload server khi code thay đổi |
| `drizzle-kit` (Dev)        | ^0.31.1   | Công cụ migration/push schema           |

### 2. Mobile Dependencies

Cài đặt các thư viện cho ứng dụng Expo:

```bash
cd mobile
npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar expo-image expo-image-picker expo-linear-gradient expo-font @clerk/clerk-expo react-native-webview
```

| Package                   | Phiên bản | Chức năng                         |
| :------------------------ | :-------- | :-------------------------------- |
| `expo`                    | ~54.0.33  | Nền tảng Expo SDK                 |
| `expo-router`             | ~6.0.23   | Điều hướng (Routing)              |
| `react-native-webview`    | 13.15.0   | Phát video YouTube                |
| `@clerk/clerk-expo`       | ^2.19.31  | Xác thực người dùng               |
| `expo-image`              | ~3.0.11   | Hiển thị và tối ưu ảnh            |
| `expo-image-picker`       | ~17.0.10  | Chọn ảnh từ điện thoại            |
| `expo-linear-gradient`    | ~15.0.8   | Hiệu ứng màu Gradient             |
| `react-native-reanimated` | ~4.1.1    | Hiệu ứng chuyển động (Animations) |

---

---

## Cài đặt & Cấu hình môi trường

### Yêu cầu hệ thống:

- **Node.js**: v18.0.0+
- **npm**: v9.0.0+
- **Cơ sở dữ liệu**: PostgreSQL (đã cấu hình sẵn trên Neon)
- **Thiết bị**: Điện thoại có cài Expo Go (để xem Mobile App)

### Biến môi trường:

Dự án yêu cầu các biến môi trường để hoạt động:

### Mobile (`/mobile/.env`):

```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
```

### Backend (`/backend/.env`):

```env
DATABASE_URL=postgres://...
PORT=5001
```

---

## Hướng dẫn khởi động nhanh

1.  **Backend**:
    ```bash
    cd backend
    npm install
    npm start
    ```
2.  **Mobile**:
    ```bash
    cd mobile
    npm install
    npx expo start
    ```

---

## Tài khoản kiểm thử (Test Account)

Dành cho việc kiểm thử API hoặc các tính năng yêu cầu đăng nhập mà không muốn dùng tài khoản thật:

- **Email**: `user.test@example.com`
- **Mật khẩu**: `Password123!`

---

## Cấu trúc thư mục (Directory Structure)

```text
recipeApp/
├── backend/                # Mã nguồn Backend (Node.js/Express)
│   ├── __tests__/         # Các bài kiểm thử API (Jest)
│   ├── src/
│   │   ├── config/        # Cấu hình DB, Biến môi trường
│   │   ├── db/            # Schema Drizzle (PostgreSQL)
│   │   └── server.js      # Main Server & API Endpoints
│   └── package.json
├── mobile/                 # Mã nguồn Mobile (Expo/React Native)
│   ├── app/               # Screens & Expo Router logic
│   ├── components/        # UI Components
│   └── package.json
└── README.md               # Tài liệu dự án
```
