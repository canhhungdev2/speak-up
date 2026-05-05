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
  
  // Dùng Promise chung để tránh trường hợp 2 nơi cùng gọi nhưng nơi thứ 2 lại không đợi
  private _fetchProfilePromise: Promise<void> | null = null;

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
      
      // Chỉ fetch profile nếu chưa có hoặc khi đăng nhập mới
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
    if (this._fetchProfilePromise) {
      return this._fetchProfilePromise; // Chờ chung Promise nếu đang gọi rồi
    }

    this._fetchProfilePromise = (async () => {
      try {
        const fetchPromise = this.supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .limit(1);

        // Giới hạn 2.5s để tránh app chờ quá lâu nếu database bị khóa
        const { data, error } = await Promise.race([
          fetchPromise,
          new Promise<any>((_, reject) => setTimeout(() => reject(new Error('Timeout 2.5s')), 2500))
        ]);

        console.log("fetchProfile data:", data);
        if (error) {
          console.error("fetchProfile error:", error);
        }

        if (!error && data && data.length > 0) {
          this._profile.set(data[0]);
        }
      } catch (err) {
        console.error("fetchProfile exception:", err);
      } finally {
        this._fetchProfilePromise = null;
      }
    })();

    return this._fetchProfilePromise;
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
