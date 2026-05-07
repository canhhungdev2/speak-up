# Quy trình Đóng góp (Contributing Guide)

Chào mừng bạn tham gia phát triển dự án SpeakUp! Để đảm bảo mã nguồn luôn sạch sẽ và dễ quản lý, vui lòng tuân thủ các quy tắc sau.

## 🌿 Quy tắc Nhánh (Branching Strategy)

- **main**: Nhánh chính, chứa mã nguồn ổn định nhất.
- **develop**: Nhánh tích hợp cho các tính năng mới.
- **feature/[tên-tính-năng]**: Nhánh dành cho phát triển tính năng mới.
- **fix/[tên-lỗi]**: Nhánh dành cho sửa lỗi.

Ví dụ: `feature/google-login`, `fix/profile-email-sync`.

## 🛠 Quy trình Phát triển

1. **Pull mới nhất**: Luôn luôn pull mã nguồn mới nhất từ nhánh `develop` trước khi bắt đầu.
2. **Tạo nhánh mới**: `git checkout -b feature/your-feature-name`.
3. **Viết code**: Đảm bảo tuân thủ coding standards của dự án.
4. **Kiểm tra**: Chạy `npm run lint` và đảm bảo không có lỗi TypeScript.
5. **Commit**: Viết commit message rõ ràng, ngắn gọn (ưu tiên tiếng Anh hoặc tiếng Việt chuẩn).
6. **Push & Pull Request**: Push nhánh của bạn lên remote và tạo Pull Request (PR) vào nhánh `develop`.

## 🎨 Quy chuẩn Mã nguồn (Coding Standards)

- **Angular**: Sử dụng Signals cho state management. Tuân thủ Angular Style Guide.
- **NestJS**: Sử dụng Dependency Injection đúng cách. Đảm bảo các Controller/Service được phân tách rõ ràng.
- **Đặt tên**:
    - Folder/File: `kebab-case` (ví dụ: `user-profile.component.ts`).
    - Class: `PascalCase` (ví dụ: `UserProfileComponent`).
    - Biến/Hàm: `camelCase` (ví dụ: `getUserProfile()`).

## 📝 Commit Message Format

Sử dụng format sau: `[type]: [description]`

- `feat`: Tính năng mới.
- `fix`: Sửa lỗi.
- `docs`: Cập nhật tài liệu.
- `style`: Thay đổi format code (không ảnh hưởng logic).
- `refactor`: Tái cấu trúc mã nguồn.

Ví dụ: `feat: add google oauth support` hoặc `fix: resolve email sync issue`.

---
Cảm ơn bạn đã đồng hành cùng SpeakUp!
