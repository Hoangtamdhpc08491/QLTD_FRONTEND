import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoanContract {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  salary: number;
  maritalStatus?: string;
  job: string;
  birthDay?: string;
  gender?: string;
  userId: number;
  loanPackageId: number;
  loanTerm: number;
  loanAmount: number;
  interestRate: number;
  interestAmount: number;
  totalAmount: number;
  EMI: number;
  status: 'pending' | 'approved' | 'rejected';
  note?: string;
  contractDate?: string;
  createdAt: string;
  updatedAt: string;
  loanPackage?: {
    id: number;
    name: string;
    baseInterestRate: number;
    maxAmount?: number;
  };
  user?: {
    id: number;
    username: string;
    name: string;
    email: string;
  };
}

export interface CreateLoanContractRequest {
  name: string;
  email: string;
  phone: string;
  address: string;
  salary: number;
  maritalStatus?: string;
  job: string;
  birthDay?: string;
  gender?: string;
  loanPackageId: number;
  loanTerm: number;
  loanAmount: number;
}

export interface UpdateLoanContractRequest {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  salary?: number;
  maritalStatus?: string;
  job?: string;
  birthDay?: string;
  gender?: string;
  loanPackageId?: number;
  loanTerm?: number;
  loanAmount?: number;
}

export interface LoanContractResponse {
  success: boolean;
  message: string;
  data: LoanContract[];
  pagination?: {
    totalCount: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

export interface SingleLoanContractResponse {
  success: boolean;
  message: string;
  data: LoanContract;
}

export interface LoanCalculationRequest {
  loanPackageId: number;
  loanAmount: number;
  loanTerm: number;
}

export interface LoanCalculationResponse {
  success: boolean;
  data: {
    loanAmount: number;
    loanTerm: number;
    interestRate: number;
    interestAmount: number;
    totalAmount: number;
    emi: number;
    loanPackage: {
      id: number;
      name: string;
    };
  };
}

export interface LoanContractStats {
  totalContracts: number;
  pendingContracts: number;
  approvedContracts: number;
  rejectedContracts: number;
  totalApprovedAmount: number;
}

export interface QueryParams {
  page?: number;
  limit?: number;
  status?: string;
  userId?: number;
  loanPackageId?: number;
  search?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoanContractService {
  private apiUrl = 'http://localhost:3000/api';
  private http = inject(HttpClient);

  // User APIs - Quản lý đơn vay của người dùng
  createLoanContract(contractData: CreateLoanContractRequest): Observable<SingleLoanContractResponse> {
    return this.http.post<SingleLoanContractResponse>(`${this.apiUrl}/client/loan-contracts`, contractData);
  }

  getUserLoanContracts(params?: QueryParams): Observable<LoanContractResponse> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.keys(params).forEach(key => {
        const value = params[key as keyof QueryParams];
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }

    return this.http.get<LoanContractResponse>(`${this.apiUrl}/client/loan-contracts`, { params: httpParams });
  }

  getUserLoanContractById(id: number): Observable<SingleLoanContractResponse> {
    return this.http.get<SingleLoanContractResponse>(`${this.apiUrl}/client/loan-contracts/${id}`);
  }

  updateUserLoanContract(id: number, contractData: UpdateLoanContractRequest): Observable<SingleLoanContractResponse> {
    return this.http.put<SingleLoanContractResponse>(`${this.apiUrl}/client/loan-contracts/${id}`, contractData);
  }

  deleteUserLoanContract(id: number): Observable<{success: boolean; message: string}> {
    return this.http.delete<{success: boolean; message: string}>(`${this.apiUrl}/client/loan-contracts/${id}`);
  }

  calculateLoanInfo(calculationData: LoanCalculationRequest): Observable<LoanCalculationResponse> {
    return this.http.post<LoanCalculationResponse>(`${this.apiUrl}/client/loan-contracts/calculate`, calculationData);
  }

  // Admin APIs - Quản lý tất cả đơn vay
  getAllLoanContracts(params?: QueryParams): Observable<LoanContractResponse> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.keys(params).forEach(key => {
        const value = params[key as keyof QueryParams];
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }

    return this.http.get<LoanContractResponse>(`${this.apiUrl}/admin/loan-contracts`, { params: httpParams });
  }

  getLoanContractById(id: number): Observable<SingleLoanContractResponse> {
    return this.http.get<SingleLoanContractResponse>(`${this.apiUrl}/admin/loan-contracts/${id}`);
  }

  updateLoanContract(id: number, contractData: UpdateLoanContractRequest): Observable<SingleLoanContractResponse> {
    return this.http.put<SingleLoanContractResponse>(`${this.apiUrl}/admin/loan-contracts/${id}`, contractData);
  }

  updateLoanContractStatus(id: number, status: string, note?: string): Observable<SingleLoanContractResponse> {
    return this.http.put<SingleLoanContractResponse>(`${this.apiUrl}/admin/loan-contracts/${id}/status`, { status, note });
  }

  deleteLoanContract(id: number): Observable<{success: boolean; message: string}> {
    return this.http.delete<{success: boolean; message: string}>(`${this.apiUrl}/admin/loan-contracts/${id}`);
  }

  getLoanContractStats(): Observable<{success: boolean; data: LoanContractStats}> {
    return this.http.get<{success: boolean; data: LoanContractStats}>(`${this.apiUrl}/admin/loan-contracts/stats`);
  }

  // Utility methods
  getStatusText(status: string): string {
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
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('vi-VN');
  }
}
