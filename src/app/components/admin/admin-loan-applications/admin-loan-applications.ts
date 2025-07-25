import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface LoanApplication {
  id: string;
  hoTen: string;
  email: string;
  soDienThoai: string;
  cmnd: string;
  diaChi: string;
  ngaySinh: Date;
  gioiTinh: string;
  tinhTrangHonNhan: string;
  ngheNghiep: string;
  thuNhapHangThang: number;
  soTienVay: number;
  thoiHanVay: number;
  mucDichVay: string;
  ghiChu: string;
  goiVay: string;
  laiSuat: number;
  trangThai: string;
  ngayNop: Date;
  ngayDuyet?: Date;
  nguoiDuyet?: string;
  lyDoTuChoi?: string;
}

@Component({
  selector: 'app-admin-loan-applications',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-loan-applications.html',
  styleUrl: './admin-loan-applications.css'
})
export class AdminLoanApplications implements OnInit {
  applications: LoanApplication[] = [];
  filteredApplications: LoanApplication[] = [];
  
  // Filters
  searchTerm: string = '';
  statusFilter: string = '';
  dateFilter: string = '';
  
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 0;

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadApplications();
  }

  private loadApplications() {
    // Mock data - thực tế sẽ gọi API
    this.applications = [
      {
        id: 'APP001',
        hoTen: 'Nguyễn Văn A',
        email: 'nguyenvana@email.com',
        soDienThoai: '0123456789',
        cmnd: '123456789012',
        diaChi: '123 Đường ABC, Quận 1, TP.HCM',
        ngaySinh: new Date('1990-05-15'),
        gioiTinh: 'Nam',
        tinhTrangHonNhan: 'Độc thân',
        ngheNghiep: 'Nhân viên văn phòng',
        thuNhapHangThang: 15000000,
        soTienVay: 50000000,
        thoiHanVay: 12,
        mucDichVay: 'Mua xe máy',
        ghiChu: 'Cần vay gấp để mua xe đi làm',
        goiVay: 'Vay tiêu dùng',
        laiSuat: 2.5,
        trangThai: 'Chờ duyệt',
        ngayNop: new Date('2025-01-20')
      },
      {
        id: 'APP002',
        hoTen: 'Trần Thị B',
        email: 'tranthib@email.com',
        soDienThoai: '0987654321',
        cmnd: '987654321098',
        diaChi: '456 Đường XYZ, Quận 2, TP.HCM',
        ngaySinh: new Date('1985-08-22'),
        gioiTinh: 'Nữ',
        tinhTrangHonNhan: 'Đã kết hôn',
        ngheNghiep: 'Kinh doanh',
        thuNhapHangThang: 25000000,
        soTienVay: 100000000,
        thoiHanVay: 24,
        mucDichVay: 'Mở rộng kinh doanh',
        ghiChu: 'Cần vốn để mở thêm chi nhánh',
        goiVay: 'Vay kinh doanh',
        laiSuat: 2.0,
        trangThai: 'Đã duyệt',
        ngayNop: new Date('2025-01-19'),
        ngayDuyet: new Date('2025-01-20'),
        nguoiDuyet: 'Admin01'
      },
      {
        id: 'APP003',
        hoTen: 'Lê Văn C',
        email: 'levanc@email.com',
        soDienThoai: '0369258147',
        cmnd: '147258369012',
        diaChi: '789 Đường DEF, Quận 3, TP.HCM',
        ngaySinh: new Date('1992-12-10'),
        gioiTinh: 'Nam',
        tinhTrangHonNhan: 'Độc thân',
        ngheNghiep: 'Kỹ sư',
        thuNhapHangThang: 20000000,
        soTienVay: 300000000,
        thoiHanVay: 36,
        mucDichVay: 'Mua nhà',
        ghiChu: 'Mua nhà để kết hôn',
        goiVay: 'Vay mua nhà',
        laiSuat: 1.8,
        trangThai: 'Chờ duyệt',
        ngayNop: new Date('2025-01-18')
      },
      {
        id: 'APP004',
        hoTen: 'Phạm Thị D',
        email: 'phamthid@email.com',
        soDienThoai: '0741852963',
        cmnd: '963852741012',
        diaChi: '321 Đường GHI, Quận 4, TP.HCM',
        ngaySinh: new Date('1988-03-25'),
        gioiTinh: 'Nữ',
        tinhTrangHonNhan: 'Đã kết hôn',
        ngheNghiep: 'Giáo viên',
        thuNhapHangThang: 12000000,
        soTienVay: 75000000,
        thoiHanVay: 18,
        mucDichVay: 'Sửa chữa nhà',
        ghiChu: 'Nhà cũ cần sửa chữa',
        goiVay: 'Vay tiêu dùng',
        laiSuat: 2.5,
        trangThai: 'Từ chối',
        ngayNop: new Date('2025-01-17'),
        ngayDuyet: new Date('2025-01-18'),
        nguoiDuyet: 'Admin02',
        lyDoTuChoi: 'Thu nhập không đủ điều kiện'
      },
      {
        id: 'APP005',
        hoTen: 'Hoàng Văn E',
        email: 'hoangvane@email.com',
        soDienThoai: '0852963741',
        cmnd: '741963852012',
        diaChi: '654 Đường JKL, Quận 5, TP.HCM',
        ngaySinh: new Date('1987-11-08'),
        gioiTinh: 'Nam',
        tinhTrangHonNhan: 'Đã kết hôn',
        ngheNghiep: 'Quản lý',
        thuNhapHangThang: 30000000,
        soTienVay: 200000000,
        thoiHanVay: 24,
        mucDichVay: 'Đầu tư kinh doanh',
        ghiChu: 'Mở công ty mới',
        goiVay: 'Vay kinh doanh',
        laiSuat: 2.0,
        trangThai: 'Đã duyệt',
        ngayNop: new Date('2025-01-16'),
        ngayDuyet: new Date('2025-01-17'),
        nguoiDuyet: 'Admin01'
      }
    ];

    this.applyFilters();
  }

  applyFilters() {
    this.filteredApplications = this.applications.filter(app => {
      const matchesSearch = !this.searchTerm || 
        app.hoTen.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        app.id.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = !this.statusFilter || app.trangThai === this.statusFilter;
      
      return matchesSearch && matchesStatus;
    });

    this.totalPages = Math.ceil(this.filteredApplications.length / this.itemsPerPage);
    this.currentPage = 1;
  }

  getPaginatedApplications(): LoanApplication[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredApplications.slice(startIndex, endIndex);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  viewApplication(id: string) {
    this.router.navigate(['/admin/loan-applications', id]);
  }

  approveApplication(app: LoanApplication) {
    app.trangThai = 'Đã duyệt';
    app.ngayDuyet = new Date();
    app.nguoiDuyet = 'Current Admin'; // Thực tế sẽ lấy từ user đang login
    console.log('Approved application:', app.id);
  }

  rejectApplication(app: LoanApplication, reason: string) {
    app.trangThai = 'Từ chối';
    app.ngayDuyet = new Date();
    app.nguoiDuyet = 'Current Admin';
    app.lyDoTuChoi = reason;
    console.log('Rejected application:', app.id, 'Reason:', reason);
  }

  showRejectModal(app: LoanApplication) {
    const reason = prompt('Nhập lý do từ chối:');
    if (reason) {
      this.rejectApplication(app, reason);
    }
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

  exportToExcel() {
    console.log('Export to Excel functionality');
    // Thực tế sẽ implement export Excel
  }
}
