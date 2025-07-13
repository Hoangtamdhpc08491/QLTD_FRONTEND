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
      id: 'business',
      title: 'Lãi xuất cực thấp',
      description: 'Lãi suất thấp nhất thị trường, duyệt nhanh 15 phút',
      icon: 'business-icon',
      interestRate: '1.2%/tháng',
      maxAmount: '500 triệu VND',
      duration: '1-12 tháng',
      buttonText: 'Xem chi tiết',
      link: '/khoản-vay-kinh-doanh',
      features: [
        {
          icon: 'speed-icon',
          title: 'Duyệt nhanh',
          description: 'Chỉ 15 phút duyệt hồ sơ'
        },
        {
          icon: 'money-icon',
          title: 'Hạn mức cao',
          description: 'Lên đến 500 triệu VND'
        }
      ]
    },
    {
      id: 'personal',
      title: 'Vay nhanh trực tuyến',
      description: 'Giải ngân trong ngày, thủ tục đơn giản online',
      icon: 'personal-icon',
      interestRate: '1.5%/tháng',
      maxAmount: '200 triệu VND',
      duration: '1-8 tháng',
      buttonText: 'Vay ngay',
      link: '/khoản-vay-cá-nhân',
      features: [
        {
          icon: 'online-icon',
          title: 'Hoàn toàn online',
          description: 'Không cần đến văn phòng'
        },
        {
          icon: 'fast-icon',
          title: 'Giải ngân nhanh',
          description: 'Nhận tiền trong ngày'
        }
      ]
    },
    {
      id: 'mortgage',
      title: 'Vay thế chấp tài sản',
      description: 'Lãi suất ưu đãi với tài sản thế chấp',
      icon: 'mortgage-icon',
      interestRate: '0.9%/tháng',
      maxAmount: '2 tỷ VND',
      duration: '6-36 tháng',
      buttonText: 'Tìm hiểu thêm',
      link: '/khoản-vay-thế-chấp',
      features: [
        {
          icon: 'low-rate-icon',
          title: 'Lãi suất thấp',
          description: 'Chỉ từ 0.9%/tháng'
        },
        {
          icon: 'high-amount-icon',
          title: 'Hạn mức lớn',
          description: 'Lên đến 2 tỷ VND'
        }
      ]
    }
  ];
}
