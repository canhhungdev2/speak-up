import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

/**
 * GuestGuard: Chặn người dùng đã đăng nhập truy cập vào các trang dành cho khách
 * (như Landing Page hoặc Register Page)
 */
export const guestGuard: CanActivateFn = async (route, state) => {
  const supabaseService = inject(SupabaseService);
  const router = inject(Router);

  // Đợi quá trình khởi tạo hoàn tất để có kết quả chính xác nhất
  await supabaseService.initialized;

  // Lấy session hiện tại (lúc này chắc chắn đã có kết quả từ initialize)
  const session = supabaseService.currentUser();

  if (session) {
    // Nếu đã đăng nhập, đẩy vào dashboard ngay
    router.navigate(['/learner/courses']);
    return false;
  }

  return true;
};
