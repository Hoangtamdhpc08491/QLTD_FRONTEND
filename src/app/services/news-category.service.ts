import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NewsCategory, NewsCategoryResponse } from '../models/news.interface';

@Injectable({
  providedIn: 'root'
})
export class NewsCategoryService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api';

  // Client APIs - Lấy danh mục cho người dùng
  getPublicCategories(): Observable<NewsCategoryResponse> {
    return this.http.get<NewsCategoryResponse>(`${this.apiUrl}/client/news-categories`);
  }

  // Admin APIs - Quản lý danh mục (cần authentication)
  getAllCategories(): Observable<NewsCategoryResponse> {
    return this.http.get<NewsCategoryResponse>(`${this.apiUrl}/admin/news-categories`);
  }

  getCategoryById(id: number): Observable<{ success: boolean; message: string; data: NewsCategory }> {
    return this.http.get<{ success: boolean; message: string; data: NewsCategory }>(`${this.apiUrl}/admin/news-categories/${id}`);
  }

  createCategory(categoryData: Partial<NewsCategory>): Observable<{ success: boolean; message: string; data: NewsCategory }> {
    return this.http.post<{ success: boolean; message: string; data: NewsCategory }>(`${this.apiUrl}/admin/news-categories/create`, categoryData);
  }

  updateCategory(id: number, categoryData: Partial<NewsCategory>): Observable<{ success: boolean; message: string; data: NewsCategory }> {
    return this.http.put<{ success: boolean; message: string; data: NewsCategory }>(`${this.apiUrl}/admin/news-categories/update/${id}`, categoryData);
  }

  deleteCategory(id: number): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/admin/news-categories/delete/${id}`);
  }
}
