import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoanPackage {
  id: number;
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

@Injectable({
  providedIn: 'root'
})
export class LoanPackageService {
  private apiUrl = 'http://localhost:3000/api/client/loan-packages';

  constructor(private http: HttpClient) {}

  // Lấy tất cả loan packages công khai
  getAllLoanPackages(): Observable<ApiResponse<LoanPackage[]>> {
    return this.http.get<ApiResponse<LoanPackage[]>>(this.apiUrl);
  }

  // Lấy loan package theo ID
  getLoanPackageById(id: number): Observable<ApiResponse<LoanPackage>> {
    return this.http.get<ApiResponse<LoanPackage>>(`${this.apiUrl}/${id}`);
  }

  // Lấy loan packages theo category
  getLoanPackagesByCategory(categoryId: number): Observable<ApiResponse<LoanPackage[]>> {
    return this.http.get<ApiResponse<LoanPackage[]>>(`${this.apiUrl}/category/${categoryId}`);
  }
}
