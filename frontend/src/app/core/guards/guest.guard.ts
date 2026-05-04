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

  // Lấy session hiện tại
  const { data: { session } } = await supabaseService.getSession();

  if (session) {
    // Nếu đã đăng nhập, đẩy vào dashboard ngay
    router.navigate(['/learner/courses']);
    return false;
  }

  return true;
};
