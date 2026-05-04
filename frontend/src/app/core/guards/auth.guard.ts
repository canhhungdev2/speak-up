import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const supabaseService = inject(SupabaseService);
  const router = inject(Router);

  // 1. Kiểm tra session cơ bản
  const { data: { session } } = await supabaseService.getSession();

  if (!session) {
    router.navigate(['/register']);
    return false;
  }

  // 2. Kiểm tra phân quyền (nếu route có yêu cầu role cụ thể)
  const requiredRole = route.data['requiredRole'];
  if (requiredRole) {
    // Lấy profile từ database (hoặc từ signal nếu đã load)
    const profile = supabaseService.profile();
    
    // Nếu chưa có profile trong signal, thử đợi 1 chút hoặc fetch lại
    if (!profile) {
      // Đợi initialize hoàn tất (có thể tối ưu hơn bằng cách dùng Observable/Promise)
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    const currentRole = supabaseService.profile()?.role;

    if (currentRole !== requiredRole) {
      console.warn(`Truy cập bị chặn: Yêu cầu ${requiredRole}, nhưng bạn là ${currentRole}`);
      router.navigate(['/learner/courses']);
      return false;
    }
  }

  return true;
};
