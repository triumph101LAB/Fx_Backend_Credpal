import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class VerifiedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const { user } = context.switchToHttp().getRequest();

    if (!user) return false;
    if (!user.isVerified) {
      throw new ForbiddenException('Please verify your email to access this feature');
    }

    return true;
  }
}
