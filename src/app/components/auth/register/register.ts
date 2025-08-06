import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h2>Đăng ký</h2>
          <p>Tạo tài khoản mới để bắt đầu!</p>
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="auth-form">
          <div class="form-group">
            <label for="name">Họ và tên</label>
            <input 
              type="text" 
              id="name"
              formControlName="name" 
              class="form-control"
              [class.error]="registerForm.get('name')?.invalid && registerForm.get('name')?.touched"
              placeholder="Nhập họ và tên"
            >
            <div class="error-message" *ngIf="registerForm.get('name')?.invalid && registerForm.get('name')?.touched">
              <span *ngIf="registerForm.get('name')?.errors?.['required']">Họ và tên là bắt buộc</span>
            </div>
          </div>

          <div class="form-group">
            <label for="username">Tên đăng nhập</label>
            <input 
              type="text" 
              id="username"
              formControlName="username" 
              class="form-control"
              [class.error]="registerForm.get('username')?.invalid && registerForm.get('username')?.touched"
              placeholder="Nhập tên đăng nhập"
            >
            <div class="error-message" *ngIf="registerForm.get('username')?.invalid && registerForm.get('username')?.touched">
              <span *ngIf="registerForm.get('username')?.errors?.['required']">Tên đăng nhập là bắt buộc</span>
              <span *ngIf="registerForm.get('username')?.errors?.['minlength']">Tên đăng nhập phải có ít nhất 3 ký tự</span>
            </div>
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email"
              formControlName="email" 
              class="form-control"
              [class.error]="registerForm.get('email')?.invalid && registerForm.get('email')?.touched"
              placeholder="Nhập email"
            >
            <div class="error-message" *ngIf="registerForm.get('email')?.invalid && registerForm.get('email')?.touched">
              <span *ngIf="registerForm.get('email')?.errors?.['required']">Email là bắt buộc</span>
              <span *ngIf="registerForm.get('email')?.errors?.['email']">Email không hợp lệ</span>
            </div>
          </div>

          <div class="form-group">
            <label for="phone">Số điện thoại</label>
            <input 
              type="tel" 
              id="phone"
              formControlName="phone" 
              class="form-control"
              [class.error]="registerForm.get('phone')?.invalid && registerForm.get('phone')?.touched"
              placeholder="Nhập số điện thoại"
            >
            <div class="error-message" *ngIf="registerForm.get('phone')?.invalid && registerForm.get('phone')?.touched">
              <span *ngIf="registerForm.get('phone')?.errors?.['required']">Số điện thoại là bắt buộc</span>
              <span *ngIf="registerForm.get('phone')?.errors?.['pattern']">Số điện thoại không hợp lệ</span>
            </div>
          </div>

          <div class="form-group">
            <label for="password">Mật khẩu</label>
            <input 
              type="password" 
              id="password"
              formControlName="password" 
              class="form-control"
              [class.error]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched"
              placeholder="Nhập mật khẩu"
            >
            <div class="error-message" *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched">
              <span *ngIf="registerForm.get('password')?.errors?.['required']">Mật khẩu là bắt buộc</span>
              <span *ngIf="registerForm.get('password')?.errors?.['minlength']">Mật khẩu phải có ít nhất 6 ký tự</span>
            </div>
          </div>

          <div class="form-group">
            <label for="confirmPassword">Xác nhận mật khẩu</label>
            <input 
              type="password" 
              id="confirmPassword"
              formControlName="confirmPassword" 
              class="form-control"
              [class.error]="registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched"
              placeholder="Xác nhận mật khẩu"
            >
            <div class="error-message" *ngIf="registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched">
              <span *ngIf="registerForm.get('confirmPassword')?.errors?.['required']">Xác nhận mật khẩu là bắt buộc</span>
              <span *ngIf="registerForm.get('confirmPassword')?.errors?.['passwordMismatch']">Mật khẩu không khớp</span>
            </div>
          </div>

          <div class="error-message" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>

          <button 
            type="submit" 
            class="btn-primary"
            [disabled]="registerForm.invalid || isLoading"
          >
            <span *ngIf="isLoading">Đang xử lý...</span>
            <span *ngIf="!isLoading">Đăng ký</span>
          </button>
        </form>

        <div class="auth-footer">
          <p>Đã có tài khoản? <a routerLink="/auth/login">Đăng nhập ngay</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .auth-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
      padding: 40px;
      width: 100%;
      max-width: 450px;
    }

    .auth-header {
      text-align: center;
      margin-bottom: 30px;
    }

    .auth-header h2 {
      color: #333;
      margin-bottom: 8px;
      font-size: 28px;
      font-weight: 600;
    }

    .auth-header p {
      color: #666;
      margin: 0;
    }

    .auth-form {
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

    .btn-primary {
      width: 100%;
      padding: 14px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s ease;
      margin-top: 10px;
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-1px);
    }

    .btn-primary:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .auth-footer {
      text-align: center;
      padding-top: 20px;
      border-top: 1px solid #e1e5e9;
    }

    .auth-footer p {
      margin: 0;
      color: #666;
    }

    .auth-footer a {
      color: #667eea;
      text-decoration: none;
      font-weight: 500;
    }

    .auth-footer a:hover {
      text-decoration: underline;
    }
  `]
})
export class Register {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10,11}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else if (confirmPassword?.errors?.['passwordMismatch']) {
      delete confirmPassword.errors['passwordMismatch'];
      if (Object.keys(confirmPassword.errors).length === 0) {
        confirmPassword.setErrors(null);
      }
    }
    return null;
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const { confirmPassword, ...userData } = this.registerForm.value;

      this.authService.register(userData).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          if (response.success) {
            this.router.navigate(['/']);
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
