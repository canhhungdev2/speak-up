import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { JwksClient } from 'jwks-rsa';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  private jwksClient: JwksClient;

  constructor() {
    // URL này lấy từ Supabase Dashboard của bạn
    this.jwksClient = new JwksClient({
      jwksUri: 'https://wzppihyxngpiqkwgpevi.supabase.co/auth/v1/.well-known/jwks.json',
      cache: true,
      rateLimit: true,
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Không tìm thấy token xác thực');
    }

    try {
      // 1. Giải mã header để lấy 'kid' (Key ID)
      const decoded: any = jwt.decode(token, { complete: true });
      if (!decoded || !decoded.header.kid) {
        throw new Error('Token không hợp lệ (thiếu kid)');
      }

      // 2. Lấy Public Key từ Supabase dựa trên kid
      const key = await this.jwksClient.getSigningKey(decoded.header.kid);
      const publicKey = key.getPublicKey();

      // 3. Xác thực Token với Public Key và thuật toán ES256
      const payload = jwt.verify(token, publicKey, { algorithms: ['ES256'] }) as any;
      
      // Gán thông tin user vào request
      request['user'] = payload;
      return true;
    } catch (error) {
      console.error('Lỗi Auth Guard:', error.message);
      throw new UnauthorizedException('Token không hợp lệ hoặc đã hết hạn');
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const authHeader = request.headers.authorization || request.headers.Authorization;
    if (!authHeader) return undefined;
    
    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}
