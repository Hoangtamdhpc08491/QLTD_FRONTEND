import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface DashboardStats {
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  totalLoanAmount: number;
}

interface RecentApplication {
  id: string;
  hoTen: string;
  email: string;
  soTienVay: number;
  trangThai: string;
  ngayNop: Date;
  goiVay: string;
}

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard implements OnInit {
  stats: DashboardStats = {
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0,
    totalLoanAmount: 0
  };

  recentApplications: RecentApplication[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  private loadDashboardData() {
    // Mock data for dashboard
    this.stats = {
      totalApplications: 156,
      pendingApplications: 23,
      approvedApplications: 98,
      rejectedApplications: 35,
      totalLoanAmount: 15600000000 // 15.6 tỷ VND
    };

    this.recentApplications = [
      {
        id: 'APP001',
        hoTen: 'Nguyễn Văn A',
        email: 'nguyenvana@email.com',
        soTienVay: 50000000,
        trangThai: 'Chờ duyệt',
        ngayNop: new Date('2025-01-20'),
        goiVay: 'Vay tiêu dùng'
      },
      {
        id: 'APP002',
        hoTen: 'Trần Thị B',
        email: 'tranthib@email.com',
        soTienVay: 100000000,
        trangThai: 'Đã duyệt',
        ngayNop: new Date('2025-01-19'),
        goiVay: 'Vay kinh doanh'
      },
      {
        id: 'APP003',
        hoTen: 'Lê Văn C',
        email: 'levanc@email.com',
        soTienVay: 30000000,
        trangThai: 'Chờ duyệt',
        ngayNop: new Date('2025-01-18'),
        goiVay: 'Vay mua nhà'
      },
      {
        id: 'APP004',
        hoTen: 'Phạm Thị D',
        email: 'phamthid@email.com',
        soTienVay: 75000000,
        trangThai: 'Từ chối',
        ngayNop: new Date('2025-01-17'),
        goiVay: 'Vay xe máy'
      },
      {
        id: 'APP005',
        hoTen: 'Hoàng Văn E',
        email: 'hoangvane@email.com',
        soTienVay: 200000000,
        trangThai: 'Đã duyệt',
        ngayNop: new Date('2025-01-16'),
        goiVay: 'Vay kinh doanh'
      }
    ];
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Chờ duyệt': return 'status-pending';
      case 'Đã duyệt': return 'status-approved';
      case 'Từ chối': return 'status-rejected';
      default: return '';
    }
  }

  viewAllApplications() {
    this.router.navigate(['/admin/loan-applications']);
  }

  viewApplication(id: string) {
    this.router.navigate(['/admin/loan-applications', id]);
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
