import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Footer } from '../../shared/footer/footer';
import { Header } from '../../shared/header/header';
import { LoanContractService, CreateLoanContractRequest, LoanCalculationRequest, LoanCalculationResponse } from '../../../services/loan-contract.service';
import { LoanPackageService, LoanPackage } from '../../../services/loan-package.service';
import { AuthService } from '../../../services/auth.service';

interface LoanApplicationData {
  name: string;
  email: string;
  phone: string;
  address: string;
  birthDay: string;
  gender: string;
  maritalStatus: string;
  job: string;
  salary: number;
  loanPackageId: number;
  loanAmount: number;
  loanTerm: number;
  note?: string;
}

@Component({
  selector: 'app-loan-application',
  imports: [CommonModule, RouterModule, FormsModule, Footer, Header],
  templateUrl: './loan-application.html',
  styleUrl: './loan-application.css'
})
export class LoanApplication implements OnInit {
  currentStep = 1;
  totalSteps = 4;
  selectedPackage: LoanPackage | null = null;
  loanCalculation: LoanCalculationResponse['data'] | null = null;
  
  // Inject services
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private loanContractService = inject(LoanContractService);
  private loanPackageService = inject(LoanPackageService);
  private authService = inject(AuthService);

  // Loading states
  isLoading = false;
  isCalculating = false;
  isSubmitting = false;
  error: string | null = null;

  application: LoanApplicationData = {
    name: '',
    email: '',
    phone: '',
    address: '',
    birthDay: '',
    gender: 'Nam',
    maritalStatus: 'Độc thân',
    job: '',
    salary: 0,
    loanPackageId: 0,
    loanAmount: 0,
    loanTerm: 6,
    note: ''
  };

  // Loan term options
  loanTermOptions = [
    { value: 6, label: '6 tháng' },
    { value: 12, label: '12 tháng' },
    { value: 18, label: '18 tháng' },
    { value: 24, label: '24 tháng' },
    { value: 30, label: '30 tháng' },
    { value: 36, label: '36 tháng' }
  ];

  genderOptions = [
    { value: 'Nam', label: 'Nam' },
    { value: 'Nữ', label: 'Nữ' },
    { value: 'Khác', label: 'Khác' }
  ];

  maritalOptions = [
    { value: 'Độc thân', label: 'Độc thân' },
    { value: 'Kết hôn', label: 'Kết hôn' },
    { value: 'Ly hôn', label: 'Ly hôn' },
    { value: 'Góa', label: 'Góa' }
  ];

  ngOnInit() {
    this.loadLoanPackageFromRoute();
    this.loadUserInfo();
  }

  private loadLoanPackageFromRoute() {
    const packageId = this.route.snapshot.paramMap.get('packageId');
    console.log('Package ID from route:', packageId);
    if (packageId) {
      this.loadLoanPackage(parseInt(packageId));
    } else {
      console.log('No package ID found in route');
    }
  }

  private loadLoanPackage(id: number) {
    console.log('Loading loan package with ID:', id);
    this.isLoading = true;
    this.loanPackageService.getLoanPackageById(id).subscribe({
      next: (response) => {
        console.log('Loan package response:', response);
        if (response.success) {
          this.selectedPackage = response.data;
          this.application.loanPackageId = response.data.id;
          console.log('Selected package:', this.selectedPackage);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading loan package:', error);
        this.error = 'Không thể tải thông tin gói vay';
        this.isLoading = false;
      }
    });
  }

  private loadUserInfo() {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.application.name = currentUser.name;
      this.application.email = currentUser.email;
      this.application.phone = currentUser.phone;
    }
  }

  nextStep() {
    if (this.currentStep < this.totalSteps && this.canProceedToNextStep()) {
      this.currentStep++;
      
      // Tính toán khi đến step 3 (xem trước)
      if (this.currentStep === 3) {
        this.calculateLoanInfo();
      }
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  goToStep(step: number) {
    if (step >= 1 && step <= this.totalSteps) {
      this.currentStep = step;
    }
  }

  canProceedToNextStep(): boolean {
    switch (this.currentStep) {
      case 1:
        return !!(this.selectedPackage);
      case 2:
        return !!(this.application.name && this.application.email &&
                 this.application.phone && this.application.address &&
                 this.application.job && this.application.salary > 0);
      case 3:
        return !!(this.application.loanAmount > 0 && this.application.loanTerm > 0);
      default:
        return true;
    }
  }

  calculateLoanInfo() {
    if (!this.application.loanPackageId || !this.application.loanAmount || !this.application.loanTerm) {
      return;
    }

    this.isCalculating = true;
    const calculationData: LoanCalculationRequest = {
      loanPackageId: this.application.loanPackageId,
      loanAmount: this.application.loanAmount,
      loanTerm: this.application.loanTerm
    };

    this.loanContractService.calculateLoanInfo(calculationData).subscribe({
      next: (response) => {
        if (response.success) {
          this.loanCalculation = response.data;
        }
        this.isCalculating = false;
      },
      error: (error) => {
        console.error('Error calculating loan info:', error);
        this.error = 'Không thể tính toán thông tin vay';
        this.isCalculating = false;
      }
    });
  }

  onLoanAmountChange() {
    if (this.application.loanAmount && this.application.loanTerm) {
      this.calculateLoanInfo();
    }
  }

  onLoanTermChange() {
    if (this.application.loanAmount && this.application.loanTerm) {
      this.calculateLoanInfo();
    }
  }

  submitApplication() {
    if (!this.canSubmit()) {
      return;
    }

    this.isSubmitting = true;
    this.error = null;

    const contractData: CreateLoanContractRequest = {
      name: this.application.name,
      email: this.application.email,
      phone: this.application.phone,
      address: this.application.address,
      salary: this.application.salary,
      maritalStatus: this.application.maritalStatus,
      job: this.application.job,
      birthDay: this.application.birthDay,
      gender: this.application.gender,
      loanPackageId: this.application.loanPackageId,
      loanTerm: this.application.loanTerm,
      loanAmount: this.application.loanAmount
    };

    this.loanContractService.createLoanContract(contractData).subscribe({
      next: (response) => {
        if (response.success) {
          // Chuyển đến trang thành công
          this.router.navigate(['/hop-dong-vay'], { 
            queryParams: { tab: 'loan-contracts', message: 'Đơn vay đã được gửi thành công!' }
          });
        }
        this.isSubmitting = false;
      },
      error: (error) => {
        console.error('Error submitting application:', error);
        this.error = error.error?.message || 'Có lỗi xảy ra khi gửi đơn vay';
        this.isSubmitting = false;
      }
    });
  }

  canSubmit(): boolean {
    return this.canProceedToNextStep() && 
           !!this.loanCalculation && 
           !this.isSubmitting;
  }

  formatCurrency(amount: number): string {
    return this.loanContractService.formatCurrency(amount);
  }

  getProgressPercentage(): number {
    return (this.currentStep / this.totalSteps) * 100;
  }

  isStepCompleted(step: number): boolean {
    return this.currentStep > step;
  }

  isCurrentStep(step: number): boolean {
    return this.currentStep === step;
  }

  // Validation methods
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  isValidPhone(phone: string): boolean {
    const phoneRegex = /^[0-9]{10,11}$/;
    return phoneRegex.test(phone);
  }

  getStepTitle(step: number): string {
    switch (step) {
      case 1: return 'Chọn gói vay';
      case 2: return 'Thông tin cá nhân';
      case 3: return 'Thông tin vay';
      case 4: return 'Xác nhận';
      default: return '';
    }
  }
}
