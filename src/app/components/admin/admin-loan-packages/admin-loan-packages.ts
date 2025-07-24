import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface LoanPackage {
  id: string;
  tenGoi: string;
  moTa: string;
  laiSuat: number;
  soTienToiThieu: number;
  soTienToiDa: number;
  thoiHanToiThieu: number;
  thoiHanToiDa: number;
  phiXuLy: number;
  dieuKien: string[];
  taiLieuCanThiet: string[];
  trangThai: string;
  ngayTao: Date;
  ngayCapNhat: Date;
  nguoiTao: string;
  luotDangKy: number;
  thuTuHienThi: number;
}

@Component({
  selector: 'app-admin-loan-packages',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-loan-packages.html',
  styleUrl: './admin-loan-packages.css'
})
export class AdminLoanPackages implements OnInit {
  packages: LoanPackage[] = [];
  filteredPackages: LoanPackage[] = [];
  
  // Modal states
  showModal: boolean = false;
  showDeleteModal: boolean = false;
  modalTitle: string = '';
  isEditMode: boolean = false;
  selectedPackage: LoanPackage | null = null;
  packageToDelete: LoanPackage | null = null;

  // Form data
  packageForm: Partial<LoanPackage> = {};
  
  // Filters
  searchTerm: string = '';
  statusFilter: string = '';
  
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 0;

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadPackages();
  }

  private loadPackages() {
    // Mock data - thực tế sẽ gọi API
    this.packages = [
      {
        id: 'PKG001',
        tenGoi: 'Vay Tiêu Dùng Cá Nhân',
        moTa: 'Gói vay dành cho nhu cầu tiêu dùng cá nhân với lãi suất ưu đãi',
        laiSuat: 2.5,
        soTienToiThieu: 5000000,
        soTienToiDa: 200000000,
        thoiHanToiThieu: 6,
        thoiHanToiDa: 60,
        phiXuLy: 500000,
        dieuKien: [
          'Tuổi từ 18-65',
          'Thu nhập tối thiểu 5 triệu/tháng',
          'Có tài khoản ngân hàng',
          'Cư trú tại TP.HCM'
        ],
        taiLieuCanThiet: [
          'CMND/CCCD',
          'Hộ khẩu',
          'Sao kê tài khoản 3 tháng gần nhất',
          'Giấy xác nhận thu nhập'
        ],
        trangThai: 'Hoạt động',
        ngayTao: new Date('2024-01-15'),
        ngayCapNhat: new Date('2025-01-20'),
        nguoiTao: 'Admin01',
        luotDangKy: 156,
        thuTuHienThi: 1
      },
      {
        id: 'PKG002',
        tenGoi: 'Vay Mua Nhà',
        moTa: 'Gói vay dành cho mua nhà với lãi suất thấp và thời hạn dài',
        laiSuat: 1.8,
        soTienToiThieu: 100000000,
        soTienToiDa: 2000000000,
        thoiHanToiThieu: 60,
        thoiHanToiDa: 300,
        phiXuLy: 2000000,
        dieuKien: [
          'Tuổi từ 21-60',
          'Thu nhập tối thiểu 15 triệu/tháng',
          'Có tài sản thế chấp',
          'Lịch sử tín dụng tốt'
        ],
        taiLieuCanThiet: [
          'CMND/CCCD',
          'Hộ khẩu',
          'Sao kê tài khoản 6 tháng gần nhất',
          'Hợp đồng mua bán nhà',
          'Giấy tờ tài sản thế chấp'
        ],
        trangThai: 'Hoạt động',
        ngayTao: new Date('2024-02-01'),
        ngayCapNhat: new Date('2025-01-18'),
        nguoiTao: 'Admin02',
        luotDangKy: 89,
        thuTuHienThi: 2
      },
      {
        id: 'PKG003',
        tenGoi: 'Vay Kinh Doanh SME',
        moTa: 'Gói vay dành cho doanh nghiệp vừa và nhỏ',
        laiSuat: 2.0,
        soTienToiThieu: 50000000,
        soTienToiDa: 1000000000,
        thoiHanToiThieu: 12,
        thoiHanToiDa: 84,
        phiXuLy: 1500000,
        dieuKien: [
          'Doanh nghiệp hoạt động tối thiểu 2 năm',
          'Doanh thu tối thiểu 1 tỷ/năm',
          'Có kế hoạch kinh doanh rõ ràng'
        ],
        taiLieuCanThiet: [
          'Giấy phép kinh doanh',
          'Báo cáo tài chính 2 năm gần nhất',
          'Hợp đồng kinh doanh',
          'Kế hoạch sử dụng vốn'
        ],
        trangThai: 'Hoạt động',
        ngayTao: new Date('2024-03-10'),
        ngayCapNhat: new Date('2025-01-15'),
        nguoiTao: 'Admin01',
        luotDangKy: 67,
        thuTuHienThi: 3
      },
      {
        id: 'PKG004',
        tenGoi: 'Vay Mua Xe',
        moTa: 'Gói vay dành cho mua xe ô tô, xe máy',
        laiSuat: 2.2,
        soTienToiThieu: 20000000,
        soTienToiDa: 500000000,
        thoiHanToiThieu: 12,
        thoiHanToiDa: 72,
        phiXuLy: 800000,
        dieuKien: [
          'Tuổi từ 18-65',
          'Thu nhập tối thiểu 8 triệu/tháng',
          'Có bằng lái xe phù hợp'
        ],
        taiLieuCanThiet: [
          'CMND/CCCD',
          'Bằng lái xe',
          'Sao kê tài khoản 3 tháng',
          'Hợp đồng mua xe'
        ],
        trangThai: 'Tạm dừng',
        ngayTao: new Date('2024-04-20'),
        ngayCapNhat: new Date('2025-01-10'),
        nguoiTao: 'Admin03',
        luotDangKy: 134,
        thuTuHienThi: 4
      },
      {
        id: 'PKG005',
        tenGoi: 'Vay Du Học',
        moTa: 'Gói vay dành cho chi phí du học nước ngoài',
        laiSuat: 1.5,
        soTienToiThieu: 100000000,
        soTienToiDa: 1500000000,
        thoiHanToiThieu: 24,
        thoiHanToiDa: 120,
        phiXuLy: 3000000,
        dieuKien: [
          'Tuổi từ 18-35',
          'Có thư mời từ trường học',
          'Người bảo lãnh có thu nhập ổn định'
        ],
        taiLieuCanThiet: [
          'Hộ chiếu',
          'Thư mời nhập học',
          'Bảng điểm',
          'Giấy tờ người bảo lãnh'
        ],
        trangThai: 'Hoạt động',
        ngayTao: new Date('2024-05-15'),
        ngayCapNhat: new Date('2025-01-12'),
        nguoiTao: 'Admin02',
        luotDangKy: 45,
        thuTuHienThi: 5
      }
    ];

    this.applyFilters();
  }

  applyFilters() {
    this.filteredPackages = this.packages.filter(pkg => {
      const matchesSearch = !this.searchTerm || 
        pkg.tenGoi.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        pkg.moTa.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        pkg.id.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = !this.statusFilter || pkg.trangThai === this.statusFilter;
      
      return matchesSearch && matchesStatus;
    });

    // Sort by display order
    this.filteredPackages.sort((a, b) => a.thuTuHienThi - b.thuTuHienThi);

    this.totalPages = Math.ceil(this.filteredPackages.length / this.itemsPerPage);
    this.currentPage = 1;
  }

  getPaginatedPackages(): LoanPackage[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredPackages.slice(startIndex, endIndex);
  }

  getMaxItemDisplay(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.filteredPackages.length);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // CRUD Operations
  openCreateModal() {
    this.isEditMode = false;
    this.modalTitle = 'Thêm Gói Vay Mới';
    this.packageForm = {
      trangThai: 'Hoạt động',
      dieuKien: [''],
      taiLieuCanThiet: [''],
      thuTuHienThi: this.packages.length + 1
    };
    this.showModal = true;
  }

  openEditModal(pkg: LoanPackage) {
    this.isEditMode = true;
    this.modalTitle = 'Chỉnh Sửa Gói Vay';
    this.selectedPackage = pkg;
    this.packageForm = {
      ...pkg,
      dieuKien: [...pkg.dieuKien],
      taiLieuCanThiet: [...pkg.taiLieuCanThiet]
    };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedPackage = null;
    this.packageForm = {};
  }

  savePackage() {
    if (this.isEditMode && this.selectedPackage) {
      // Update existing package
      const index = this.packages.findIndex(p => p.id === this.selectedPackage!.id);
      if (index !== -1) {
        this.packages[index] = {
          ...this.packages[index],
          ...this.packageForm as LoanPackage,
          ngayCapNhat: new Date()
        };
      }
    } else {
      // Create new package
      const newId = 'PKG' + String(this.packages.length + 1).padStart(3, '0');
      const newPackage: LoanPackage = {
        ...this.packageForm as LoanPackage,
        id: newId,
        ngayTao: new Date(),
        ngayCapNhat: new Date(),
        nguoiTao: 'Current Admin',
        luotDangKy: 0
      };
      this.packages.push(newPackage);
    }

    this.applyFilters();
    this.closeModal();
  }

  openDeleteModal(pkg: LoanPackage) {
    this.packageToDelete = pkg;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.packageToDelete = null;
  }

  confirmDelete() {
    if (this.packageToDelete) {
      this.packages = this.packages.filter(p => p.id !== this.packageToDelete!.id);
      this.applyFilters();
      this.closeDeleteModal();
    }
  }

  // Condition and Document management
  addCondition() {
    if (!this.packageForm.dieuKien) this.packageForm.dieuKien = [];
    this.packageForm.dieuKien.push('');
  }

  removeCondition(index: number) {
    if (this.packageForm.dieuKien) {
      this.packageForm.dieuKien.splice(index, 1);
    }
  }

  addDocument() {
    if (!this.packageForm.taiLieuCanThiet) this.packageForm.taiLieuCanThiet = [];
    this.packageForm.taiLieuCanThiet.push('');
  }

  removeDocument(index: number) {
    if (this.packageForm.taiLieuCanThiet) {
      this.packageForm.taiLieuCanThiet.splice(index, 1);
    }
  }

  trackByIndex(index: number): number {
    return index;
  }

  // Utility methods
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Hoạt động': return 'status-active';
      case 'Tạm dừng': return 'status-inactive';
      case 'Ngừng hoạt động': return 'status-disabled';
      default: return '';
    }
  }

  toggleStatus(pkg: LoanPackage) {
    if (pkg.trangThai === 'Hoạt động') {
      pkg.trangThai = 'Tạm dừng';
    } else if (pkg.trangThai === 'Tạm dừng') {
      pkg.trangThai = 'Hoạt động';
    }
    pkg.ngayCapNhat = new Date();
    this.applyFilters();
  }

  viewApplications(packageId: string) {
    this.router.navigate(['/admin/loan-applications'], { queryParams: { packageId } });
  }

  exportToExcel() {
    console.log('Export packages to Excel functionality');
    // Thực tế sẽ implement export Excel
  }
}
