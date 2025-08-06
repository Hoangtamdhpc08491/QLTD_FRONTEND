import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="change-password-container">
      <div class="change-password-card">
        <div class="change-password-header">
          <h2>Đổi mật khẩu</h2>
          <p>Cập nhật mật khẩu để bảo mật tài khoản</p>
        </div>

        <form [formGroup]="changePasswordForm" (ngSubmit)="onSubmit()" class="change-password-form">
          <div class="form-group">
            <label for="currentPassword">Mật khẩu hiện tại</label>
            <input 
              type="password" 
              id="currentPassword"
              formControlName="currentPassword" 
              class="form-control"
              [class.error]="changePasswordForm.get('currentPassword')?.invalid && changePasswordForm.get('currentPassword')?.touched"
              placeholder="Nhập mật khẩu hiện tại"
            >
            <div class="error-message" *ngIf="changePasswordForm.get('currentPassword')?.invalid && changePasswordForm.get('currentPassword')?.touched">
              <span *ngIf="changePasswordForm.get('currentPassword')?.errors?.['required']">Mật khẩu hiện tại là bắt buộc</span>
            </div>
          </div>

          <div class="form-group">
            <label for="newPassword">Mật khẩu mới</label>
            <input 
              type="password" 
              id="newPassword"
              formControlName="newPassword" 
              class="form-control"
              [class.error]="changePasswordForm.get('newPassword')?.invalid && changePasswordForm.get('newPassword')?.touched"
              placeholder="Nhập mật khẩu mới"
            >
            <div class="error-message" *ngIf="changePasswordForm.get('newPassword')?.invalid && changePasswordForm.get('newPassword')?.touched">
              <span *ngIf="changePasswordForm.get('newPassword')?.errors?.['required']">Mật khẩu mới là bắt buộc</span>
              <span *ngIf="changePasswordForm.get('newPassword')?.errors?.['minlength']">Mật khẩu phải có ít nhất 6 ký tự</span>
            </div>
          </div>

          <div class="form-group">
            <label for="confirmNewPassword">Xác nhận mật khẩu mới</label>
            <input 
              type="password" 
              id="confirmNewPassword"
              formControlName="confirmNewPassword" 
              class="form-control"
              [class.error]="changePasswordForm.get('confirmNewPassword')?.invalid && changePasswordForm.get('confirmNewPassword')?.touched"
              placeholder="Xác nhận mật khẩu mới"
            >
            <div class="error-message" *ngIf="changePasswordForm.get('confirmNewPassword')?.invalid && changePasswordForm.get('confirmNewPassword')?.touched">
              <span *ngIf="changePasswordForm.get('confirmNewPassword')?.errors?.['required']">Xác nhận mật khẩu là bắt buộc</span>
              <span *ngIf="changePasswordForm.get('confirmNewPassword')?.errors?.['passwordMismatch']">Mật khẩu không khớp</span>
            </div>
          </div>

          <div class="success-message" *ngIf="successMessage">
            {{ successMessage }}
          </div>

          <div class="error-message" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>

          <div class="form-actions">
            <button 
              type="button" 
              routerLink="/profile"
              class="btn-secondary"
            >
              Hủy
            </button>
            <button 
              type="submit" 
              class="btn-primary"
              [disabled]="changePasswordForm.invalid || isLoading"
            >
              <span *ngIf="isLoading">Đang xử lý...</span>
              <span *ngIf="!isLoading">Đổi mật khẩu</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .change-password-container {
      min-height: 100vh;
      background: #f8f9fa;
      padding: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .change-password-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      padding: 40px;
      width: 100%;
      max-width: 500px;
    }

    .change-password-header {
      text-align: center;
      margin-bottom: 30px;
    }

    .change-password-header h2 {
      color: #333;
      margin-bottom: 8px;
      font-size: 28px;
      font-weight: 600;
    }

    .change-password-header p {
      color: #666;
      margin: 0;
    }

    .change-password-form {
      margin-bottom: 20px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      margin-bottom: 8px;
      color: #333;
      font-weight: 500;
    }

    .form-control {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid #e1e5e9;
      border-radius: 8px;
      font-size: 16px;
      transition: border-color 0.3s ease;
      box-sizing: border-box;
    }

    .form-control:focus {
      outline: none;
      border-color: #667eea;
    }

    .form-control.error {
      border-color: #e74c3c;
    }

    .error-message {
      color: #e74c3c;
      font-size: 14px;
      margin-top: 5px;
    }

    .success-message {
      background: #d4edda;
      color: #155724;
      padding: 12px;
      border-radius: 8px;
      margin-bottom: 15px;
      border: 1px solid #c3e6cb;
    }

    .form-actions {
      display: flex;
      gap: 15px;
      margin-top: 25px;
    }

    .btn-primary, .btn-secondary {
      flex: 1;
      padding: 14px;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
      text-align: center;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-1px);
    }

    .btn-primary:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
    }

    .btn-secondary:hover {
      background: #5a6268;
      transform: translateY(-1px);
    }

    @media (max-width: 768px) {
      .change-password-container {
        padding: 10px;
      }

      .change-password-card {
        padding: 30px 20px;
      }

      .form-actions {
        flex-direction: column;
      }
    }
  `]
})
export class ChangePassword {
  changePasswordForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmNewPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword');
    const confirmNewPassword = form.get('confirmNewPassword');
    
    if (newPassword && confirmNewPassword && newPassword.value !== confirmNewPassword.value) {
      confirmNewPassword.setErrors({ passwordMismatch: true });
    } else if (confirmNewPassword?.errors?.['passwordMismatch']) {
      delete confirmNewPassword.errors['passwordMismatch'];
      if (Object.keys(confirmNewPassword.errors).length === 0) {
        confirmNewPassword.setErrors(null);
      }
    }
    return null;
  }

  onSubmit(): void {
    if (this.changePasswordForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const { currentPassword, newPassword } = this.changePasswordForm.value;

      this.authService.changePassword({ currentPassword, newPassword }).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          if (response.success) {
            this.successMessage = 'Đổi mật khẩu thành công!';
            setTimeout(() => {
              this.router.navigate(['/profile']);
            }, 2000);
          } else {
            this.errorMessage = response.message;
          }
        },
        error: (error: any) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Đã có lỗi xảy ra';
        }
      });
    }
  }
}
