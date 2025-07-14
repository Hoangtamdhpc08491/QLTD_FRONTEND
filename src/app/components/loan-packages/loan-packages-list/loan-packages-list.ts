import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
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
}

@Component({
  selector: 'app-loan-packages-list',
  imports: [CommonModule, RouterModule, Footer, Header],
  templateUrl: './loan-packages-list.html',
  styleUrl: './loan-packages-list.css'
})
export class LoanPackagesList {
  loanPackages: LoanPackage[] = [
    {
      maGoiVay: 'VKD001',
      tenGoiVay: 'Vay Kinh Doanh Online',
      moTa1: 'Dành cho các doanh nghiệp nhỏ và vừa, thủ tục đơn giản, duyệt nhanh trong 24h',
      moTa2: 'Gói vay được thiết kế đặc biệt cho các doanh nghiệp muốn mở rộng kinh doanh, bổ sung vốn lưu động hoặc đầu tư trang thiết bị.',
      laiSuat: 1.2,
      hanMuc: 500000000,
      thoiHan: '6-36 tháng',
      dieuKien: 'Doanh nghiệp hoạt động từ 6 tháng trở lên, có doanh thu ổn định',
      image: 'business-loan.jpg',
      icon: '🏢',
      trangThai: true,
      ngayTao: new Date('2024-01-15')
    },
    {
      maGoiVay: 'VCN002',
      tenGoiVay: 'Vay Cá Nhân Tiêu Dùng',
      moTa1: 'Giải pháp tài chính linh hoạt cho mọi nhu cầu cá nhân, lãi suất ưu đãi',
      moTa2: 'Phù hợp cho việc mua sắm, du lịch, giáo dục, y tế và các nhu cầu tiêu dùng khác của cá nhân và gia đình.',
      laiSuat: 1.5,
      hanMuc: 200000000,
      thoiHan: '3-24 tháng',
      dieuKien: 'Có thu nhập ổn định từ 8 triệu/tháng, độ tuổi từ 22-60',
      image: 'personal-loan.jpg',
      icon: '👤',
      trangThai: true,
      ngayTao: new Date('2024-01-20')
    },
    {
      maGoiVay: 'VTC003',
      tenGoiVay: 'Vay Thế Chấp Tài Sản',
      moTa1: 'Lãi suất thấp nhất với tài sản thế chấp, hạn mức lên đến 5 tỷ VNĐ',
      moTa2: 'Sử dụng bất động sản, xe ô tô làm tài sản thế chấp để được hỗ trợ hạn mức vay cao với lãi suất ưu đãi nhất.',
      laiSuat: 0.9,
      hanMuc: 5000000000,
      thoiHan: '12-120 tháng',
      dieuKien: 'Có tài sản thế chấp hợp lệ, giá trị tối thiểu 500 triệu',
      image: 'mortgage-loan.jpg',
      icon: '🏠',
      trangThai: true,
      ngayTao: new Date('2024-01-10')
    },
    {
      maGoiVay: 'VNH004',
      tenGoiVay: 'Vay Nhanh 15 Phút',
      moTa1: 'Giải ngân siêu tốc trong 15 phút, thủ tục tối giản chỉ cần CMND',
      moTa2: 'Dịch vụ vay nhanh dành cho những trường hợp cần tiền gấp, quy trình đơn giản, không cần nhiều giấy tờ.',
      laiSuat: 2.0,
      hanMuc: 50000000,
      thoiHan: '1-6 tháng',
      dieuKien: 'Có CMND/CCCD hợp lệ, độ tuổi từ 18-50',
      image: 'quick-loan.jpg',
      icon: '⚡',
      trangThai: true,
      ngayTao: new Date('2024-02-01')
    },
    {
      maGoiVay: 'VSV005',
      tenGoiVay: 'Vay Sinh Viên',
      moTa1: 'Hỗ trợ học phí và chi phí sinh hoạt cho sinh viên, lãi suất ưu đãi đặc biệt',
      moTa2: 'Gói vay dành riêng cho sinh viên đang theo học tại các trường đại học, cao đẳng với điều kiện và lãi suất ưu đãi.',
      laiSuat: 0.8,
      hanMuc: 100000000,
      thoiHan: '12-60 tháng',
      dieuKien: 'Đang là sinh viên chính quy, có người bảo lãnh',
      image: 'student-loan.jpg',
      icon: '🎓',
      trangThai: true,
      ngayTao: new Date('2024-02-15')
    },
    {
      maGoiVay: 'VOT006',
      tenGoiVay: 'Vay Online Toàn Diện',
      moTa1: 'Hoàn toàn trực tuyến từ đăng ký đến giải ngân, tiện lợi mọi lúc mọi nơi',
      moTa2: 'Quy trình 100% online, không cần đến văn phòng, hỗ trợ nhiều mục đích sử dụng khác nhau.',
      laiSuat: 1.8,
      hanMuc: 300000000,
      thoiHan: '6-48 tháng',
      dieuKien: 'Có tài khoản ngân hàng, xác thực eKYC thành công',
      image: 'online-loan.jpg',
      icon: '💻',
      trangThai: true,
      ngayTao: new Date('2024-03-01')
    }
  ];

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  }

  getInterestRateText(rate: number): string {
    return `${rate}%/tháng`;
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('vi-VN').format(date);
  }
}
