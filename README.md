# ☕ HIVER Coffee – Hệ thống quản lý quán cà phê
#TRUY CẬP WEBSITE: https://nguyenanhvuquanlicoffee.vercel.app/
## 1. Giới thiệu dự án

**HIVER Coffee** là ứng dụng quản lý quán cà phê được xây dựng nhằm hỗ trợ quản lý và vận hành hoạt động kinh doanh một cách thuận tiện, trực quan và hiệu quả.

Hệ thống cung cấp các chức năng quản lý bán hàng, đơn hàng, thực đơn, nguyên liệu, nhân viên và thống kê doanh thu. Ngoài ra, ứng dụng còn tích hợp trợ lý AI nhằm hỗ trợ phân tích dữ liệu và đưa ra gợi ý trong quá trình kinh doanh.

## 2. Các chức năng chính

### 2.1. Đăng nhập và phân quyền
- Đăng nhập bằng tài khoản và mật khẩu.
- Hỗ trợ tài khoản Quản lý và Thu ngân.
- Quản lý trạng thái đăng nhập và đăng xuất.

### 2.2. Bảng điều khiển (Dashboard)
- Tổng quan tình hình kinh doanh.
- Theo dõi đơn hàng và doanh thu.
- Hiển thị thông tin kho và nhân viên.

### 2.3. Quản lý bán hàng
- Hiển thị danh sách đồ uống.
- Chọn món và số lượng.
- Tính tổng tiền đơn hàng.
- Nhập thông tin khách hàng.
- Ghi nhận thanh toán và tạo đơn hàng.
- Tự động trừ nguyên liệu trong kho theo công thức món uống.

### 2.4. Quản lý đơn hàng
- Hiển thị danh sách đơn hàng.
- Theo dõi trạng thái: Đang pha, Hoàn thành, Đã hủy.
- Cập nhật trạng thái thanh toán.
- Xóa đơn hàng.
- Hoàn trả nguyên liệu khi hủy đơn.

### 2.5. Quản lý thực đơn (Menu)
- Thêm, sửa và xóa món uống.
- Quản lý tên món, danh mục và giá bán.
- Hỗ trợ giá theo kích thước M/L.
- Quản lý hình ảnh và công thức pha chế.
- Liên kết công thức với nguyên liệu trong kho.

### 2.6. Quản lý kho nguyên liệu
- Thêm, sửa và xóa nguyên liệu.
- Theo dõi số lượng tồn kho.
- Nhập thêm nguyên liệu.
- Thiết lập mức tồn kho tối thiểu.
- Tự động cập nhật tồn kho theo đơn hàng.

### 2.7. Quản lý nhân viên
- Thêm, sửa và xóa nhân viên.
- Quản lý chức vụ.
- Theo dõi thông tin liên hệ và ca làm việc.

### 2.8. Thống kê và báo cáo
- Theo dõi doanh thu.
- Thống kê doanh thu theo thời gian.
- Phân tích các món bán chạy.
- Hỗ trợ tạo báo cáo bằng AI.

### 2.9. Trợ lý AI
- Tương tác với trợ lý AI thông qua hội thoại.
- Phân tích dữ liệu kinh doanh.
- Gợi ý món uống mới.
- Hỗ trợ phân tích nguyên liệu cần nhập.
- Lưu lịch sử hội thoại trên trình duyệt.

## 3. Công nghệ sử dụng

| Công nghệ | Vai trò |
|---|---|
| React 19 | Xây dựng giao diện |
| TypeScript | Ngôn ngữ lập trình |
| TanStack Start | Framework ứng dụng |
| TanStack Router | Quản lý điều hướng |
| Tailwind CSS 4 | Thiết kế giao diện |
| Zustand | Quản lý trạng thái và dữ liệu |
| Recharts | Hiển thị biểu đồ |
| Vite | Công cụ phát triển và build |
| Lovable AI Gateway | Tích hợp AI |

## 4. Cấu trúc thư mục dự án

```text
hiver-coffee-code/
│
├── public/
│   ├── drinks/              # Hình ảnh các món uống
│   ├── hiver-logo.png       # Logo HIVER
│   └── favicon.png          # Icon website
│
├── src/
│   ├── assets/              # Tài nguyên hình ảnh
│   │
│   ├── components/          # Các thành phần giao diện
│   │   ├── ui/              # Component giao diện dùng chung
│   │   ├── AppShell.tsx     # Khung giao diện chính
│   │   ├── FormDialog.tsx   # Hộp thoại biểu mẫu
│   │   └── AiPanel.tsx      # Thành phần hỗ trợ AI
│   │
│   ├── hooks/               # Custom React Hooks
│   │
│   ├── lib/
│   │   ├── ai/              # Xử lý tích hợp AI
│   │   ├── data.ts          # Dữ liệu mẫu và xử lý dữ liệu
│   │   └── store.ts         # Quản lý trạng thái ứng dụng
│   │
│   ├── routes/
│   │   ├── index.tsx        # Đăng nhập
│   │   ├── dashboard.tsx    # Bảng điều khiển
│   │   ├── ban-hang.tsx     # Bán hàng
│   │   ├── don-hang.tsx     # Quản lý đơn hàng
│   │   ├── menu.tsx         # Quản lý thực đơn
│   │   ├── kho.tsx          # Quản lý kho
│   │   ├── nhan-vien.tsx    # Quản lý nhân viên
│   │   ├── thong-ke.tsx     # Thống kê
│   │   ├── tro-ly.tsx       # Trợ lý AI
│   │   └── api/
│   │       └── ai-chat.ts   # API hội thoại AI
│   │
│   ├── styles.css           # CSS toàn ứng dụng
│   ├── router.tsx           # Cấu hình Router
│   └── server.ts            # Cấu hình Server
│
├── package.json             # Thông tin và dependencies
├── vite.config.ts           # Cấu hình Vite
├── tsconfig.json            # Cấu hình TypeScript
└── README.md                # Tài liệu dự án
```

## 5. Yêu cầu môi trường

Để chạy dự án trên máy tính, cần cài đặt:

- Node.js phiên bản 20 trở lên (khuyến nghị Node.js 22 LTS).
- npm (được cài kèm với Node.js).
- Visual Studio Code hoặc Google Antigravity.

Kiểm tra phiên bản:

```bash
node -v
npm -v
```

## 6. Hướng dẫn cài đặt và chạy dự án

### Bước 1: Tải mã nguồn

Clone repository:

```bash
git clone <repository-url>
```

Di chuyển vào thư mục dự án:

```bash
cd hiver-coffee-code
```

### Bước 2: Cài đặt thư viện

```bash
npm install
```

Lệnh này cài đặt các thư viện cần thiết được khai báo trong `package.json`.

### Bước 3: Khởi chạy ứng dụng

```bash
npm run dev
```

Sau khi chạy thành công, mở trình duyệt tại địa chỉ được hiển thị trong Terminal, thông thường là:

```text
http://localhost:8000
```

### Bước 4: Đăng nhập hệ thống

Tài khoản dùng thử:

| Tài khoản | Mật khẩu | Vai trò |
|---|---|---|
| admin | 123456 | Quản lý |
| thungan | 123456 | Thu ngân |

## 7. Các lệnh thường dùng

| Lệnh | Chức năng |
|---|---|
| `npm install` | Cài đặt thư viện |
| `npm run dev` | Khởi chạy môi trường phát triển |
| `npm run build` | Build ứng dụng |
| `npm run preview` | Xem thử bản build |
| `npm run lint` | Kiểm tra lỗi code |
| `npm run test` | Chạy kiểm thử |
| `npm run test:watch` | Chạy kiểm thử liên tục |

## 8. Lưu trữ dữ liệu

Phiên bản hiện tại sử dụng Zustand kết hợp Local Storage để lưu trữ dữ liệu trên trình duyệt.

Các dữ liệu được lưu gồm:
- Thực đơn.
- Nguyên liệu và tồn kho.
- Đơn hàng.
- Nhân viên.
- Trạng thái đăng nhập.

Tên khóa lưu trữ:

```text
guinn-coffee-data
```

Lưu ý: Dữ liệu được lưu trên trình duyệt hiện tại, không phải cơ sở dữ liệu tập trung. Xóa dữ liệu trình duyệt có thể khiến dữ liệu đã lưu bị mất.

## 9. Cấu hình trợ lý AI

Chức năng Trợ lý AI sử dụng Lovable AI Gateway.

Khi chạy ứng dụng bên ngoài môi trường Lovable, cần cấu hình biến môi trường:

```env
LOVABLE_API_KEY=your_api_key
```

Nếu chưa có API Key, các chức năng quản lý cơ bản vẫn có thể hoạt động, nhưng những chức năng cần AI sẽ không sử dụng được.

## 10. Hình ảnh và tài nguyên

- Logo: `public/hiver-logo.png`
- Hình ảnh món uống: `public/drinks/`
- Hình nền đăng nhập: `src/assets/login-coffee.jpg`

## 11. Tác giả

**Dự án: HIVER Coffee**

Ứng dụng quản lý và vận hành quán cà phê được phát triển bằng React, TypeScript và TanStack Start.

---

© 2026 HIVER Coffee. All rights reserved.
