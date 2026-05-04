import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { SupabaseService } from '../services/supabase.service';
import { from, switchMap } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const supabaseService = inject(SupabaseService);

  console.log('AuthInterceptor: Đang bắt đầu xử lý request:', req.url);

  return from(supabaseService.getSession()).pipe(
    switchMap((sessionResult) => {
      const token = sessionResult.data.session?.access_token;

      if (token) {
        console.log('AuthInterceptor: Tìm thấy Token, đang gán vào Header.');
        const authReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
        return next(authReq);
      }

      console.warn('AuthInterceptor: Không thấy Session/Token.');
      return next(req);
    })
  );
};
