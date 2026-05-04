import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const supabaseService = inject(SupabaseService);
  const router = inject(Router);

  // 1. Kiểm tra session cơ bản
  const { data: { session }, error: sessionError } = await supabaseService.getSession();
  
  if (sessionError || !session) {
    router.navigate(['/register']);
    return false;
  }

  // 2. Kiểm tra phân quyền (nếu route có yêu cầu role cụ thể)
  const requiredRole = route.data['requiredRole'];
  if (requiredRole) {
    // Đợi quá trình khởi tạo (lấy profile) hoàn tất
    await supabaseService.initialized;

    const profile = supabaseService.profile();
    const currentRole = profile?.role;

    if (currentRole !== requiredRole) {
      // Nếu là admin vào trang learner thì cho phép, ngược lại thì chặn
      if (currentRole === 'admin' && requiredRole === 'learner') {
        return true;
      }

      router.navigate([currentRole === 'admin' ? '/admin' : '/register']);
      return false;
    }
  }

  return true;
};
