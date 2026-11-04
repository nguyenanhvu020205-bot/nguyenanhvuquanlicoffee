# Hướng dẫn chạy app HIVER Coffee (bản mã nguồn)

App quản lý quán cà phê: bán hàng, đơn hàng, menu, kho, nhân viên, thống kê, trợ lý AI.
Toàn bộ dữ liệu được lưu ngay trên trình duyệt — không cần máy chủ, không cần internet.

## 1. Cần có gì trước

- Máy tính có **Node.js** bản 20 trở lên (khuyên 22).
  Kiểm tra: mở cửa sổ lệnh, gõ `node -v` → nếu ra số như `v22.x.x` là ổn.
  Chưa có thì tải ở https://nodejs.org (bản LTS).

## 2. Chạy trong Google Antigravity

1. Mở **Google Antigravity** → `File` → `Open Folder` → chọn thư mục `hiver-coffee-code`.
2. Mở cửa sổ lệnh của Antigravity: menu `Terminal` → `New Terminal` (hoặc tổ hợp phím `Ctrl + \``).
3. Gõ `npm install` rồi Enter — chờ 1–3 phút (chỉ làm lần đầu).
4. Gõ `npm run dev` rồi Enter.
5. Trong cửa sổ lệnh sẽ hiện một địa chỉ, ví dụ `http://localhost:5173` — giữ Ctrl (hoặc Cmd trên Mac) và bấm vào địa chỉ đó, trình duyệt sẽ mở app.
6. Muốn dừng app: quay lại cửa sổ lệnh, gõ `Ctrl + C`.

## 3. Chạy bằng cửa sổ lệnh bình thường (không dùng Antigravity)

- **Windows**: mở thư mục, gõ `cmd` vào thanh địa chỉ rồi Enter.
- **Mac**: chuột phải vào thư mục → `New Terminal at Folder`.

Sau đó lần lượt:

```
npm install
npm run dev
```

Mở địa chỉ hiện trong cửa sổ lệnh (thường là `http://localhost:5173` hoặc `http://localhost:8080`).

## 4. Tài khoản thử

| Tài khoản | Mật khẩu | Vai trò |
|---|---|---|
| `admin` | `123456` | Quản lý (xem được tất cả) |
| `thungan` | `123456` | Thu ngân |

## 5. Dữ liệu và ảnh

- Dữ liệu (menu, kho, đơn hàng, nhân viên) lưu trong trình duyệt đang dùng, key `guinn-coffee-data`.
  Đổi trình duyệt hoặc xóa dữ liệu duyệt web thì app quay về dữ liệu mẫu ban đầu.
- Muốn bắt đầu lại từ đầu: mở app, nhấn `F12` → thẻ `Application` (hoặc `Storage`) → `Local Storage` → xóa mục `guinn-coffee-data`, rồi tải lại trang.
- Ảnh món uống: thư mục `public/drinks` (34 ảnh).
- Logo: `public/hiver-logo.png` và `public/favicon.png`.
- Ảnh ở trang đăng nhập: `src/assets/login-coffee.jpg`.
- Đổi ảnh: thay file mới vào đúng vị trí, giữ nguyên tên file (nếu đổi tên thì sửa đường dẫn trong `src/lib/data.ts`).

## 6. Các lệnh khác

| Lệnh | Tác dụng |
|---|---|
| `npm run dev` | Chạy app để xem và sửa |
| `npm run build` | Đóng gói bản chính thức (thư mục `dist`) |
| `npm run preview` | Xem thử bản vừa đóng gói |
| `npm run lint` | Kiểm tra lỗi cú pháp |
| `npm run test` | Chạy các bài kiểm tra tự động |

## 7. Trang Trợ lý AI

Trang **Trợ lý AI** cần khoá AI của Lovable (biến môi trường `LOVABLE_API_KEY`).
Chạy ngoài Lovable mà chưa có khoá thì riêng trang này báo lỗi, các trang khác vẫn dùng bình thường.
Nếu muốn dùng AI khi chạy offline, thay phần gọi trong `src/lib/ai/gateway.server.ts` bằng khoá của nhà cung cấp khác (OpenAI, Gemini...).

## 8. Gặp lỗi

- `npm install` lỗi: xóa thư mục `node_modules` và file `package-lock.json` (nếu có) rồi chạy lại `npm install`.
- Không mở được địa chỉ: thử cổng khác, gõ `npm run dev -- --port 3000`.
- Ảnh món không hiện: kiểm tra các file trong `public/drinks` còn đủ 34 ảnh.
