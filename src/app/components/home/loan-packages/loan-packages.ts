import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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
export class LoanPackages {
  loanPackages: LoanPackage[] = [
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
