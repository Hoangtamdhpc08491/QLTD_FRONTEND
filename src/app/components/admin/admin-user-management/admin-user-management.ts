import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface User {
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
  trangThai: string;
  ngayDangKy: Date;
  lanDangNhapCuoi?: Date;
  soLanVay: number;
  tongTienDaVay: number;
  danhGiaTinDung: string;
}

@Component({
  selector: 'app-admin-user-management',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-user-management.html',
  styleUrl: './admin-user-management.css'
})
export class AdminUserManagement implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  
  // Filters
  searchTerm = '';
  statusFilter = '';
  creditRatingFilter = '';
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 0;

  // Modal
  showUserModal = false;
  selectedUser: User | null = null;
  modalMode: 'view' | 'edit' | 'create' = 'view';

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadUsers();
  }

  private loadUsers() {
    // Mock data - thực tế sẽ gọi API
    this.users = [
      {
        id: 'USER001',
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
        trangThai: 'Hoạt động',
        ngayDangKy: new Date('2024-01-15'),
        lanDangNhapCuoi: new Date('2025-01-20'),
        soLanVay: 2,
        tongTienDaVay: 80000000,
        danhGiaTinDung: 'Tốt'
      },
      {
        id: 'USER002',
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
        trangThai: 'Hoạt động',
        ngayDangKy: new Date('2023-12-10'),
        lanDangNhapCuoi: new Date('2025-01-19'),
        soLanVay: 4,
        tongTienDaVay: 250000000,
        danhGiaTinDung: 'Xuất sắc'
      },
      {
        id: 'USER003',
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
        trangThai: 'Hoạt động',
        ngayDangKy: new Date('2024-03-22'),
        lanDangNhapCuoi: new Date('2025-01-18'),
        soLanVay: 1,
        tongTienDaVay: 50000000,
        danhGiaTinDung: 'Tốt'
      },
      {
        id: 'USER004',
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
        trangThai: 'Tạm khóa',
        ngayDangKy: new Date('2024-02-14'),
        lanDangNhapCuoi: new Date('2025-01-10'),
        soLanVay: 1,
        tongTienDaVay: 30000000,
        danhGiaTinDung: 'Trung bình'
      },
      {
        id: 'USER005',
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
        trangThai: 'Hoạt động',
        ngayDangKy: new Date('2023-11-05'),
        lanDangNhapCuoi: new Date('2025-01-16'),
        soLanVay: 3,
        tongTienDaVay: 180000000,
        danhGiaTinDung: 'Tốt'
      },
      {
        id: 'USER006',
        hoTen: 'Vũ Thị F',
        email: 'vuthif@email.com',
        soDienThoai: '0123789456',
        cmnd: '456789123012',
        diaChi: '987 Đường MNO, Quận 6, TP.HCM',
        ngaySinh: new Date('1995-07-12'),
        gioiTinh: 'Nữ',
        tinhTrangHonNhan: 'Độc thân',
        ngheNghiep: 'Marketing',
        thuNhapHangThang: 18000000,
        trangThai: 'Hoạt động',
        ngayDangKy: new Date('2024-06-18'),
        lanDangNhapCuoi: new Date('2025-01-21'),
        soLanVay: 0,
        tongTienDaVay: 0,
        danhGiaTinDung: 'Mới'
      }
    ];

    this.applyFilters();
  }

  applyFilters() {
    this.filteredUsers = this.users.filter(user => {
      const matchesSearch = !this.searchTerm || 
        user.hoTen.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.id.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.soDienThoai.includes(this.searchTerm);
      
      const matchesStatus = !this.statusFilter || user.trangThai === this.statusFilter;
      const matchesCreditRating = !this.creditRatingFilter || user.danhGiaTinDung === this.creditRatingFilter;
      
      return matchesSearch && matchesStatus && matchesCreditRating;
    });

    this.totalPages = Math.ceil(this.filteredUsers.length / this.itemsPerPage);
    this.currentPage = 1;
  }

  getPaginatedUsers(): User[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredUsers.slice(startIndex, endIndex);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  viewUser(user: User) {
    this.selectedUser = { ...user };
    this.modalMode = 'view';
    this.showUserModal = true;
  }

  editUser(user: User) {
    this.selectedUser = { ...user };
    this.modalMode = 'edit';
    this.showUserModal = true;
  }

  createUser() {
    this.selectedUser = {
      id: '',
      hoTen: '',
      email: '',
      soDienThoai: '',
      cmnd: '',
      diaChi: '',
      ngaySinh: new Date(),
      gioiTinh: '',
      tinhTrangHonNhan: '',
      ngheNghiep: '',
      thuNhapHangThang: 0,
      trangThai: 'Hoạt động',
      ngayDangKy: new Date(),
      soLanVay: 0,
      tongTienDaVay: 0,
      danhGiaTinDung: 'Mới'
    };
    this.modalMode = 'create';
    this.showUserModal = true;
  }

  saveUser() {
    if (this.selectedUser) {
      if (this.modalMode === 'create') {
        this.selectedUser.id = 'USER' + String(this.users.length + 1).padStart(3, '0');
        this.users.push({ ...this.selectedUser });
      } else if (this.modalMode === 'edit') {
        const index = this.users.findIndex(u => u.id === this.selectedUser!.id);
        if (index !== -1) {
          this.users[index] = { ...this.selectedUser };
        }
      }
      this.applyFilters();
      this.closeModal();
    }
  }

  toggleUserStatus(user: User) {
    user.trangThai = user.trangThai === 'Hoạt động' ? 'Tạm khóa' : 'Hoạt động';
    console.log(`User ${user.id} status changed to: ${user.trangThai}`);
  }

  deleteUser(user: User) {
    if (confirm(`Bạn có chắc chắn muốn xóa người dùng ${user.hoTen}?`)) {
      const index = this.users.findIndex(u => u.id === user.id);
      if (index !== -1) {
        this.users.splice(index, 1);
        this.applyFilters();
      }
    }
  }

  closeModal() {
    this.showUserModal = false;
    this.selectedUser = null;
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Hoạt động': return 'status-active';
      case 'Tạm khóa': return 'status-locked';
      default: return '';
    }
  }

  getCreditRatingClass(rating: string): string {
    switch (rating) {
      case 'Xuất sắc': return 'credit-excellent';
      case 'Tốt': return 'credit-good';
      case 'Trung bình': return 'credit-average';
      case 'Mới': return 'credit-new';
      default: return '';
    }
  }

  exportToExcel() {
    console.log('Export users to Excel functionality');
    // Thực tế sẽ implement export Excel
  }

  viewUserApplications(userId: string) {
    this.router.navigate(['/admin/loan-applications'], { queryParams: { userId } });
  }

  updateBirthDate(event: Event) {
    if (this.selectedUser) {
      const target = event.target as HTMLInputElement;
      this.selectedUser.ngaySinh = new Date(target.value);
    }
  }
}
