import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Footer } from '../../shared/footer/footer';
import { Header } from '../../shared/header/header';
import { LoanContractService, LoanContract } from '../../../services/loan-contract.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-loan-contract-detail',
  imports: [CommonModule, RouterModule, Footer, Header],
  templateUrl: './loan-contract-detail.html',
  styleUrl: './loan-contract-detail.css'
})
export class LoanContractDetail implements OnInit {
  contract: LoanContract | null = null;
  
  // Inject services
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private loanContractService = inject(LoanContractService);
  private authService = inject(AuthService);

  // Loading states
  isLoading = false;
  error: string | null = null;

  ngOnInit() {
    this.checkAuthentication();
    this.loadContractDetail();
  }

  private checkAuthentication() {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.router.navigate(['/login']);
      return;
    }
  }

  private loadContractDetail() {
    const contractId = this.route.snapshot.paramMap.get('id');
    if (!contractId) {
      this.router.navigate(['/hop-dong-vay']);
      return;
    }

    this.isLoading = true;
    this.error = null;

    this.loanContractService.getUserLoanContractById(parseInt(contractId)).subscribe({
      next: (response) => {
        if (response.success) {
          this.contract = response.data;
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading contract detail:', error);
        this.error = error.error?.message || 'Có lỗi xảy ra khi tải chi tiết hợp đồng';
        this.isLoading = false;
      }
    });
  }

  goBack() {
    this.router.navigate(['/hop-dong-vay']);
  }

  editContract() {
    if (this.contract && this.contract.status === 'pending') {
      this.router.navigate(['/sua-don-vay', this.contract.id]);
    }
  }

  deleteContract() {
    if (this.contract && this.contract.status === 'pending') {
      if (confirm('Bạn có chắc chắn muốn xóa đơn vay này?')) {
        this.loanContractService.deleteUserLoanContract(this.contract.id).subscribe({
          next: (response) => {
            if (response.success) {
              this.router.navigate(['/hop-dong-vay']);
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
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  canEdit(): boolean {
    return this.contract?.status === 'pending';
  }

  canDelete(): boolean {
    return this.contract?.status === 'pending';
  }
}
