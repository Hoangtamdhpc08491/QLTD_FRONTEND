import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    router.navigate(['/auth/login']);
    return false;
  }

  const currentUser = authService.getCurrentUser();
  
  // Kiểm tra xem user có role admin không hoặc username = 'admin'
  if (currentUser && (currentUser.role === 'admin' || currentUser.username === 'admin')) {
    return true;
  }

  // Redirect về trang chủ nếu không phải admin
  router.navigate(['/']);
  alert('Bạn không có quyền truy cập trang quản trị!');
  return false;
};
