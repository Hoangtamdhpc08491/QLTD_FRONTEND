import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Footer } from '../../shared/footer/footer';
import { Header } from '../../shared/header/header';
import { LoanPackageService, LoanPackage } from '../../../services/loan-package.service';

@Component({
  selector: 'app-loan-packages-list',
  imports: [CommonModule, RouterModule, Footer, Header],
  templateUrl: './loan-packages-list.html',
  styleUrl: './loan-packages-list.css'
})
export class LoanPackagesList implements OnInit {
  loanPackages: LoanPackage[] = [];
  loading = true;
  error: string | null = null;

  private loanPackageService = inject(LoanPackageService);

  ngOnInit() {
    this.loadLoanPackages();
  }

  loadLoanPackages() {
    this.loading = true;
    this.error = null;
    
    console.log('Loading loan packages from API...');
    
    this.loanPackageService.getAllLoanPackages().subscribe({
      next: (response) => {
        console.log('API Response:', response);
        if (response.success) {
          this.loanPackages = response.data;
          console.log('Loaded loan packages:', this.loanPackages.length);
          console.log('Package details:', this.loanPackages);
          // Debug từng package
          this.loanPackages.forEach((pkg, index) => {
            console.log(`Package ${index + 1}:`, {
              id: pkg.id,
              name: pkg.name,
              description1: pkg.description1,
              baseInterestRate: pkg.baseInterestRate,
              maxAmount: pkg.maxAmount,
              category: pkg.category
            });
          });
        } else {
          this.error = response.message;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading loan packages:', error);
        this.error = 'Không thể tải danh sách gói vay. Vui lòng thử lại sau.';
        this.loading = false;
      }
    });
  }

  formatCurrency(amount: number | undefined): string {
    if (amount === undefined || amount === null) {
      return 'Liên hệ';
    }
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  }

  getInterestRateText(rate: number | undefined): string {
    if (rate === undefined || rate === null) {
      return 'Liên hệ';
    }
    return `${rate}%/năm`;
  }

  formatDate(date: string): string {
    if (!date) return 'Không có thông tin';
    try {
      return new Intl.DateTimeFormat('vi-VN').format(new Date(date));
    } catch {
      return 'Không có thông tin';
    }
  }

  // Hàm để lấy icon mặc định cho gói vay dựa trên tên
  getPackageIcon(packageName: string): string {
    const name = packageName.toLowerCase();
    if (name.includes('kinh doanh') || name.includes('doanh nghiệp')) return '🏢';
    if (name.includes('cá nhân') || name.includes('tiêu dùng')) return '👤';
    if (name.includes('thế chấp') || name.includes('tài sản')) return '🏠';
    if (name.includes('nhanh') || name.includes('siêu tốc')) return '⚡';
    if (name.includes('sinh viên') || name.includes('học phí')) return '🎓';
    if (name.includes('online') || name.includes('trực tuyến')) return '💻';
    return '💰'; // icon mặc định
  }

  getPackageStatus(): boolean {
    return true; // Mặc định tất cả gói vay đều đang mở
  }
}
