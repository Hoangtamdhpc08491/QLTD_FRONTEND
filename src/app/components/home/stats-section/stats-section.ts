import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Stat {
  icon: string;
  number: string;
  label: string;
}

@Component({
  selector: 'app-stats-section',
  imports: [CommonModule],
  templateUrl: './stats-section.html',
  styleUrl: './stats-section.css'
})
export class StatsSection {
  stats: Stat[] = [
    {
      icon: 'stat-icon-success',
      number: '99%',
      label: 'Tỷ lệ duyệt thành công'
    },
    {
      icon: 'stat-icon-amount',
      number: '$90K',
      label: 'Tổng số tiền đã giải ngân'
    },
    {
      icon: 'stat-icon-customers',
      number: '8,900',
      label: 'Khách hàng tin tưởng'
    },
    {
      icon: 'stat-icon-rating',
      number: '346',
      label: 'Đánh giá 5 sao'
    }
  ];
}
