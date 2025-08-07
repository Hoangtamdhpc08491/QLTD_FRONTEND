import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Footer } from '../../shared/footer/footer';
import { Header } from '../../shared/header/header';
import { LoanContractService, LoanContract } from '../../../services/loan-contract.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-loan-contracts',
  imports: [CommonModule, RouterModule, FormsModule, Footer, Header],
  templateUrl: './loan-contracts.html',
  styleUrl: './loan-contracts.css'
})
export class LoanContracts implements OnInit {
  contracts: LoanContract[] = [];
  filteredContracts: LoanContract[] = [];
  
  // Inject services
  private router = inject(Router);
  private loanContractService = inject(LoanContractService);
  private authService = inject(AuthService);

  // Loading states
  isLoading = false;
  error: string | null = null;

  // Filter options
  selectedStatus = 'all';
  searchTerm = '';
  sortBy = 'createdAt';
  sortOrder = 'desc';

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;
  totalCount = 0;
  Math = Math;

  statusOptions = [
    { value: 'all', label: 'Tất cả' },
    { value: 'pending', label: 'Chờ duyệt' },
    { value: 'approved', label: 'Đã duyệt' },
    { value: 'rejected', label: 'Từ chối' }
  ];

  sortOptions = [
    { value: 'createdAt', label: 'Ngày tạo' },
    { value: 'loanAmount', label: 'Số tiền vay' },
    { value: 'status', label: 'Trạng thái' }
  ];

  ngOnInit() {
    this.checkAuthentication();
    this.loadLoanContracts();
  }

  private checkAuthentication() {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.router.navigate(['/login']);
      return;
    }
  }

  loadLoanContracts() {
    this.isLoading = true;
    this.error = null;

    const params = {
      page: this.currentPage,
      limit: this.itemsPerPage,
      status: this.selectedStatus !== 'all' ? this.selectedStatus : undefined,
      search: this.searchTerm || undefined,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder
    };

    this.loanContractService.getUserLoanContracts(params).subscribe({
      next: (response) => {
        if (response.success) {
          this.contracts = response.data;
          this.filteredContracts = response.data;
          this.totalCount = response.pagination?.totalCount || 0;
          this.totalPages = response.pagination?.totalPages || 1;
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading loan contracts:', error);
        this.error = error.error?.message || 'Có lỗi xảy ra khi tải danh sách hợp đồng';
        this.isLoading = false;
      }
    });
  }

  onFilterChange() {
    this.currentPage = 1;
    this.loadLoanContracts();
  }

  onSearchChange() {
    // Debounce search
    setTimeout(() => {
      this.currentPage = 1;
      this.loadLoanContracts();
    }, 300);
  }

  onSortChange() {
    this.loadLoanContracts();
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadLoanContracts();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  viewContract(contract: LoanContract) {
    this.router.navigate(['/hop-dong-vay', contract.id]);
  }

  editContract(contract: LoanContract) {
    if (contract.status === 'pending') {
      this.router.navigate(['/sua-don-vay', contract.id]);
    }
  }

  deleteContract(contract: LoanContract) {
    if (contract.status === 'pending') {
      if (confirm('Bạn có chắc chắn muốn xóa đơn vay này?')) {
        this.loanContractService.deleteUserLoanContract(contract.id).subscribe({
          next: (response) => {
            if (response.success) {
              this.loadLoanContracts();
            }
          },
          error: (error) => {
            console.error('Error deleting contract:', error);
            this.error = error.error?.message || 'Có lỗi xảy ra khi xóa đơn vay';
          }
        });
      }
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'pending': return 'Chờ duyệt';
      case 'approved': return 'Đã duyệt';
      case 'rejected': return 'Từ chối';
      default: return status;
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'approved': return 'status-approved';
      case 'rejected': return 'status-rejected';
      default: return '';
    }
  }

  formatCurrency(amount: number): string {
    return this.loanContractService.formatCurrency(amount);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  }

  canEdit(contract: LoanContract): boolean {
    return contract.status === 'pending';
  }

  canDelete(contract: LoanContract): boolean {
    return contract.status === 'pending';
  }

  getPaginationPages(): number[] {
    const pages = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }
}
