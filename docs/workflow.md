# Quy trình Bảo trì Tài liệu (Documentation Workflow)

Để đảm bảo tài liệu luôn phản ánh đúng trạng thái của mã nguồn, chúng ta áp dụng quy trình sau:

## 1. Nguyên tắc "Tài liệu đi đôi với Code"
Mọi thay đổi quan trọng về code (đặc biệt là logic nghiệp vụ, cấu trúc dữ liệu hoặc giao diện) đều phải được cập nhật vào tài liệu tương ứng ngay trong cùng một lượt commit/task.

## 2. Các tệp tin cần chú ý

| Loại thay đổi | Tệp tài liệu cần cập nhật |
|---|---|
| Thay đổi Schema Database / Entity | `docs/database/schema.md` |
| Thêm/Sửa tính năng (UI/Logic) | `docs/features/XX-name.md` |
| Thay đổi công nghệ / Kiến trúc | `docs/architecture/overview.md` |
| Thay đổi trạng thái dự án | `docs/README.md` (Phần Status) |

## 3. Cách viết tài liệu
- **Ngôn ngữ**: Sử dụng tiếng Việt cho các mô tả nghiệp vụ và giải thích. Sử dụng tiếng Anh cho các thuật ngữ kỹ thuật, tên biến, tên hàm.
- **Mã nguồn**: Sử dụng các khối code markdown (```typescript, ```sql) để minh họa logic.
- **Định dạng Nội dung**: Đối với các nội dung bài học cần bôi đậm hoặc in nghiêng (ví dụ highlight từ vựng), hãy sử dụng trực tiếp các thẻ HTML cơ bản như `<b>`, `<i>` trong chuỗi văn bản. Frontend sẽ render chúng thông qua thuộc tính `innerHTML`.
- **Trạng thái**: Sử dụng các biểu tượng:
    - ✅ : Hoàn thành
    - 🚧 : Đang thực hiện / Mock
    - ❌ : Chưa bắt đầu / Bị hủy

## 4. JSDoc trong Code
Đối với các hàm hoặc lớp có logic phức tạp, hãy sử dụng JSDoc trực tiếp trong code để giải thích tham số và giá trị trả về. Tài liệu trong `docs/` sẽ tập trung vào cái nhìn tổng quan và luồng nghiệp vụ.
