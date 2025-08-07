import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { News, NewsResponse } from '../models/news.interface';

export interface NewsQueryParams {
  page?: number;
  limit?: number;
  categoryId?: number;
  search?: string;
  status?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api';

  // Client APIs - Lấy tin tức cho người dùng
  getPublicNews(params?: NewsQueryParams): Observable<NewsResponse> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.keys(params).forEach(key => {
        const value = params[key as keyof NewsQueryParams];
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }

    return this.http.get<NewsResponse>(`${this.apiUrl}/client/news`, { params: httpParams });
  }

  getPublicNewsById(id: number): Observable<{ success: boolean; message: string; data: News }> {
    return this.http.get<{ success: boolean; message: string; data: News }>(`${this.apiUrl}/client/news/${id}`);
  }

  // Admin APIs - Quản lý tin tức (cần authentication)
  getAllNews(params?: NewsQueryParams): Observable<NewsResponse> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.keys(params).forEach(key => {
        const value = params[key as keyof NewsQueryParams];
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }

    return this.http.get<NewsResponse>(`${this.apiUrl}/admin/news`, { params: httpParams });
  }

  getNewsById(id: number): Observable<{ success: boolean; message: string; data: News }> {
    return this.http.get<{ success: boolean; message: string; data: News }>(`${this.apiUrl}/admin/news/${id}`);
  }

  createNews(newsData: Partial<News>): Observable<{ success: boolean; message: string; data: News }> {
    return this.http.post<{ success: boolean; message: string; data: News }>(`${this.apiUrl}/admin/news/create`, newsData);
  }

  updateNews(id: number, newsData: Partial<News>): Observable<{ success: boolean; message: string; data: News }> {
    return this.http.put<{ success: boolean; message: string; data: News }>(`${this.apiUrl}/admin/news/${id}`, newsData);
  }

  deleteNews(id: number): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/admin/news/delete/${id}`);
  }

  toggleVisibility(id: number): Observable<{ success: boolean; message: string; data: { hidden: boolean } }> {
    return this.http.patch<{ success: boolean; message: string; data: { hidden: boolean } }>(`${this.apiUrl}/admin/news/${id}/toggle-visibility`, {});
  }
    getCategoryById(categoryId: number): Observable<{ success: boolean; message: string; data: { name: string } }> {
        return this.http.get<{ success: boolean; message: string; data: { name: string } }>(`${this.apiUrl}/client/news/categories/${categoryId}`);
    }
}
