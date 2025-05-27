# Git Workflow Guidelines

## 🧠 Tổng quan

Tài liệu này hướng dẫn quy trình làm việc với Git dành cho dự án nhiều nhánh (feature, bugfix, v.v.), đảm bảo kiểm soát tốt source code, tránh rủi ro và nâng cao khả năng cộng tác giữa các thành viên.

## 🌳 Cấu trúc nhánh Git

### 🔰 Nhánh chính

- main: Chứa mã code ổn định, đã được kiểm duyệt và có thể deploy.

### ✨ Các loại nhánh khác

| Prefix     | Ý nghĩa                              | Ví dụ                      |
|------------|---------------------------------------|----------------------------|
| `feature/` | Thêm tính năng mới                    | `feature/login-form`       |
| `bugfix/`  | Sửa lỗi                               | `bugfix/avatar-missing`    |
| `hotfix/`  | Sửa lỗi khẩn cấp trên production      | `hotfix/homepage-crash`    |
| `refactor/`| Tối ưu code không thay đổi chức năng  | `refactor/user-service`    |
| `chore/`   | Cấu hình, scripts, CI/CD...           | `chore/setup-eslint`       |
| `docs/`    | Tài liệu                              | `docs/readme-update`       |
| `ui/`      | Giao diện không logic                 | `ui/layout-homepage`       |

## 🧭 Quy trình tạo và làm việc với nhánh

### 🔄 Khi bắt đầu làm việc trên một task mới:
#### Luôn đảm bảo bạn đang ở main và đã cập nhật mới nhất
    git checkout main
    git pull origin main

#### Tạo nhánh mới từ main
    git checkout -b feature/tên-task

### 💾 Quy tắc commit

- Mỗi commit nên ngắn gọn, rõ ràng.

- Cấu trúc khuyến nghị:

    `<type>`: <ngắn gọn nội dung>

    `<body>`: (nếu cần, mô tả kỹ hơn)

- Ví dụ:

    feature: add login form UI

    - Create LoginForm component
    - Add basic validation

#### ⬆️ Push code:

    git add .
    git commit -m "feature: add header layout"
    git push origin feature/header-layout

#### 🔃 Tạo Pull Request (PR):

- Truy cập GitHub và tạo PR từ nhánh feature -> main.

- Đặt tiêu đề, mô tả rõ ràng.

- Gán reviewer nếu có.

#### ✅ Sau khi merge:

    git checkout main
    git pull origin main

#### 🔁 Nếu bạn muốn làm task tiếp theo:

    git checkout -b feature/tên-task-tiếp-theo

## ⚠️ Rủi ro thường gặp & cách phòng tránh

| Tình huống                       | Nguyên nhân                                | Cách xử lý                                  |
|----------------------------------|---------------------------------------------|---------------------------------------------|
| File bị xoá khi chuyển nhánh     | Nhánh mới tạo không dựa từ `main` mới nhất  | Luôn `git pull origin main` trước khi tạo nhánh mới |
| Push nhầm lên `main`             | Không tách nhánh khi bắt đầu code           | Đặt bảo vệ branch `main` trên GitHub        |
| Conflict khi merge               | Cùng chỉnh sửa 1 file trên nhiều nhánh      | Thường xuyên `git pull`, chia nhỏ task      |

## 🧹 Một số lệnh hữu ích

```bash
# Xem tất cả nhánh
git branch -a

# Xóa nhánh local đã merge
git branch --merged | grep -v '\*' | xargs -n 1 git branch -d

# Đổi tên nhánh master thành main
# (Chỉ cần làm 1 lần khi khởi tạo repo)
git branch -m master main
git push -u origin main
git push origin --delete master
```

## 📁 .gitignore nâng cao
Nếu bạn muốn ignore một file đã từng được push:

    git rm --cached tên-file

Sau đó thêm file đó vào .gitignore và commit lại.

## ✅ Kết luận

Hãy tuân thủ quy trình để làm việc nhóm hiệu quả hơn, tránh xung đột và giữ cho dự án sạch sẽ, dễ bảo trì. Nếu bạn là người mới tham gia dự án, hãy clone repo, đọc kỹ README này và hỏi ngay nếu có thắc mắc!