import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoanContractService, LoanContract, QueryParams } from '../../../services/loan-contract.service';

interface LoanApplicationView extends LoanContract {
  hoTen: string;
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
  applications: LoanContract[] = [];
  filteredApplications: LoanContract[] = [];
  
  // Filters
  searchTerm: string = '';
  statusFilter: string = '';
  dateFilter: string = '';
  
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 0;
  totalCount = 0;
  
  // Loading state
  isLoading = false;
  
  private loanContractService = inject(LoanContractService);
  private router = inject(Router);

  ngOnInit() {
    this.loadApplications();
  }

  private async loadApplications() {
    this.isLoading = true;
    try {
      const params: QueryParams = {
        page: this.currentPage,
        limit: this.itemsPerPage,
        status: this.statusFilter || undefined,
        search: this.searchTerm || undefined
      };

      const response = await this.loanContractService.getAllLoanContracts(params).toPromise();
      
      if (response?.success) {
        this.applications = response.data;
        this.filteredApplications = response.data;
        this.totalCount = response.pagination?.totalCount || 0;
        this.totalPages = response.pagination?.totalPages || 0;
        this.currentPage = response.pagination?.currentPage || 1;
      }
    } catch (error) {
      console.error('Lỗi khi tải danh sách đơn vay:', error);
      // Hiển thị thông báo lỗi cho user
    } finally {
      this.isLoading = false;
    }
  }

  applyFilters() {
    this.currentPage = 1;
    this.loadApplications();
  }

  getPaginatedApplications(): LoanContract[] {
    return this.filteredApplications;
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadApplications();
    }
  }

  viewApplication(id: number) {
    this.router.navigate(['/admin/loan-applications', id]);
  }

  async approveApplication(app: LoanContract) {
    try {
      const response = await this.loanContractService.updateLoanContractStatus(
        app.id, 
        'approved', 
        'Đơn vay đã được duyệt'
      ).toPromise();
      
      if (response?.success) {
        // Cập nhật trạng thái trong danh sách local
        app.status = 'approved';
        app.note = 'Đơn vay đã được duyệt';
        app.updatedAt = new Date().toISOString();
        console.log('Duyệt đơn vay thành công:', app.id);
        // Hiển thị thông báo thành công
      }
    } catch (error) {
      console.error('Lỗi khi duyệt đơn vay:', error);
      // Hiển thị thông báo lỗi
    }
  }

  async rejectApplication(app: LoanContract, reason: string) {
    try {
      const response = await this.loanContractService.updateLoanContractStatus(
        app.id, 
        'rejected', 
        reason
      ).toPromise();
      
      if (response?.success) {
        // Cập nhật trạng thái trong danh sách local
        app.status = 'rejected';
        app.note = reason;
        app.updatedAt = new Date().toISOString();
        console.log('Từ chối đơn vay thành công:', app.id, 'Lý do:', reason);
        // Hiển thị thông báo thành công
      }
    } catch (error) {
      console.error('Lỗi khi từ chối đơn vay:', error);
      // Hiển thị thông báo lỗi
    }
  }

  showRejectModal(app: LoanContract) {
    const reason = prompt('Nhập lý do từ chối:');
    if (reason) {
      this.rejectApplication(app, reason);
    }
  }

  formatCurrency(amount: number): string {
    return this.loanContractService.formatCurrency(amount);
  }

  getStatusClass(status: string): string {
    return this.loanContractService.getStatusClass(status);
  }

  getStatusText(status: string): string {
    return this.loanContractService.getStatusText(status);
  }

  formatDate(dateString: string): string {
    return this.loanContractService.formatDate(dateString);
  }

  exportToExcel() {
    console.log('Export to Excel functionality');
    // Thực tế sẽ implement export Excel
  }
}
