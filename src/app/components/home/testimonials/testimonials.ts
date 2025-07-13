import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Testimonial {
  id: string;
  name: string;
  title: string;
  text: string;
  rating: number;
  avatar: string;
}

@Component({
  selector: 'app-testimonials',
  imports: [CommonModule],
  templateUrl: './testimonials.html',
  styleUrl: './testimonials.css'
})
export class Testimonials {
  testimonials: Testimonial[] = [
    {
      id: '1',
      name: 'Nguyễn Văn A',
      title: 'Chủ doanh nghiệp',
      text: 'Dịch vụ vay vốn nhanh chóng, thủ tục đơn giản. Tôi đã nhận được khoản vay chỉ trong 2 giờ sau khi nộp hồ sơ. Rất hài lòng với dịch vụ.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: '2',
      name: 'Trần Thị B',
      title: 'Freelancer',
      text: 'Lãi suất hợp lý, nhân viên tư vấn nhiệt tình. Quy trình online rất tiện lợi, không cần đi lại nhiều lần. Tôi sẽ giới thiệu cho bạn bè.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: '3',
      name: 'Lê Văn C',
      title: 'Kinh doanh online',
      text: 'Đã vay nhiều lần và luôn hài lòng. Duyệt nhanh, giải ngân đúng hẹn. Đặc biệt là không có phí ẩn, minh bạch trong mọi giao dịch.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    }
  ];

  getStars(rating: number): number[] {
    return Array(rating).fill(0);
  }
}
