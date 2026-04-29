# Kiến trúc Tổng thể — SpeakUp

## Stack Công nghệ

| Tầng         | Công nghệ               | Ghi chú                       |
| ------------ | ----------------------- | ----------------------------- |
| **Frontend** | Angular 21 (Standalone) | Tailwind CSS, Angular Signals |
| **Backend**  | NestJS                  | REST API                      |
| **Database** | PostgreSQL (Supabase)   | TypeORM                       |
| **Auth**     | Supabase Auth           | JWT-based                     |
| **Storage**  | Supabase Storage        | Media files                   |

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
│ Auth │ Courses │ Vocab │ Progress │
└───────────────────┬───────────────┘
                    │ TypeORM
                    ▼
┌───────────────────────────────────┐
│        Supabase (PostgreSQL)      │
│                                   │
│  profiles │ courses │ vocabulary  │
│  lessons │ user_progress          │
└───────────────────────────────────┘
```

## Cấu trúc Thư mục Frontend

```
frontend/src/app/
├── core/
│   └── services/
│       └── theme.service.ts       # Quản lý Light/Dark mode
├── features/
│   ├── auth/
│   │   └── register.component.ts  # Đăng ký / Đăng nhập
│   ├── landing/
│   │   └── landing.component.ts   # Trang giới thiệu
│   └── learner/
│       ├── layout/
│       │   └── learner-layout.component.ts  # Sidebar + Header dùng chung
│       ├── dashboard/
│       │   └── dashboard.component.ts
│       ├── courses/
│       │   ├── course-list.component.ts
│       │   └── lesson-list.component.ts
│       └── vocabulary/
│           ├── vocabulary-list.component.ts
│           └── study.component.ts           # Màn hình ôn tập SRS
└── app.routes.ts                            # Router gốc
```

## Phân quyền Người dùng

| Role      | Quyền truy cập                       |
| --------- | ------------------------------------ |
| `guest`   | Landing page, Register               |
| `learner` | `/learner/*` — toàn bộ giao diện học |
| `admin`   | `/admin/*` — quản lý nội dung        |
