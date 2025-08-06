import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Footer } from '../../shared/footer/footer';
import { Header } from '../../shared/header/header';
import { LoanPackageService, LoanPackage } from '../../../services/loan-package.service';

@Component({
  selector: 'app-loan-package-detail',
  imports: [CommonModule, RouterModule, Footer, Header],
  templateUrl: './loan-package-detail.html',
  styleUrl: './loan-package-detail.css'
})
export class LoanPackageDetail implements OnInit {
  loanPackage: LoanPackage | null = null;
  packageId: number = 0;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private loanPackageService: LoanPackageService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.packageId = +params['id'];
      if (this.packageId) {
        this.loadLoanPackage();
      }
    });
  }

  loadLoanPackage() {
    this.loading = true;
    this.error = null;

    this.loanPackageService.getLoanPackageById(this.packageId).subscribe({
      next: (response) => {
        if (response.success) {
          this.loanPackage = response.data;
        } else {
          this.error = response.message;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading loan package:', error);
        this.error = 'Không thể tải thông tin gói vay. Vui lòng thử lại sau.';
        this.loading = false;
      }
    });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  }

  getInterestRateText(rate: number): string {
    return `${rate}%/tháng`;
  }

  calculateMonthlyPayment(amount: number, rate: number, months: number): string {
    const monthlyRate = rate / 100;
    const payment = (amount * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                   (Math.pow(1 + monthlyRate, months) - 1);
    return this.formatCurrency(payment);
  }

  formatDate(date: string): string {
    return new Intl.DateTimeFormat('vi-VN').format(new Date(date));
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

  // Hàm để tạo status giả (có thể thêm field này vào backend sau)
  getPackageStatus(): boolean {
    return true; // Mặc định tất cả gói vay đều đang mở
  }

  // Tạo mock requirements vì backend chưa có field này
  getMockRequirements(): string[] {
    return [
      'CMND/CCCD hợp lệ',
      'Sổ hộ khẩu',
      'Giấy tờ chứng minh thu nhập',
      'Bảng sao kê ngân hàng 6 tháng gần nhất',
      'Hợp đồng lao động (nếu có)'
    ];
  }

  // Tạo mock advantages vì backend chưa có field này
  getMockAdvantages(): string[] {
    return [
      'Thủ tục đơn giản, nhanh chóng',
      'Lãi suất cạnh tranh',
      'Không cần tài sản đảm bảo',
      'Giải ngân nhanh trong 24h',
      'Hỗ trợ tư vấn 24/7'
    ];
  }

  // Tạo mock process vì backend chưa có field này
  getMockProcess(): {buoc: number; tieuDe: string; moTa: string; icon: string}[] {
    return [
      {
        buoc: 1,
        tieuDe: 'Đăng ký online',
        moTa: 'Điền thông tin và upload hồ sơ trực tuyến',
        icon: '📝'
      },
      {
        buoc: 2,
        tieuDe: 'Thẩm định hồ sơ',
        moTa: 'Chúng tôi sẽ thẩm định và liên hệ xác nhận',
        icon: '🔍'
      },
      {
        buoc: 3,
        tieuDe: 'Phê duyệt',
        moTa: 'Nhận kết quả phê duyệt trong 24h',
        icon: '✅'
      },
      {
        buoc: 4,
        tieuDe: 'Giải ngân',
        moTa: 'Ký hợp đồng và nhận tiền ngay',
        icon: '💰'
      }
    ];
  }
}