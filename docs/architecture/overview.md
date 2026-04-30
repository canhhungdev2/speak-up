# Kiến trúc Tổng thể — SpeakUp

## Stack Công nghệ

| Tầng         | Công nghệ               | Ghi chú                       |
| ------------ | ----------------------- | ----------------------------- |
| **Frontend** | Angular 21 (Standalone) | Tailwind CSS, Angular Signals |
| **Backend**  | NestJS                  | REST API, TypeORM             |
| **Database** | PostgreSQL (Supabase)   | TypeORM Entities              |
| **Auth**     | Supabase Auth           | JWT-based (chưa tích hợp)    |
| **Storage**  | External Storage        | Thư mục ngoài dự án (`STORAGE_PATH`) |

## Sơ đồ Kiến trúc

```
┌──────────────────────────────────┐
│           Frontend (Angular)     │
│                                  │
│  ┌─────────┐   ┌──────────────┐  │
│  │ Learner │   │    Admin     │  │
│  │  Portal │   │    Panel     │  │
│  └────┬────┘   └──────┬───────┘  │
└───────┼───────────────┼──────────┘
        │ HTTP REST     │
        ▼               ▼
┌───────────────────────────────────┐
│          Backend (NestJS)         │
│                                   │
│ Courses │ Lessons │ Vocabulary    │
│ Media   │ Dictionary │ Gamify    │
└───────────────────┬───────────────┘
                    │ TypeORM
                    ▼
┌───────────────────────────────────┐
│        PostgreSQL (Supabase)      │
│                                   │
│  profiles │ courses │ vocabulary  │
│  lessons  │ user_progress         │
└───────────────────────────────────┘
```

## Cấu trúc Thư mục Frontend

```
frontend/src/app/
├── core/
│   ├── services/
│   │   ├── theme.service.ts           # Quản lý Light/Dark mode
│   │   ├── course.service.ts          # CRUD khóa học
│   │   ├── lesson.service.ts          # CRUD bài học
│   │   ├── vocabulary.service.ts      # CRUD + reorder từ vựng
│   │   ├── dictionary.service.ts      # Tra từ điển tự động
│   │   ├── media.service.ts           # Xử lý URL và VTT media
│   │   ├── gamification.service.ts    # Hệ thống gamification
│   │   └── sidebar.service.ts         # Quản lý trạng thái sidebar
│   └── interceptors/
│       └── loading.interceptor.ts     # Loading overlay cho HTTP requests
├── shared/
│   ├── pipes/
│   │   └── media-url.pipe.ts          # Chuyển đổi đường dẫn media → URL đầy đủ
│   └── components/
│       └── admin-audio-upload.component.ts  # Component upload audio tái sử dụng
├── features/
│   ├── auth/
│   │   └── register.component.ts      # Đăng ký / Đăng nhập
│   ├── landing/
│   │   └── landing.component.ts       # Trang giới thiệu
│   ├── learner/
│   │   ├── layout/
│   │   │   └── learner-layout.component.ts  # Sidebar + Header dùng chung
│   │   ├── dashboard/
│   │   │   └── dashboard.component.ts
│   │   ├── courses/
│   │   │   ├── course-list.component.ts     # Danh sách khóa học
│   │   │   ├── lesson-list.component.ts     # Danh sách bài học
│   │   │   └── lesson-player.component.ts   # Màn hình học bài (CORE)
│   │   └── vocabulary/
│   │       ├── vocabulary-list.component.ts
│   │       └── study.component.ts           # Ôn tập SRS Flashcard
│   └── admin/
│       ├── layout/
│       │   └── admin-layout.component.ts
│       ├── dashboard/
│       │   └── dashboard.component.ts
│       ├── courses/
│       │   ├── admin-course-list.component.ts
│       │   └── admin-course-edit.component.ts
│       └── lessons/
│           ├── admin-lesson-list.component.ts
│           ├── admin-lesson-edit.component.ts
│           ├── lesson-edit.service.ts        # Đồng bộ state giữa các tab
│           └── sections/
│               ├── admin-lesson-article.component.ts
│               ├── admin-lesson-vocabulary.component.ts
│               ├── admin-lesson-mini-story.component.ts
│               ├── admin-lesson-pov.component.ts
│               └── admin-lesson-commentary.component.ts
└── app.routes.ts                            # Router gốc
```

## Cấu trúc Thư mục Backend

```
backend/src/
├── entities/
│   ├── course.entity.ts               # Khóa học
│   ├── lesson.entity.ts               # Bài học
│   ├── vocabulary.entity.ts           # Từ vựng
│   └── user.entity.ts                 # Người dùng
├── modules/
│   ├── courses/                       # CRUD + reorder khóa học
│   ├── lessons/                       # CRUD + reorder bài học
│   ├── vocabulary/                    # CRUD + reorder từ vựng
│   ├── media/                         # Upload + serve media files
│   └── dictionary/                    # Proxy tra từ điển
└── common/
    └── utils/
        └── slugify.ts                 # Tạo slug thân thiện từ title
```

## Phân quyền Người dùng

| Role      | Quyền truy cập                       |
| --------- | ------------------------------------ |
| `guest`   | Landing page, Register               |
| `learner` | `/learner/*` — toàn bộ giao diện học |
| `admin`   | `/admin/*` — quản lý nội dung        |

## Design Patterns Sử dụng

| Pattern | Áp dụng |
|---------|---------|
| **Standalone Components** | Toàn bộ Angular components |
| **Angular Signals** | State management (thay thế BehaviorSubject) |
| **OnPush Change Detection** | Tối ưu hiệu năng render |
| **Shared Service** | `LessonEditService` đồng bộ state giữa tabs |
| **Pipe Transform** | `MediaUrlPipe` chuẩn hóa đường dẫn media |
| **CDK Drag Drop** | Kéo thả sắp xếp (Lessons, Vocabularies) |
