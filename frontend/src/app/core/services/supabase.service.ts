import { Injectable, signal, computed } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;
  
  // Signal lưu trữ thông tin user hiện tại
  private _currentUser = signal<User | null>(null);
  private _profile = signal<any | null>(null); // Lưu thông tin từ bảng public.profiles

  currentUser = computed(() => this._currentUser());
  profile = computed(() => this._profile());
  isLoggedIn = computed(() => !!this._currentUser());
  isAdmin = computed(() => this._profile()?.role === 'admin');

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );

    // Lắng nghe sự thay đổi trạng thái đăng nhập
    this.supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Sự kiện Auth:', event);
      const user = session?.user ?? null;
      this._currentUser.set(user);
      
      if (user) {
        await this.fetchProfile(user.id);
      } else {
        this._profile.set(null);
      }
    });

    // Khởi tạo user ngay khi load app
    this.initialize();
  }

  private async initialize() {
    const { data: { user } } = await this.supabase.auth.getUser();
    this._currentUser.set(user);
    if (user) {
      await this.fetchProfile(user.id);
    }
  }

  private async fetchProfile(userId: string) {
    try {
      const fetchPromise = this.supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .limit(1);

      const { data, error } = await Promise.race([
        fetchPromise,
        new Promise<any>((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
      ]);

      if (error) {
        this._profile.set(null);
        return;
      }

      const profileData = data && data.length > 0 ? data[0] : null;
      this._profile.set(profileData);
    } catch (err) {
      this._profile.set(null);
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
