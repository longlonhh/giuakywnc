

## Yêu cầu môi trường

- Node.js >= 18, npm >= 9
- PostgreSQL (Local hoặc Aiven) — chọn 1 trong 2 phương án bên dưới

## Cách chạy

### Bước 1. Chuẩn bị CSDL

**Phương án A — PostgreSQL Local bằng Docker (khuyên dùng khi demo):**

Cách 1 — dùng docker-compose (project đã có sẵn file `docker-compose.yml`):

```bash
cd library-management
docker compose up -d
```

Cách 2 — dùng lệnh docker run trực tiếp:

```bash
docker run -d --name library-pg \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=library_db \
  -p 5432:5432 postgres:16-alpine
```

> Lưu ý: nếu đã tạo container trước đó thì **không chạy lại** (sẽ báo lỗi `container name already in use`). Kiểm tra bằng `docker ps`; nếu muốn tạo lại thì xóa cũ trước: `docker rm -f library-pg`.

**Phương án B — Aiven for PostgreSQL (miễn phí):**

1. Đăng ký tại <https://aiven.io/> → tạo dịch vụ **PostgreSQL** (free tier).
2. Vào **Service overview → Connection information**, copy `Host`, `Port`, `User`, `Password`, `Database`.

### Bước 2. Cấu hình biến môi trường

Copy `.env.example` thành `.env` rồi sửa theo phương án đã chọn:

```env
# Local
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=library_db
DB_SSL=false

# Aiven (ví dụ)
# DB_HOST=pg-xxxx.aivencloud.com
# DB_PORT=12345
# DB_USER=avnadmin
# DB_PASSWORD=...
# DB_NAME=defaultdb
# DB_SSL=true
```

> Aiven bắt buộc SSL nên đặt `DB_SSL=true` (code đã xử lý sẵn trong `app.module.ts`).

### Bước 3. Cài đặt và chạy

```bash
npm install
npm run start:dev
```

Khi log hiện `Nest application successfully started` và `Application is running on: http://localhost:3000` là CSDL đã kết nối thành công (bảng được tạo tự động bởi `synchronize: true`).

### Bước 4. Mở giao diện web (xem sản phẩm)

Truy cập **http://localhost:3000/** trên trình duyệt — giao diện Quản lý thư viện với:

- Thống kê tổng quan (sách đang mượn, bản khả dụng, độc giả, đầu sách)
- Nút **"Độc giả mượn sách…"** (Câu 3.3 — ghi vào `borrowed_records`)
- Bảng **Sách đang được mượn** kèm ngày mượn, người mượn, hạn trả + badge còn/quéo hạn (Câu 3.4), nút **Trả sách**
- CRUD Thêm/Xóa sách và độc giả
- Khung **Phản hồi API** hiển thị mã HTTP + JSON mỗi lần thao tác (rất tiện chụp màn hình minh chứng)

> Giao diện gọi trực tiếp các REST API `/books`, `/readers`, `/borrows` — cùng một hệ thống đã test bằng Postman.

## Danh sách API

| Method | Endpoint | Mô tả | Câu |
| --- | --- | --- | --- |
| POST | `/books` | Thêm sách | Câu 2 |
| GET | `/books` | Danh sách sách | Câu 2 |
| GET | `/books/:id` | Chi tiết sách | Câu 2 |
| PATCH | `/books/:id` | Cập nhật sách | Câu 2 |
| DELETE | `/books/:id` | Xóa sách | Câu 2 |
| POST | `/readers` | Thêm độc giả | Câu 2 |
| GET | `/readers` | Danh sách độc giả | Câu 2 |
| GET | `/readers/:id` | Chi tiết độc giả | Câu 2 |
| PATCH | `/readers/:id` | Cập nhật độc giả | Câu 2 |
| DELETE | `/readers/:id` | Xóa độc giả | Câu 2 |
| **POST** | **`/borrows`** | **Độc giả mượn sách** `{ "readerId": 1, "bookId": 1, "days": 14 }` | **3.3** |
| **GET** | **`/borrows`** | **Danh sách sách đang được mượn (ngày mượn, người mượn, hạn trả)** | **3.4** |
| GET | `/borrows?active=false` | Tất cả phiếu mượn (kể cả đã trả) | 3.4 |
| PATCH | `/borrows/:id/return` | Trả sách (bổ sung) | — |

## Test bằng Postman

Import file `postman/library-api.postman_collection.json` vào Postman rồi chạy lần lượt:

1. **Tạo 2 sách**, **tạo 2 độc giả** (request trong collection).
2. **Câu 3.3**: `POST /borrows` với `{"readerId":1,"bookId":1}` → trả về phiếu mượn có `borrowedDate` (hôm nay) và `dueDate` (+14 ngày).
3. **Câu 3.4**: `GET /borrows` → danh sách sách đã mượn kèm `book`, `reader` (người mượn), `borrowedDate`, `dueDate`.

## Checklist ảnh chụp màn hình cần nộp

- [ ] **3.1** — Log khi chạy app: `Nest application successfully started` (chứng tỏ kết nối CSDL thành công) + ảnh bảng trong pgAdmin/psql (`books`, `readers`, `borrowed_records`).
- [ ] **3.2** — Cây thư mục `src/` trên VS Code thể hiện Module/Controller/Service/DTO/Entity.
- [ ] **3.3** — Postman: `POST /borrows` trả về 201 + phiếu mượn; kèm ảnh dữ liệu trong bảng `borrowed_records`.
- [ ] **3.4** — Postman: `GET /borrows` trả về danh sách sách kèm ngày mượn, người mượn, hạn trả.
