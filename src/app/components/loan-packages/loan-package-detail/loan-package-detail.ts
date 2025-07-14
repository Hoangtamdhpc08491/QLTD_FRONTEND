import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Footer } from '../../shared/footer/footer';
import { Header } from '../../shared/header/header';

interface LoanPackage {
  maGoiVay: string;
  tenGoiVay: string;
  moTa1: string;
  moTa2: string;
  laiSuat: number;
  hanMuc: number;
  thoiHan: string;
  dieuKien: string;
  image: string;
  icon: string;
  trangThai: boolean;
  ngayTao: Date;
  yeuCauHoSo: string[];
  uuDiem: string[];
  quyTrinh: {
    buoc: number;
    tieuDe: string;
    moTa: string;
    icon: string;
  }[];
}

@Component({
  selector: 'app-loan-package-detail',
  imports: [CommonModule, RouterModule, Footer, Header],
  templateUrl: './loan-package-detail.html',
  styleUrl: './loan-package-detail.css'
})
export class LoanPackageDetail implements OnInit {
  loanPackage: LoanPackage | null = null;
  packageId: string = '';

  // Mock data
  private mockLoanPackages: LoanPackage[] = [
    {
      maGoiVay: 'VKD001',
      tenGoiVay: 'Vay Kinh Doanh Online',
      moTa1: 'Dành cho các doanh nghiệp nhỏ và vừa, thủ tục đơn giản, duyệt nhanh trong 24h',
      moTa2: 'Gói vay được thiết kế đặc biệt cho các doanh nghiệp muốn mở rộng kinh doanh, bổ sung vốn lưu động hoặc đầu tư trang thiết bị. Với quy trình đơn giản và tốc độ duyệt nhanh, chúng tôi cam kết mang đến giải pháp tài chính tối ưu cho doanh nghiệp của bạn.',
      laiSuat: 1.2,
      hanMuc: 500000000,
      thoiHan: '6-36 tháng',
      dieuKien: 'Doanh nghiệp hoạt động từ 6 tháng trở lên, có doanh thu ổn định',
      image: 'business-loan.jpg',
      icon: '🏢',
      trangThai: true,
      ngayTao: new Date('2024-01-15'),
      yeuCauHoSo: [
        'Giấy phép kinh doanh hợp lệ',
        'Báo cáo tài chính 6 tháng gần nhất',
        'Sao kê tài khoản ngân hàng 3 tháng',
        'CMND/CCCD người đại diện pháp luật',
        'Hợp đồng thuê mặt bằng (nếu có)'
      ],
      uuDiem: [
        'Lãi suất cạnh tranh từ 1.2%/tháng',
        'Hạn mức vay lên đến 500 triệu VNĐ',
        'Thời gian vay linh hoạt 6-36 tháng',
        'Duyệt hồ sơ nhanh chóng trong 24h',
        'Giải ngân ngay sau khi duyệt',
        'Không cần tài sản đảm bảo',
        'Tư vấn miễn phí 24/7'
      ],
      quyTrinh: [
        {
          buoc: 1,
          tieuDe: 'Đăng ký online',
          moTa: 'Điền form đăng ký trực tuyến với thông tin cơ bản',
          icon: '📝'
        },
        {
          buoc: 2,
          tieuDe: 'Nộp hồ sơ',
          moTa: 'Upload các giấy tờ cần thiết theo yêu cầu',
          icon: '📄'
        },
        {
          buoc: 3,
          tieuDe: 'Thẩm định',
          moTa: 'Chuyên viên thẩm định hồ sơ trong 24h',
          icon: '🔍'
        },
        {
          buoc: 4,
          tieuDe: 'Ký hợp đồng',
          moTa: 'Ký kết hợp đồng vay và hoàn tất thủ tục',
          icon: '✍️'
        },
        {
          buoc: 5,
          tieuDe: 'Giải ngân',
          moTa: 'Nhận tiền vay chuyển khoản vào tài khoản',
          icon: '💰'
        }
      ]
    },
    {
      maGoiVay: 'VCN002',
      tenGoiVay: 'Vay Cá Nhân Tiêu Dùng',
      moTa1: 'Giải pháp tài chính linh hoạt cho mọi nhu cầu cá nhân, lãi suất ưu đãi',
      moTa2: 'Phù hợp cho việc mua sắm, du lịch, giáo dục, y tế và các nhu cầu tiêu dùng khác của cá nhân và gia đình. Quy trình đơn giản, không cần tài sản đảm bảo.',
      laiSuat: 1.5,
      hanMuc: 200000000,
      thoiHan: '3-24 tháng',
      dieuKien: 'Có thu nhập ổn định từ 8 triệu/tháng, độ tuổi từ 22-60',
      image: 'personal-loan.jpg',
      icon: '👤',
      trangThai: true,
      ngayTao: new Date('2024-01-20'),
      yeuCauHoSo: [
        'CMND/CCCD hợp lệ',
        'Giấy xác nhận thu nhập',
        'Sao kê lương 3 tháng gần nhất',
        'Hợp đồng lao động',
        'Hóa đơn điện/nước tại địa chỉ cư trú'
      ],
      uuDiem: [
        'Lãi suất ưu đãi từ 1.5%/tháng',
        'Hạn mức vay lên đến 200 triệu VNĐ',
        'Không cần tài sản đảm bảo',
        'Thủ tục đơn giản, nhanh gọn',
        'Giải ngân trong ngày',
        'Trả góp linh hoạt',
        'Hỗ trợ tư vấn 24/7'
      ],
      quyTrinh: [
        {
          buoc: 1,
          tieuDe: 'Đăng ký',
          moTa: 'Điền thông tin cá nhân và nhu cầu vay',
          icon: '📱'
        },
        {
          buoc: 2,
          tieuDe: 'Xác minh',
          moTa: 'Xác minh thông tin qua điện thoại',
          icon: '📞'
        },
        {
          buoc: 3,
          tieuDe: 'Duyệt hồ sơ',
          moTa: 'Hệ thống tự động duyệt trong 30 phút',
          icon: '⚡'
        },
        {
          buoc: 4,
          tieuDe: 'Ký điện tử',
          moTa: 'Ký hợp đồng bằng chữ ký điện tử',
          icon: '🖊️'
        },
        {
          buoc: 5,
          tieuDe: 'Nhận tiền',
          moTa: 'Tiền vay được chuyển vào tài khoản ngay',
          icon: '🏦'
        }
      ]
    }
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.packageId = params['id'];
      this.loadLoanPackage();
    });
  }

  private loadLoanPackage() {
    this.loanPackage = this.mockLoanPackages.find(
      pkg => pkg.maGoiVay === this.packageId
    ) || null;
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
}
