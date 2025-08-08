import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LoanContractService, LoanContract } from '../../../services/loan-contract.service';

interface PaymentScheduleItem {
  month: number;
  emiAmount: number;
  principalAmount: number;
  interestAmount: number;
  remainingBalance: number;
}

interface RiskAssessment {
  level: string;
  score: number;
  factors: string[];
  salaryToLoanRatio: number;
  emiToSalaryRatio: number;
}

interface EligibilityScore {
  score: number;
  level: string;
  factors: string[];
}

interface LoanContractDetails {
  contract: LoanContract;
  summary: {
    totalInterestPaid: number;
    totalAmountToPay: number;
    monthlyEMI: number;
    effectiveInterestRate: number;
    loanDuration: string;
    approvalDate?: string;
    applicationDate: string;
  };
  paymentSchedule: PaymentScheduleItem[];
  additionalInfo: {
    riskAssessment: RiskAssessment;
    eligibilityScore: EligibilityScore;
  };
}

@Component({
  selector: 'app-loan-contract-details',
  imports: [CommonModule],
  template: `
    <div class="loan-contract-details">
      <!-- Header -->
      <div class="page-header">
        <div class="header-left">
          <button class="btn btn-outline" (click)="goBack()">
            ← Quay lại
          </button>
          <div class="title-section">
            <h1>Chi tiết hợp đồng vay #{{contractId}}</h1>
            <div class="status-info" *ngIf="contractDetails">
              <span class="status-badge" [class]="getStatusClass(contractDetails.contract.status)">
                {{getStatusText(contractDetails.contract.status)}}
              </span>
              <span class="application-date">Ngày nộp: {{formatDate(contractDetails.contract.createdAt)}}</span>
            </div>
          </div>
        </div>
        <div class="header-actions" *ngIf="contractDetails">
          <button class="btn btn-primary" (click)="printContract()">
            🖨️ In hợp đồng
          </button>
          <ng-container *ngIf="contractDetails.contract.status === 'pending'">
            <button class="btn btn-success" (click)="approveContract()">
              ✅ Duyệt
            </button>
            <button class="btn btn-danger" (click)="rejectContract()">
              ❌ Từ chối
            </button>
          </ng-container>
        </div>
      </div>

      <!-- Loading State -->
      <div class="loading-state" *ngIf="isLoading">
        <div class="loading-spinner">⏳</div>
        <p>Đang tải chi tiết hợp đồng...</p>
      </div>

      <!-- Error State -->
      <div class="error-state" *ngIf="error && !isLoading">
        <div class="error-icon">❌</div>
        <h3>Không thể tải thông tin hợp đồng</h3>
        <p>{{error}}</p>
        <button class="btn btn-primary" (click)="loadContractDetails()">Thử lại</button>
      </div>

      <!-- Content -->
      <div class="contract-content" *ngIf="contractDetails && !isLoading">
        <!-- Overview Cards -->
        <div class="overview-cards">
          <div class="card summary-card">
            <h3>Tóm tắt khoản vay</h3>
            <div class="summary-grid">
              <div class="summary-item">
                <span>Số tiền vay</span>
                <strong class="amount">{{formatCurrency(contractDetails.contract.loanAmount)}}</strong>
              </div>
              <div class="summary-item">
                <span>Lãi suất</span>
                <strong class="rate">{{contractDetails.summary.effectiveInterestRate}}%/năm</strong>
              </div>
              <div class="summary-item">
                <span>Thời hạn</span>
                <strong>{{contractDetails.summary.loanDuration}}</strong>
              </div>
              <div class="summary-item">
                <span>EMI hàng tháng</span>
                <strong class="amount">{{formatCurrency(contractDetails.summary.monthlyEMI)}}</strong>
              </div>
              <div class="summary-item">
                <span>Tổng lãi</span>
                <strong class="amount">{{formatCurrency(contractDetails.summary.totalInterestPaid)}}</strong>
              </div>
              <div class="summary-item">
                <span>Tổng thanh toán</span>
                <strong class="amount highlight">{{formatCurrency(contractDetails.summary.totalAmountToPay)}}</strong>
              </div>
            </div>
          </div>

          <div class="card risk-card">
            <h3>Đánh giá rủi ro</h3>
            <div class="risk-assessment">
              <div class="risk-level" [class]="'level-' + contractDetails.additionalInfo.riskAssessment.level.toLowerCase()">
                <span class="risk-label">Mức độ rủi ro:</span>
                <strong>{{getRiskLevelText(contractDetails.additionalInfo.riskAssessment.level)}}</strong>
                <div class="risk-score">{{contractDetails.additionalInfo.riskAssessment.score}}/100</div>
              </div>
              <div class="risk-factors" *ngIf="contractDetails.additionalInfo.riskAssessment.factors.length > 0">
                <h4>Yếu tố rủi ro:</h4>
                <ul>
                  <li *ngFor="let factor of contractDetails.additionalInfo.riskAssessment.factors">{{factor}}</li>
                </ul>
              </div>
              <div class="risk-ratios">
                <div class="ratio-item">
                  <span>Tỷ lệ khoản vay/lương:</span>
                  <span>{{contractDetails.additionalInfo.riskAssessment.salaryToLoanRatio}}</span>
                </div>
                <div class="ratio-item">
                  <span>Tỷ lệ EMI/lương:</span>
                  <span>{{(contractDetails.additionalInfo.riskAssessment.emiToSalaryRatio * 100).toFixed(1)}}%</span>
                </div>
              </div>
            </div>
          </div>

          <div class="card eligibility-card">
            <h3>Điểm đánh giá</h3>
            <div class="eligibility-score">
              <div class="score-circle" [class]="'score-' + contractDetails.additionalInfo.eligibilityScore.level.toLowerCase()">
                <span class="score-value">{{contractDetails.additionalInfo.eligibilityScore.score}}</span>
                <span class="score-max">/100</span>
              </div>
              <div class="score-level">{{getEligibilityLevelText(contractDetails.additionalInfo.eligibilityScore.level)}}</div>
              <div class="score-factors" *ngIf="contractDetails.additionalInfo.eligibilityScore.factors.length > 0">
                <h4>Yếu tố tích cực:</h4>
                <ul>
                  <li *ngFor="let factor of contractDetails.additionalInfo.eligibilityScore.factors">{{factor}}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Customer Information -->
        <div class="card customer-info">
          <h3>Thông tin khách hàng</h3>
          <div class="customer-details-grid">
            <div class="detail-group">
              <h4>Thông tin cá nhân</h4>
              <div class="detail-items">
                <div class="detail-item">
                  <span>Họ và tên:</span>
                  <span>{{contractDetails.contract.name}}</span>
                </div>
                <div class="detail-item">
                  <span>Email:</span>
                  <span>{{contractDetails.contract.email}}</span>
                </div>
                <div class="detail-item">
                  <span>Số điện thoại:</span>
                  <span>{{contractDetails.contract.phone}}</span>
                </div>
                <div class="detail-item">
                  <span>Địa chỉ:</span>
                  <span>{{contractDetails.contract.address}}</span>
                </div>
                <div class="detail-item" *ngIf="contractDetails.contract.birthDay">
                  <span>Ngày sinh:</span>
                  <span>{{formatDate(contractDetails.contract.birthDay)}}</span>
                </div>
                <div class="detail-item" *ngIf="contractDetails.contract.gender">
                  <span>Giới tính:</span>
                  <span>{{contractDetails.contract.gender}}</span>
                </div>
                <div class="detail-item" *ngIf="contractDetails.contract.maritalStatus">
                  <span>Tình trạng hôn nhân:</span>
                  <span>{{contractDetails.contract.maritalStatus}}</span>
                </div>
              </div>
            </div>

            <div class="detail-group">
              <h4>Thông tin nghề nghiệp</h4>
              <div class="detail-items">
                <div class="detail-item">
                  <span>Nghề nghiệp:</span>
                  <span>{{contractDetails.contract.job}}</span>
                </div>
                <div class="detail-item">
                  <span>Thu nhập hàng tháng:</span>
                  <span class="amount">{{formatCurrency(contractDetails.contract.salary)}}</span>
                </div>
              </div>
            </div>

            <div class="detail-group" *ngIf="contractDetails.contract.user">
              <h4>Tài khoản liên kết</h4>
              <div class="detail-items">
                <div class="detail-item">
                  <span>Username:</span>
                  <span>{{contractDetails.contract.user.username}}</span>
                </div>
                <div class="detail-item">
                  <span>Email tài khoản:</span>
                  <span>{{contractDetails.contract.user.email}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Loan Package Information -->
        <div class="card loan-package-info" *ngIf="contractDetails.contract.loanPackage">
          <h3>Thông tin gói vay</h3>
          <div class="package-details">
            <div class="detail-item">
              <span>Tên gói:</span>
              <span>{{contractDetails.contract.loanPackage.name}}</span>
            </div>
            <div class="detail-item">
              <span>Lãi suất cơ bản:</span>
              <span>{{contractDetails.contract.loanPackage.baseInterestRate}}%/năm</span>
            </div>
            <div class="detail-item" *ngIf="contractDetails.contract.loanPackage.maxAmount">
              <span>Số tiền tối đa:</span>
              <span class="amount">{{formatCurrency(contractDetails.contract.loanPackage.maxAmount)}}</span>
            </div>
          </div>
        </div>

        <!-- Payment Schedule -->
        <div class="card payment-schedule">
          <h3>Lịch thanh toán</h3>
          <div class="schedule-table-container">
            <table class="schedule-table">
              <thead>
                <tr>
                  <th>Tháng</th>
                  <th>EMI</th>
                  <th>Tiền gốc</th>
                  <th>Tiền lãi</th>
                  <th>Số dư còn lại</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let item of contractDetails.paymentSchedule; let i = index">
                  <td>{{item.month}}</td>
                  <td class="amount">{{formatCurrency(item.emiAmount)}}</td>
                  <td class="amount">{{formatCurrency(item.principalAmount)}}</td>
                  <td class="amount">{{formatCurrency(item.interestAmount)}}</td>
                  <td class="amount" [class.zero-balance]="item.remainingBalance === 0">
                    {{formatCurrency(item.remainingBalance)}}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Notes and History -->
        <div class="card notes-history" *ngIf="contractDetails.contract.note || contractDetails.contract.contractDate">
          <h3>Ghi chú và lịch sử</h3>
          <div class="history-items">
            <div class="history-item" *ngIf="contractDetails.contract.contractDate">
              <div class="history-date">{{formatDate(contractDetails.contract.contractDate)}}</div>
              <div class="history-content">
                <strong>Hợp đồng được duyệt</strong>
                <p>Ngày ký hợp đồng chính thức</p>
              </div>
            </div>
            <div class="history-item" *ngIf="contractDetails.contract.note">
              <div class="history-date">{{formatDate(contractDetails.contract.updatedAt)}}</div>
              <div class="history-content">
                <strong>Ghi chú từ admin</strong>
                <p>{{contractDetails.contract.note}}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./loan-contract-details.component.css']
})
export class LoanContractDetailsComponent implements OnInit {
  contractId = 0;
  contractDetails: LoanContractDetails | null = null;
  isLoading = false;
  error: string | null = null;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private loanContractService = inject(LoanContractService);

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.contractId = +params['id'];
      if (this.contractId) {
        this.loadContractDetails();
      }
    });
  }

  async loadContractDetails() {
    if (!this.contractId) return;

    this.isLoading = true;
    this.error = null;

    try {
      // Sử dụng API chi tiết mới khi có sẵn, tạm thời dùng API cơ bản
      const response = await this.loanContractService.getLoanContractById(this.contractId).toPromise();
      
      if (response?.success) {
        // Tạm thời tạo mock data cho các thông tin chi tiết
        this.contractDetails = this.createMockDetails(response.data);
      } else {
        this.error = 'Không thể tải thông tin hợp đồng';
      }
    } catch (error: unknown) {
      console.error('Lỗi khi tải chi tiết hợp đồng:', error);
      this.error = error instanceof Error ? error.message : 'Có lỗi xảy ra khi tải dữ liệu';
    } finally {
      this.isLoading = false;
    }
  }

  private createMockDetails(contract: LoanContract): LoanContractDetails {
    // Tạo lịch thanh toán
    const paymentSchedule: PaymentScheduleItem[] = [];
    let remainingBalance = contract.loanAmount;
    const monthlyInterestRate = contract.interestRate / 100 / 12;

    for (let month = 1; month <= contract.loanTerm; month++) {
      const interestAmount = remainingBalance * monthlyInterestRate;
      const principalAmount = contract.EMI - interestAmount;
      remainingBalance -= principalAmount;

      paymentSchedule.push({
        month,
        emiAmount: Math.round(contract.EMI),
        principalAmount: Math.round(principalAmount),
        interestAmount: Math.round(interestAmount),
        remainingBalance: Math.round(Math.max(0, remainingBalance))
      });
    }

    // Tính toán đánh giá rủi ro
    const salaryToLoanRatio = contract.loanAmount / contract.salary;
    const emiToSalaryRatio = contract.EMI / contract.salary;
    
    let riskScore = 0;
    const riskFactors: string[] = [];

    if (salaryToLoanRatio > 10) {
      riskScore += 30;
      riskFactors.push('Tỷ lệ khoản vay/lương cao');
    } else if (salaryToLoanRatio > 5) {
      riskScore += 15;
    }

    if (emiToSalaryRatio > 0.5) {
      riskScore += 25;
      riskFactors.push('EMI chiếm quá 50% lương');
    } else if (emiToSalaryRatio > 0.3) {
      riskScore += 10;
    }

    if (contract.loanTerm > 24) {
      riskScore += 10;
    }

    let riskLevel = 'Low';
    if (riskScore >= 40) {
      riskLevel = 'High';
    } else if (riskScore >= 20) {
      riskLevel = 'Medium';
    }

    // Tính điểm đánh giá
    let eligibilityScore = 50;
    const eligibilityFactors: string[] = [];

    if (contract.salary >= 15000000) {
      eligibilityScore += 20;
      eligibilityFactors.push('Mức lương cao');
    } else if (contract.salary >= 10000000) {
      eligibilityScore += 10;
    }

    if (emiToSalaryRatio <= 0.3) {
      eligibilityScore += 15;
      eligibilityFactors.push('Tỷ lệ EMI/lương tốt');
    }

    eligibilityScore = Math.max(0, Math.min(100, eligibilityScore));

    let eligibilityLevel = 'Good';
    if (eligibilityScore >= 80) {
      eligibilityLevel = 'Excellent';
    } else if (eligibilityScore >= 60) {
      eligibilityLevel = 'Good';
    } else if (eligibilityScore >= 40) {
      eligibilityLevel = 'Fair';
    } else {
      eligibilityLevel = 'Poor';
    }

    return {
      contract,
      summary: {
        totalInterestPaid: contract.interestAmount,
        totalAmountToPay: contract.totalAmount,
        monthlyEMI: contract.EMI,
        effectiveInterestRate: contract.interestRate,
        loanDuration: `${contract.loanTerm} tháng`,
        approvalDate: contract.contractDate,
        applicationDate: contract.createdAt
      },
      paymentSchedule,
      additionalInfo: {
        riskAssessment: {
          level: riskLevel,
          score: riskScore,
          factors: riskFactors,
          salaryToLoanRatio: Math.round(salaryToLoanRatio * 100) / 100,
          emiToSalaryRatio: Math.round(emiToSalaryRatio * 100) / 100
        },
        eligibilityScore: {
          score: eligibilityScore,
          level: eligibilityLevel,
          factors: eligibilityFactors
        }
      }
    };
  }

  goBack() {
    this.router.navigate(['/admin/loan-applications']);
  }

  async approveContract() {
    if (!this.contractDetails) return;

    try {
      const response = await this.loanContractService.updateLoanContractStatus(
        this.contractId,
        'approved',
        'Hợp đồng đã được duyệt'
      ).toPromise();

      if (response?.success) {
        // Reload data
        this.loadContractDetails();
        alert('Duyệt hợp đồng thành công!');
      }
    } catch (error) {
      console.error('Lỗi khi duyệt hợp đồng:', error);
      alert('Có lỗi xảy ra khi duyệt hợp đồng');
    }
  }

  async rejectContract() {
    if (!this.contractDetails) return;

    const reason = prompt('Nhập lý do từ chối:');
    if (!reason) return;

    try {
      const response = await this.loanContractService.updateLoanContractStatus(
        this.contractId,
        'rejected',
        reason
      ).toPromise();

      if (response?.success) {
        // Reload data
        this.loadContractDetails();
        alert('Từ chối hợp đồng thành công!');
      }
    } catch (error) {
      console.error('Lỗi khi từ chối hợp đồng:', error);
      alert('Có lỗi xảy ra khi từ chối hợp đồng');
    }
  }

  printContract() {
    window.print();
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

  getRiskLevelText(level: string): string {
    const map: Record<string, string> = {
      'Low': 'Thấp',
      'Medium': 'Trung bình',
      'High': 'Cao'
    };
    return map[level] || level;
  }

  getEligibilityLevelText(level: string): string {
    const map: Record<string, string> = {
      'Excellent': 'Xuất sắc',
      'Good': 'Tốt',
      'Fair': 'Khá',
      'Poor': 'Kém'
    };
    return map[level] || level;
  }
}
