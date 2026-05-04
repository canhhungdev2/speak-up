import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { User } from '../../entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private dataSource: DataSource,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userPayload = request.user; // Đã được SupabaseAuthGuard gán vào

    if (!userPayload || !userPayload.sub) {
      return false;
    }

    // Truy vấn role từ bảng profiles (User entity)
    const userRepository = this.dataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: userPayload.sub } });

    if (!user) {
      throw new ForbiddenException('Không tìm thấy thông tin người dùng trong hệ thống');
    }

    const hasRole = requiredRoles.some((role) => user.role === role);
    if (!hasRole) {
      throw new ForbiddenException('Bạn không có quyền thực hiện hành động này');
    }

    return true;
  }
}
