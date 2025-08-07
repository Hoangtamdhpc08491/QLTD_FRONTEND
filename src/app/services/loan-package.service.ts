import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoanPackage {
  id: number;
  name: string;
  baseInterestRate: number;
  interestRate2?: number;
  interestRate3?: number;
  maxAmount?: number; // Thêm trường maxAmount
  description1: string;
  description2?: string;
  description3?: string;
  description4?: string;
  description5?: string;
  description6?: string;
  image?: string;
  categoryId?: number;
  category?: {
    id: number;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface CreateLoanPackageRequest {
  name: string;
  baseInterestRate: number;
  interestRate2?: number;
  interestRate3?: number;
  description1: string;
  description2?: string;
  description3?: string;
  description4?: string;
  description5?: string;
  description6?: string;
  image?: string;
  categoryId?: number;
}

export interface UpdateLoanPackageRequest {
  name?: string;
  baseInterestRate?: number;
  interestRate2?: number;
  interestRate3?: number;
  description1?: string;
  description2?: string;
  description3?: string;
  description4?: string;
  description5?: string;
  description6?: string;
  image?: string;
  categoryId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class LoanPackageService {
  private apiUrl = 'http://localhost:3000/api';
  private http = inject(HttpClient);

  // Public endpoints
  getAllLoanPackages(): Observable<ApiResponse<LoanPackage[]>> {
    return this.http.get<ApiResponse<LoanPackage[]>>(`${this.apiUrl}/client/loan-packages`);
  }

  getLoanPackageById(id: number): Observable<ApiResponse<LoanPackage>> {
    return this.http.get<ApiResponse<LoanPackage>>(`${this.apiUrl}/client/loan-packages/${id}`);
  }

  getLoanPackagesByCategory(categoryId: number): Observable<ApiResponse<LoanPackage[]>> {
    return this.http.get<ApiResponse<LoanPackage[]>>(`${this.apiUrl}/client/loan-packages/category/${categoryId}`);
  }

  // Admin endpoints
  getAdminLoanPackages(): Observable<ApiResponse<LoanPackage[]>> {
    return this.http.get<ApiResponse<LoanPackage[]>>(`${this.apiUrl}/admin/loan-packages`);
  }

  createLoanPackage(packageData: CreateLoanPackageRequest): Observable<ApiResponse<LoanPackage>> {
    return this.http.post<ApiResponse<LoanPackage>>(`${this.apiUrl}/admin/loan-packages/create`, packageData);
  }

  updateLoanPackage(id: number, packageData: UpdateLoanPackageRequest): Observable<ApiResponse<LoanPackage>> {
    return this.http.put<ApiResponse<LoanPackage>>(`${this.apiUrl}/admin/loan-packages/update/${id}`, packageData);
  }

  deleteLoanPackage(id: number): Observable<ApiResponse<{message: string}>> {
    return this.http.delete<ApiResponse<{message: string}>>(`${this.apiUrl}/admin/loan-packages/delete/${id}`);
  }
}
