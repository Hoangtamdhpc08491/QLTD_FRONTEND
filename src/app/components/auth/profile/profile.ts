import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService, User } from '../../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="profile-container">
      <div class="profile-card">
        <div class="profile-header">
          <h2>Thông tin cá nhân</h2>
          <div class="profile-actions">
            <a routerLink="/auth/change-password" class="btn-secondary">Đổi mật khẩu</a>
          </div>
        </div>

        <div class="profile-content" *ngIf="user; else loading">
          <div class="profile-section">
            <div class="info-group">
              <label>Họ và tên</label>
              <div class="info-value">{{ user.name }}</div>
            </div>

            <div class="info-group">
              <label>Tên đăng nhập</label>
              <div class="info-value">{{ user.username }}</div>
            </div>

            <div class="info-group">
              <label>Email</label>
              <div class="info-value">{{ user.email }}</div>
            </div>

            <div class="info-group">
              <label>Số điện thoại</label>
              <div class="info-value">{{ user.phone }}</div>
            </div>

            <div class="info-group" *ngIf="user.creditRating">
              <label>Điểm tín dụng</label>
              <div class="info-value">
                <span class="credit-rating" [class]="getCreditRatingClass(user.creditRating)">
                  {{ user.creditRating }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <ng-template #loading>
          <div class="loading">
            <p>Đang tải thông tin...</p>
          </div>
        </ng-template>

        <div class="error-message" *ngIf="errorMessage">
          {{ errorMessage }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      min-height: 100vh;
      background: #f8f9fa;
      padding: 20px;
    }

    .profile-card {
      max-width: 600px;
      margin: 0 auto;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .profile-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .profile-header h2 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }

    .profile-actions {
      display: flex;
      gap: 10px;
    }

    .btn-secondary {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      padding: 8px 16px;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 500;
      transition: background 0.3s ease;
    }

    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    .profile-content {
      padding: 30px;
    }

    .profile-section {
      display: grid;
      gap: 25px;
    }

    .info-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .info-group label {
      font-weight: 600;
      color: #333;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .info-value {
      font-size: 18px;
      color: #555;
      padding: 12px 0;
      border-bottom: 1px solid #e1e5e9;
    }

    .credit-rating {
      padding: 4px 12px;
      border-radius: 20px;
      font-weight: 600;
      font-size: 16px;
    }

    .credit-rating.excellent {
      background: #d4edda;
      color: #155724;
    }

    .credit-rating.good {
      background: #cce5ff;
      color: #004085;
    }

    .credit-rating.fair {
      background: #fff3cd;
      color: #856404;
    }

    .credit-rating.poor {
      background: #f8d7da;
      color: #721c24;
    }

    .loading {
      padding: 40px;
      text-align: center;
      color: #666;
    }

    .error-message {
      background: #f8d7da;
      color: #721c24;
      padding: 15px;
      margin: 20px 30px;
      border-radius: 8px;
      border: 1px solid #f5c6cb;
    }

    @media (max-width: 768px) {
      .profile-header {
        flex-direction: column;
        gap: 15px;
        text-align: center;
      }

      .profile-container {
        padding: 10px;
      }

      .profile-content {
        padding: 20px;
      }
    }
  `]
})
export class Profile implements OnInit {
  user: User | null = null;
  errorMessage = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  private loadProfile(): void {
    this.authService.getProfile().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.user = response.user;
        } else {
          this.errorMessage = 'Không thể tải thông tin hồ sơ';
        }
      },
      error: (error: any) => {
        this.errorMessage = error.error?.message || 'Đã có lỗi xảy ra';
      }
    });
  }

  getCreditRatingClass(rating: number): string {
    if (rating >= 750) return 'excellent';
    if (rating >= 650) return 'good';
    if (rating >= 550) return 'fair';
    return 'poor';
  }
}
