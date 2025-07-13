import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoanCalculator } from '../loan-calculator/loan-calculator';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-about-section',
  imports: [CommonModule, LoanCalculator],
  templateUrl: './about-section.html',
  styleUrl: './about-section.css'
})
export class AboutSection {
  subtitle = 'Giới thiệu công ty';
  title = 'Vì Tương Lai Tươi Đẹp Của Bạn';
  description = 'Phát triển tương lai thịnh vượng và hiện thực hóa nhiều ước mơ của khách hàng. Hỗ trợ tài chính tiêu dùng, phục vụ đời sống, chăm sóc chất lượng sống hoặc mua xe ô tô.';

  features: Feature[] = [
    {
      icon: 'flaticon flaticon-property-1',
      title: 'Giải thưởng',
      description: 'Giành được hơn 10 giải thưởng cho các hạng mục tài chính'
    },
    {
      icon: 'flaticon flaticon-growth-1',
      title: 'Công ty được chứng nhận',
      description: 'Công ty tài chính được chấp thuận để cung cấp các khoản vay'
    }
  ];
}
