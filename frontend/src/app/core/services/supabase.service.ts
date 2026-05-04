import { Injectable, signal, computed } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;
  
  private _currentUser = signal<User | null>(null);
  private _profile = signal<any | null>(null);
  private _isInitializing = signal<boolean>(true);
  private _isFetchingProfile = false;

  // Lời hứa (Promise) để các Guard có thể đợi quá trình khởi tạo hoàn tất
  private resolveInitialized!: (value: void | PromiseLike<void>) => void;
  initialized = new Promise<void>((resolve) => {
    this.resolveInitialized = resolve;
  });

  currentUser = computed(() => this._currentUser());
  profile = computed(() => this._profile());
  isLoggedIn = computed(() => !!this._currentUser());
  isAdmin = computed(() => this._profile()?.role === 'admin');
  isInitializing = computed(() => this._isInitializing());

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );

    // Lắng nghe sự thay đổi trạng thái đăng nhập
    this.supabase.auth.onAuthStateChange(async (event, session) => {
      const user = session?.user ?? null;
      this._currentUser.set(user);
      
      // Chỉ fetch profile nếu chưa có hoặc khi đăng nhập mới, 
      // tránh gọi trùng với initialize()
      if (user && !this._profile()) {
        await this.fetchProfile(user.id);
      } else if (!user) {
        this._profile.set(null);
      }
    });

    // Khởi tạo user ngay khi load app
    this.initialize().finally(() => {
      this._isInitializing.set(false);
      this.resolveInitialized();
    });
  }

  private async initialize() {
    const { data: { user } } = await this.supabase.auth.getUser();
    this._currentUser.set(user);
    if (user) {
      await this.fetchProfile(user.id);
    }
  }

  private async fetchProfile(userId: string) {
    if (this._isFetchingProfile) return;
    this._isFetchingProfile = true;

    try {
      const fetchPromise = this.supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .limit(1);

      // Giảm timeout xuống 2s để app phản hồi nhanh hơn
      const { data, error } = await Promise.race([
        fetchPromise,
        new Promise<any>((_, reject) => setTimeout(() => reject(new Error('Timeout')), 2000))
      ]);

      if (!error && data && data.length > 0) {
        this._profile.set(data[0]);
      }
    } catch (err) {
      // Bỏ qua lỗi để app vẫn có thể vào được (AuthGuard sẽ xử lý tiếp)
    } finally {
      this._isFetchingProfile = false;
    }
  }

  /**
   * Đăng nhập bằng Google
   */
  async signInWithGoogle() {
    const { data, error } = await this.supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
        redirectTo: window.location.origin + '/learner/courses'
      }
    });

    if (error) {
      console.error('Lỗi đăng nhập Google:', error.message);
      throw error;
    }

    return data;
  }

  /**
   * Đăng xuất
   */
  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    if (error) {
      console.error('Lỗi đăng xuất:', error.message);
    } else {
      this._currentUser.set(null);
      this._profile.set(null);
    }
  }

  /**
   * Lấy session hiện tại
   */
  getSession() {
    return this.supabase.auth.getSession();
  }
}
