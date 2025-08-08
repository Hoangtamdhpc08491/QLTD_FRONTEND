import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoanPackageService, LoanPackage as BackendLoanPackage } from '../../../services/loan-package.service';

interface LoanPackage {
  id: string;
  title: string;
  description: string;
  icon: string;
  interestRate: string;
  maxAmount: string;
  duration: string;
  buttonText: string;
  link: string;
  features: {
    icon: string;
    title: string;
    description: string;
  }[];
}

@Component({
  selector: 'app-loan-packages',
  imports: [CommonModule, RouterModule],
  templateUrl: './loan-packages.html',
  styleUrl: './loan-packages.css'
})
export class LoanPackages implements OnInit {
  private loanPackageService = inject(LoanPackageService);
  
  loanPackages: LoanPackage[] = [];
  isLoading = true;
  error: string | null = null;

  ngOnInit() {
    this.loadLoanPackages();
  }

  private loadLoanPackages() {
    this.isLoading = true;
    this.error = null;

    this.loanPackageService.getAllLoanPackages().subscribe({
      next: (response) => {
        if (response.success) {
          this.loanPackages = this.transformToDisplayFormat(response.data);
        } else {
          this.error = response.message;
          this.setMockData();
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading loan packages:', error);
        this.error = 'Không thể tải danh sách gói vay';
        this.setMockData();
        this.isLoading = false;
      }
    });
  }

  private transformToDisplayFormat(backendPackages: BackendLoanPackage[]): LoanPackage[] {
    return backendPackages.slice(0, 3).map((pkg, index) => ({
      id: pkg.id.toString(),
      title: pkg.name,
      description: pkg.description1,
      icon: this.getPackageIcon(pkg.name, index),
      interestRate: `${pkg.baseInterestRate}%/năm`,
      maxAmount: pkg.maxAmount ? this.formatCurrency(pkg.maxAmount) : '500 triệu VND',
      duration: '6-36 tháng',
      buttonText: 'Đăng ký ngay',
      link: `/goi-vay/chi-tiet/${pkg.id}`,
      features: this.generateFeatures(pkg, index)
    }));
  }

  private getPackageIcon(packageName: string, index: number): string {
    const icons = ['🏢', '👤', '🏠', '💰', '🚀', '📊'];
    if (packageName.toLowerCase().includes('kinh doanh')) return '🏢';
    if (packageName.toLowerCase().includes('cá nhân')) return '👤';
    if (packageName.toLowerCase().includes('thế chấp')) return '🏠';
    return icons[index % icons.length];
  }

  private generateFeatures(pkg: BackendLoanPackage, index: number): {icon: string; title: string; description: string}[] {
    const defaultFeatures = [
      [
        { icon: '⚡', title: 'Duyệt nhanh', description: 'Chỉ 15 phút duyệt hồ sơ' },
        { icon: '💰', title: 'Hạn mức cao', description: 'Lên đến 500 triệu VND' }
      ],
      [
        { icon: '💻', title: 'Hoàn toàn online', description: 'Không cần đến văn phòng' },
        { icon: '🚀', title: 'Giải ngân nhanh', description: 'Nhận tiền trong ngày' }
      ],
      [
        { icon: '📉', title: 'Lãi suất thấp', description: `Chỉ từ ${pkg.baseInterestRate}%/năm` },
        { icon: '💎', title: 'Hạn mức lớn', description: 'Lên đến 2 tỷ VND' }
      ]
    ];
    
    return defaultFeatures[index % defaultFeatures.length];
  }

  private formatCurrency(amount: number): string {
    if (amount >= 1000000000) {
      return `${(amount / 1000000000).toFixed(1)} tỷ VND`;
    } else if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(0)} triệu VND`;
    }
    return `${amount.toLocaleString('vi-VN')} VND`;
  }

  private setMockData() {
    this.loanPackages = [
      {
        id: 'VKD001',
        title: 'Lãi suất cực thấp',
        description: 'Lãi suất thấp nhất thị trường, duyệt nhanh 15 phút',
        icon: '🏢',
        interestRate: '1.2%/tháng',
        maxAmount: '500 triệu VND',
        duration: '6-36 tháng',
        buttonText: 'Đăng ký ngay',
        link: '/goi-vay/chi-tiet/VKD001',
        features: [
          {
            icon: '⚡',
            title: 'Duyệt nhanh',
            description: 'Chỉ 15 phút duyệt hồ sơ'
          },
          {
            icon: '💰',
            title: 'Hạn mức cao',
            description: 'Lên đến 500 triệu VND'
          }
        ]
      },
      {
        id: 'VCN002',
        title: 'Vay nhanh trực tuyến',
        description: 'Giải ngân trong ngày, thủ tục đơn giản online',
        icon: '👤',
        interestRate: '1.5%/tháng',
        maxAmount: '200 triệu VND',
        duration: '3-24 tháng',
        buttonText: 'Đăng ký ngay',
        link: '/goi-vay/chi-tiet/VCN002',
        features: [
          {
            icon: '💻',
            title: 'Hoàn toàn online',
            description: 'Không cần đến văn phòng'
          },
          {
            icon: '🚀',
            title: 'Giải ngân nhanh',
            description: 'Nhận tiền trong ngày'
          }
        ]
      },
      {
        id: 'VTC003',
        title: 'Vay thế chấp tài sản',
        description: 'Lãi suất ưu đãi với tài sản thế chấp',
        icon: '🏠',
        interestRate: '0.9%/tháng',
        maxAmount: '2 tỷ VND',
        duration: '12-120 tháng',
        buttonText: 'Đăng ký ngay',
        link: '/goi-vay/chi-tiet/VTC003',
        features: [
          {
            icon: '📉',
            title: 'Lãi suất thấp',
            description: 'Chỉ từ 0.9%/tháng'
          },
          {
            icon: '💎',
            title: 'Hạn mức lớn',
            description: 'Lên đến 2 tỷ VND'
          }
        ]
      }
    ];
  }
}
