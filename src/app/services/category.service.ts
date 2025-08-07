import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Category {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'http://localhost:3000/api';
  private http = inject(HttpClient);

  // Lấy tất cả categories (public)
  getAllCategories(): Observable<ApiResponse<Category[]>> {
    return this.http.get<ApiResponse<Category[]>>(`${this.apiUrl}/client/categories`);
  }

  // Lấy category theo ID (public)
  getCategoryById(id: number): Observable<ApiResponse<Category>> {
    return this.http.get<ApiResponse<Category>>(`${this.apiUrl}/client/categories/${id}`);
  }

  // Admin endpoints
  getAdminCategories(): Observable<ApiResponse<Category[]>> {
    return this.http.get<ApiResponse<Category[]>>(`${this.apiUrl}/admin/categories`);
  }

  createCategory(categoryData: CreateCategoryRequest): Observable<ApiResponse<Category>> {
    return this.http.post<ApiResponse<Category>>(`${this.apiUrl}/admin/categories/create`, categoryData);
  }

  updateCategory(id: number, categoryData: UpdateCategoryRequest): Observable<ApiResponse<Category>> {
    return this.http.put<ApiResponse<Category>>(`${this.apiUrl}/admin/categories/update/${id}`, categoryData);
  }

  deleteCategory(id: number): Observable<ApiResponse<{message: string}>> {
    return this.http.delete<ApiResponse<{message: string}>>(`${this.apiUrl}/admin/categories/delete/${id}`);
  }
}
